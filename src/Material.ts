import Geometry from "./Geometry";
import Renderer from "./Renderer";

abstract class Material {
  shaderProgram: WebGLProgram | null | undefined;
  render(geometry: Geometry) {
    console.log(geometry);
  }

  initShaderProgram() {}
  renderer: Renderer;
  constructor() {
    this.renderer = window.renderer;
  }
  abstract bind(geometry: Geometry): void;
}
export default Material;
