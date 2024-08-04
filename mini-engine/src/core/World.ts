import PerspectiveCamera from "../cameras/PerspectiveCamera";
import Renderer from "./Renderer";
import PointLight from "../lights/PointLight";
import Mesh from "./Mesh";
import Skybox from "../extras/Skybox";

type Thing = Mesh | PerspectiveCamera | PointLight | Skybox;

let worldInstance: World;
class World {
  meshes: Mesh[] = [];
  renderer: Renderer = new Renderer();
  constructor() {
    if (worldInstance) {
      return worldInstance;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    worldInstance = this;
  }
  add(thing: Thing) {
    if (thing instanceof PerspectiveCamera) {
      this.renderer.updateCamera(thing);
      return;
    }
    if (thing instanceof PointLight) {
      this.renderer.updateLights(thing);
      return;
    }
    if (thing instanceof Skybox) {
      this.renderer.updateSkybox(thing);
      return;
    }
    this.meshes = [...this.meshes, thing];
  }
  render() {
    this.meshes.forEach((mesh) => {
      mesh.render();
    });
  }
}

export default World;
