import World from "./World";
import Camera from "../cameras/PerspectiveCamera";
import Skybox from "../extras/Skybox";
import LoadingManager from "../loaders/LoadingManager";
import Shader from "./Shader";
import PointLight from "../lights/PointLight";

export enum MaterialType {
  MeshPhongMaterial = "MeshPhongMaterial",
  MeshBasicMaterial = "MeshBasicMaterial",
}

let rendererInstance: Renderer;
class Renderer {
  gl: WebGL2RenderingContext | null = null;
  canvas: HTMLCanvasElement | null = null;
  camera: Camera | null = null;
  lights: PointLight[] = [];
  skybox: Skybox | null = null;
  shaders: Record<MaterialType, null | Shader> = {
    MeshPhongMaterial: null,
    MeshBasicMaterial: null,
  };
  loadingManager: LoadingManager = new LoadingManager();

  constructor(canvas?: HTMLCanvasElement) {
    if (rendererInstance) {
      return rendererInstance;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    rendererInstance = this;

    if (canvas) {
      this.canvas = canvas;
    } else {
      throw new Error("The provided canvas is not or undefined");
    }

    const gl = this.canvas.getContext("webgl2", { stencil: true });
    if (gl) {
      this.gl = gl;
    } else {
      throw new Error("No WebGL2 support");
    }

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.enable(gl.STENCIL_TEST);
    this.gl.enable(gl.DEPTH_TEST);
    this.gl.depthFunc(gl.LEQUAL);

    this.camera = new Camera({
      fov: (45 * Math.PI) / 180,
      aspect: canvas.clientWidth / canvas.clientHeight,
      near: 0.1,
      far: 100.0,
    });
  }

  resize(w: number, h: number) {
    const { canvas, gl } = this;
    if (!canvas) {
      throw new Error("the canvas went wrong");
    }
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  updateCamera(camera: Camera) {
    this.camera = camera;
  }

  updateLights(light: PointLight) {
    this.lights = [...this.lights, light];
  }

  updateSkybox(newSkybox: Skybox) {
    this.skybox = newSkybox;
  }

  render(world: World) {
    if (!world) {
      throw new Error("world can not be empty!");
    }
    const { gl, skybox } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    world.render();
    if (skybox) {
      skybox.render();
    }
  }
}

export default Renderer;
