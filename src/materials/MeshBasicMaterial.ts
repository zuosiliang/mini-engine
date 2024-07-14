import Material from "../Material";
import Shader from "../Shader";

class MeshBasicMaterial extends Material {
  color: [number, number, number];

  constructor(color: [number, number, number]) {
    super();
    this.color = color;
  }

  updateShader(shader: Shader): void {
    this.shader = shader;
  }

  bind() {
    const { shader } = this;

    if (shader) {
      shader.setVec3("uColor", this.color);
    }
  }
}

export default MeshBasicMaterial;
