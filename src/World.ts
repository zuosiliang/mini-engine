import Object3D from "./Object3D";
import Camera from "./Camera";
import Renderer from "./Renderer";

class World {
  objs: Object3D[];
  renderer: Renderer;
  constructor() {
    this.objs = [];
    this.renderer = window.renderer;
  }
  add(obj: Object3D | Camera) {
    if (obj instanceof Camera) {
      this.renderer.updateCamera(obj);
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
