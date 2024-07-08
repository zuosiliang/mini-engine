import Renderer from "./Renderer";
import Box from "./Box";

const main = () => {
  const renderer = new Renderer(document.getElementById("glCanvas"));
  const { world } = renderer;
  const box = new Box();
  box.SetPosition(0, 0, -6);
  box.RotateX(-Math.PI * 2);
  box.Scale(1, 1, 1);
  const box2 = new Box();
  box2.SetPosition(4, 3, -8);
  box2.RotateX(-Math.PI * 2);
  box2.Scale(1, 1, 1);
  world.add(box);
  world.add(box2);

  renderer.render();
};

window.onload = main;
