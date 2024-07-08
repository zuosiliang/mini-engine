import Box from "./Box";

class World {
  meshes: Box[];
  constructor() {
    this.meshes = [];
  }
  add(mesh: Box) {
    this.meshes = [...this.meshes, mesh];
  }
  render() {
    this.meshes.forEach((mesh) => {
      mesh.render();
    });
  }
}

export default World;
