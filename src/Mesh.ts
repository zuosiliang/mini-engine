import Material from "./Material";
import Renderer from "./Renderer";
import Geometry from "./Geometry";

class Mesh {
  geometry: Geometry;
  material: Material;
  renderer: Renderer;
  shaderProgram: WebGLProgram | null | undefined;
  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
    this.renderer = window.renderer;
    this.shaderProgram = this.material.shaderProgram;
  }

  render() {
    const { geometry, material } = this;
    geometry.bind(this.shaderProgram);
    material.bind(geometry);

    this.draw();
  }

  private draw() {
    const { gl } = this.renderer;
    const { geometry } = this;

    const vertexCount = geometry.buffers.indices.data.length;
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
  }
}

export default Mesh;
