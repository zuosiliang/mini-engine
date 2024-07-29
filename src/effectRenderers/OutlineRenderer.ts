import Mesh from "../Mesh";
import MeshBasicMaterial from "../materials/MeshBasicMaterial";

class OutlineRenderer {
  modifiedMorld: any[];
  gl: any;
  constructor(configs) {
    const { renderer, outlineColor, outlineSize } = configs;
    const { world, gl, skybox } = renderer;

    this.selectedObjects = [];
    this.renderer = renderer;
    this.gl = gl;
    this.skybox = skybox;
  }

  updateSelectedObjects(selectedObjects) {
    const { world } = this.renderer;
    this.selectedObjects = selectedObjects;

    const modifiedWorld = [];
    world.objs.forEach((mesh: Mesh) => {
      const pair = {};
      pair.originMesh = mesh;

      if (this.selectedObjects.includes(mesh.id)) {
        const outlineMesh = new Mesh(
          mesh.geometry,
          new MeshBasicMaterial({ color: [0, 0.4, 1] }),
        );

        outlineMesh.setPosition(
          mesh.position[0],
          mesh.position[1],
          mesh.position[2],
        );
        outlineMesh.setRotation(mesh.rotation);
        outlineMesh.setScale(1.05, 1.05, 1.05);

        pair.outlineMesh = outlineMesh;
      }

      modifiedWorld.push(pair);
    });
    this.modifiedMorld = modifiedWorld;
  }

  render() {
    const { gl, skybox } = this;
    gl.enable(gl.STENCIL_TEST);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clearStencil(0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    skybox.render();

    this.modifiedMorld.forEach((pair) => {
      if (pair.outlineMesh) {
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.stencilFunc(gl.ALWAYS, 1, 0xff);
        gl.stencilMask(0xff);
        pair.originMesh.render();

        gl.stencilFunc(gl.NOTEQUAL, 1, 0xff);
        gl.stencilMask(0x00);
        pair.outlineMesh.render();
      } else {
        pair.originMesh.render();
      }
    });
  }
}

export default OutlineRenderer;
