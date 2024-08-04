import Mesh from "../core/Mesh";
import MeshBasicMaterial from "../materials/MeshBasicMaterial";
import Renderer from "../core/Renderer";
import World from "../core/World";

class GPUPicker {
  coloredMeshes: Mesh[] = [];
  renderTarget: WebGLFramebuffer | null = null;
  renderer: Renderer = new Renderer();
  constructor() {
    this.#setupFramebuffer();
  }

  #setupFramebuffer() {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      gl.canvas.width,
      gl.canvas.height,
    );

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      renderbuffer,
    );

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.renderTarget = framebuffer;
  }

  pick(pointer: { x: number; y: number }, world: World) {
    if (!world) {
      throw new Error("world can not be empty!");
    }
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    this.#renderForPicking(world);
    const x = pointer.x;
    const y = pointer.y;
    const pixel = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    const id = pixel[0] + pixel[1] * 256 + pixel[2] * 256 * 256;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const selected: string[] = [];
    world.meshes.forEach((mesh, index) => {
      if (index == id - 1) {
        selected.push(mesh.id);
      }
    });
    return selected;
  }

  #renderForPicking(world: World) {
    const { meshes } = world;
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderTarget);

    ///如果注释掉这两行，就会永远选中id1
    gl.clearColor(0, 0, 0, 1); // Clear to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const coloredMeshes: Mesh[] = [];

    meshes.forEach((mesh: Mesh, index: number) => {
      const color: ThreeNumbers = [
        ((index + 1) & 0xff) / 255,
        (((index + 1) >> 8) & 0xff) / 255,
        (((index + 1) >> 16) & 0xff) / 255,
      ];
      const coloredMesh = new Mesh(
        mesh.geometry,
        new MeshBasicMaterial({
          color,
        }),
      );
      coloredMesh.setPosition(
        mesh.position[0],
        mesh.position[1],
        mesh.position[2],
      );
      coloredMesh.setRotation(mesh.rotation);
      coloredMesh.setScale(mesh.scale[0], mesh.scale[1], mesh.scale[2]);
      coloredMeshes.push(coloredMesh);
    });
    this.coloredMeshes = coloredMeshes;
    this.coloredMeshes.forEach((coloredMesh) => {
      coloredMesh.render();
    });
  }
}

export default GPUPicker;
