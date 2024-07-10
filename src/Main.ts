import Camera from "/src/Camera.ts";
import Renderer from "/src/Renderer.ts";
import Box from "/src/Box.ts";

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

  const camera = new Camera(
    (45 * Math.PI) / 180,
    window.innerWidth / window.innerHeight,
    0.1,
    100.0,
  );

  camera.setPosition(0, 0, 20);
  camera.updateMatrix();
  world.add(box);
  world.add(box2);
  world.add(camera);
  renderer.render();
};

window.onload = main;
