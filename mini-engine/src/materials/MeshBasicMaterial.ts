import Material from "./Material";
import Texture from "../textures/Texture";

interface MeshBasicMaterialProps {
  color: ThreeNumbers;
  colorMap?: Texture;
}

class MeshBasicMaterial extends Material {
  color: ThreeNumbers = [1, 1, 1];
  colorMap: Texture | null = null;

  constructor(props: MeshBasicMaterialProps) {
    const { color, colorMap } = props;
    super({ color, colorMap });
    this.color = color ?? this.color;
    this.colorMap = colorMap ?? this.colorMap;
  }

  bind() {
    const {
      shader,
      renderer: { gl },
    } = this;

    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shader) {
      throw new Error("the shader can not be empty");
    }
    if (this.colorMap) {
      shader.setInt("uUseTexture", 1);
      shader.setInt("u_texture", 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.colorMap.webglTexture);
      return;
    }
    shader.setInt("uUseTexture", 0);
    shader.setVec3("uColor", this.color);
  }
}

export default MeshBasicMaterial;
