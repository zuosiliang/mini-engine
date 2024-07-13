import Camera from "./Camera";
import Renderer from "./Renderer";
import Box from "./Box";
import Mesh from "./Mesh";
import MeshPhongMaterial from "./MeshPhongMaterial";

const main = () => {
  const canvasDom = document.getElementById("glCanvas");
  const renderer = new Renderer(canvasDom);
  const { world } = renderer;
  const box = new Box();
  box.setPosition(0, 0, -6);
  box.rotateX(-Math.PI * 2);
  box.setScale(1, 1, 1);
  const box2 = new Box();
  box2.setPosition(4, 3, -8);
  box2.rotateX(-Math.PI * 2);
  box2.setScale(1, 1, 1);
  const mesh = new Mesh(box, new MeshPhongMaterial([1, 0, 0], [1, 1, 1], 128));
  const mesh2 = new Mesh(box2, new MeshPhongMaterial([0, 1, 0], [1, 1, 1], 6));

  const camera = new Camera(
    (45 * Math.PI) / 180,
    window.innerWidth / window.innerHeight,
    0.1,
    100.0,
  );

  camera.setPosition(3, 0, 10);
  camera.updateMatrix();
  world.add(mesh);
  world.add(mesh2);
  world.add(camera);
  renderer.render();
};

window.onload = main;
