import Camera from "./Camera";
import Renderer from "./Renderer";
import Box from "./Box";
import Mesh from "./Mesh";
import MeshPhongMaterial from "./materials/MeshPhongMaterial";
import MeshBasicMaterial from "./materials/MeshBasicMaterial";
import PointLight from "./PointLight";

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
  const box3 = new Box();
  box3.setPosition(-3, 1, -3);
  box3.rotateX(-Math.PI * 2);
  box3.setScale(1, 1, 1);
  const light1 = new PointLight([0, 0, -3], [1, 1, 1], 1.0, 0.09, 0.032);
  const light2 = new PointLight([-3, -3, -8], [1, 1, 1], 1.0, 0.09, 0.032);
  const light3 = new PointLight([-5, -5, -5], [1, 1, 1], 1.0, 0.09, 0.032);
  const light4 = new PointLight([0, 0, -2], [1, 1, 1], 1.0, 0.09, 0.032);

  const mesh = new Mesh(box, new MeshPhongMaterial([1, 0, 0], [1, 1, 1], 400));
  const mesh2 = new Mesh(
    box2,
    new MeshPhongMaterial([0, 1, 0], [1, 1, 1], 300),
  );
  const mesh3 = new Mesh(box3, new MeshBasicMaterial([0, 0.4, 1]));

  const camera = new Camera(
    (45 * Math.PI) / 180,
    window.innerWidth / window.innerHeight,
    0.1,
    100.0,
  );

  camera.setPosition(0, 0, 6);
  camera.updateMatrix();

  world.add(mesh);
  world.add(mesh2);
  world.add(mesh3);
  world.add(camera);
  world.add(light1);
  world.add(light2);
  world.add(light3);
  world.add(light4);
  renderer.render();
};

window.onload = main;
