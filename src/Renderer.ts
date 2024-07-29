import World from "./World";
import Camera from "./Camera";
import Light from "./Light";
import Skybox from "./Skybox";
import LoadingManager from "./loaders/LoadingManager";
import Shader from "./Shader";

export enum MaterialType {
  MeshPhongMaterial = "MeshPhongMaterial",
  MeshBasicMaterial = "MeshBasicMaterial",
}

class Renderer {
  gl!: WebGL2RenderingContext;
  canvas!: HTMLCanvasElement;
  world: World | undefined;
  camera: Camera;
  lights: Light[];
  skybox: Skybox | undefined;
  shaders: Record<MaterialType, null | Shader>;

  constructor(canvas?: HTMLCanvasElement) {
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
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    });

    window.renderer = this;
    window.loadingManager = new LoadingManager();

    this.world = new World();

    this.camera = new Camera(
      (45 * Math.PI) / 180,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100.0,
    );

    this.lights = [];
    this.shaders = {
      MeshPhongMaterial: null,
      MeshBasicMaterial: null,
    };
  }

  updateCamera(newCamera: Camera) {
    this.camera = newCamera;
  }

  updateLights(newLight: Light) {
    this.lights = [...this.lights, newLight];
  }

  updateSkybox(newSkybox: Skybox) {
    this.skybox = newSkybox;
  }

  render() {
    // window.loadingManager.setOnLoad(() => {
    if (!this.world) {
      throw new Error("world is undefined");
    }
    const { gl, skybox } = this;
    gl.enable(gl.STENCIL_TEST);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    gl.depthMask(false);

    skybox.render();
    gl.depthMask(true);

    this.world.render();

    // });
  }
}

export default Renderer;
