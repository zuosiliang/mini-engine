import Camera from "./cameras/PerspectiveCamera";
import Renderer from "./Renderer";
import Light from "./Light";
import Mesh from "./Mesh";
import Skybox from "./Skybox";

class World {
  objs: Mesh[];
  renderer: Renderer;
  constructor() {
    this.objs = [];
    this.renderer = window.renderer;
  }
  add(obj: Mesh | Camera | Light | Skybox) {
    if (obj instanceof Camera) {
      this.renderer.updateCamera(obj);
      return;
    }
    if (obj instanceof Light) {
      this.renderer.updateLights(obj);
      return;
    }
    if (obj instanceof Skybox) {
      this.renderer.updateSkybox(obj);
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
