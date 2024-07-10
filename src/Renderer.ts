import World from "./World";
import Camera from "./Camera";

class Renderer {
  gl!: WebGL2RenderingContext;
  canvas!: HTMLCanvasElement;
  world: World | undefined;
  camera: Camera;

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) {
      this.canvas = canvas;
    } else {
      throw new Error("The provided canvas is not or undefined");
    }

    const gl = this.canvas.getContext("webgl2");
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
    this.world = new World();

    this.camera = new Camera(
      (45 * Math.PI) / 180,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100.0,
    );
  }

  updateCamera(newCamera: Camera) {
    this.camera = newCamera;
  }

  render() {
    if (!this.world) {
      throw new Error("world is undefined");
    }
    const { gl } = this;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.world.render();
  }
}

export default Renderer;