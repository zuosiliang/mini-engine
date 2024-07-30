import Renderer from "../core/Renderer";
import Shader from "../core/Shader";

abstract class Material {
  shader: Shader | undefined;

  initShaderProgram() {}
  renderer: Renderer;
  constructor() {
    this.renderer = window.renderer;
  }
  abstract bind(): void;
  abstract updateShader(shader: Shader): void;
}
export default Material;
