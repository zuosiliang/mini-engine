import Material from "../Material";
import Shader from "../Shader";
import Texture from "../textures/Texture";
class MeshBasicMaterial extends Material {
  color: [number, number, number];
  colorMap: Texture;

  constructor(configs) {
    const { color, colorMap } = configs;
    super();
    this.color = color;
    this.colorMap = colorMap;
    this.renderer = window.renderer;
  }

  updateShader(shader: Shader): void {
    this.shader = shader;
  }

  bind() {
    const { shader } = this;
    const { gl } = this.renderer;

    if (shader) {
      if (this.colorMap) {
        shader.setInt("uUseTexture", 1);
        shader.setInt("u_texture", 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.colorMap.texture);
        return;
      }
      shader.setInt("uUseTexture", 0);
      shader.setVec3("uColor", this.color);
    }
  }
}

export default MeshBasicMaterial;
