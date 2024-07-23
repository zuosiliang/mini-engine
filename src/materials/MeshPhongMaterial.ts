import Material from "../Material";
import Shader from "../Shader";
import Texture from "../textures/Texture";

class MeshPhongMaterial extends Material {
  color: [number, number, number];
  specular: [number, number, number];
  shininess: number;
  colorMap: Texture;

  constructor(configs) {
    super();
    const { color, specular, shininess, colorMap } = configs;
    this.color = color;
    this.specular = specular;
    this.shininess = shininess;
    this.colorMap = colorMap;
  }

  updateShader(shader: Shader): void {
    this.shader = shader;
  }

  bind() {
    const { shader } = this;
    const { gl } = this.renderer;

    if (shader) {
      const lightConfigs = this.calcLights();

      if (this.colorMap) {
        shader.setInt("uUseTexture", 1);
        shader.setInt("u_texture", 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.colorMap.texture);
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
      shader.setVec3(
        "uLightColors",
        new Float32Array(lightConfigs.lightColors),
      );
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
  }

  private calcLights() {
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
