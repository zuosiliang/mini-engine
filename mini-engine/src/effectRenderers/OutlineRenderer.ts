import Mesh from "../core/Mesh";
import MeshBasicMaterial from "../materials/MeshBasicMaterial";
import Renderer from "../core/Renderer";
import World from "../core/World";

interface MeshPair {
  originMesh: Mesh;
  outlineMesh?: Mesh;
}
class OutlineRenderer {
  meshPaires: MeshPair[] = [];
  renderer: Renderer = new Renderer();
  selectedObjects: string[] = [];

  #createMeshPaires(world: World) {
    const meshPaires: MeshPair[] = [];
    world.meshes.forEach((mesh: Mesh) => {
      const pair: MeshPair = { originMesh: mesh };

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

      meshPaires.push(pair);
    });
    this.meshPaires = meshPaires;
  }
  updateSelectedObjects(selectedObjects: string[]) {
    this.selectedObjects = selectedObjects;
  }

  render(world: World) {
    if (!world) {
      throw new Error("world can not be empty!");
    }
    this.#createMeshPaires(world);
    const { gl, skybox } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    gl.enable(gl.STENCIL_TEST);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clearStencil(0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    this.meshPaires.forEach((pair) => {
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

    if (skybox) {
      skybox.render();
    }
  }
}

export default OutlineRenderer;
