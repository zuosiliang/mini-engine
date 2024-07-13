import Camera from "./Camera";
import Renderer from "./Renderer";
import Light from "./Light";
import Mesh from "./Mesh";

class World {
  objs: Mesh[];
  renderer: Renderer;
  constructor() {
    this.objs = [];
    this.renderer = window.renderer;
  }
  add(obj: Mesh | Camera | Light) {
    if (obj instanceof Camera) {
      this.renderer.updateCamera(obj);
      return;
    }
    if (obj instanceof Light) {
      this.renderer.updateLights(obj);
      return;
    }
    this.objs = [...this.objs, obj];
  }
  render() {
    this.objs.forEach((obj) => {
      obj.render();
    });
  }
}

export default World;
