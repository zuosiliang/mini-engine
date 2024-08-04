import Material from "./Material";
import Texture from "../textures/Texture";

interface MeshPhongMaterialProps {
  color: ThreeNumbers;
  specular: ThreeNumbers;
  shininess: number;
  colorMap?: Texture;
}

class MeshPhongMaterial extends Material {
  color: ThreeNumbers = [1, 1, 1];
  specular: ThreeNumbers = [1, 1, 1];
  shininess: number = 300;
  colorMap: Texture | null = null;

  constructor(props: MeshPhongMaterialProps) {
    const { color, specular, shininess, colorMap } = props;
    super({ color, colorMap });
    this.color = color ?? this.color;
    this.specular = specular ?? this.specular;
    this.shininess = shininess ?? this.shininess;
    this.colorMap = colorMap ?? this.colorMap;
  }

  bind() {
    const {
      shader,
      renderer: { gl },
    } = this;

    if (!gl) {
      throw new Error("the gl context went wrong");
    }
    if (!shader) {
      throw new Error("the shader went wrong");
    }
    const lightConfigs = this.#calcPointLights();

    if (this.colorMap) {
      shader.setInt("uUseTexture", 1);
      shader.setInt("u_texture", 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.colorMap.webglTexture);
    } else {
      shader.setInt("uUseTexture", 0);
      shader.setVec3("uMaterialColor", this.color);
    }
    shader.setVec3("uMaterialSpecular", this.specular);
    shader.setFloat("uMaterialShininess", this.shininess);

    shader.setVec3(
      "uLightPositions",
      new Float32Array(lightConfigs.lightPositions),
    );
    shader.setVec3("uLightColors", new Float32Array(lightConfigs.lightColors));
    shader.setFloatArr(
      "uLightConstants",
      new Float32Array(lightConfigs.lightConstants),
    );
    shader.setFloatArr(
      "uLightLinears",
      new Float32Array(lightConfigs.lightLinears),
    );
    shader.setFloatArr(
      "uLightQuadratics",
      new Float32Array(lightConfigs.lightQuadratics),
    );
  }

  #calcPointLights() {
    const { lights } = this.renderer;

    const lightPositions = lights
      .map((light) => {
        return light.position;
      })
      .flat();

    const lightColors = lights
      .map((light) => {
        return light.color;
      })
      .flat();
    const lightConstants = lights.map((light) => {
      return light.constant;
    });
    const lightLinears = lights.map((light) => {
      return light.linear;
    });
    const lightQuadratics = lights.map((light) => {
      return light.quadratic;
    });

    return {
      lightPositions,
      lightColors,
      lightConstants,
      lightLinears,
      lightQuadratics,
    };
  }
}

export default MeshPhongMaterial;
