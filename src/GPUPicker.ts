import Mesh from "./Mesh";
import MeshBasicMaterial from "./materials/MeshBasicMaterial";

class GPUPicker {
  gl: any;
  world: any;
  coloredMeshes: never[];
  renderTarget: any;
  constructor(configs) {
    const { renderer, canvas } = configs;
    const { gl, world } = renderer;

    this.gl = gl;
    this.world = world;
    this.coloredMeshes = [];
    this.setupFramebuffer();
  }

  setupFramebuffer() {
    const { gl } = this;
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

  pick(pointer) {
    const { gl, world } = this;
    this.renderForPicking();
    const x = pointer.x;
    const y = pointer.y;
    const pixel = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    const id = pixel[0] + pixel[1] * 256 + pixel[2] * 256 * 256;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const selected = [];
    world.objs.forEach((obj, index) => {
      if (index == id - 1) {
        selected.push(obj.id);
      }
    });
    return selected;
  }

  renderForPicking() {
    const { gl, world } = this;
    const { objs } = world;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderTarget);

    ///如果注释掉这两行，就会永远选中id1
    gl.clearColor(0, 0, 0, 1); // Clear to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const coloredMeshes = [];

    objs.forEach((mesh: Mesh, index: number) => {
      const color = [
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
