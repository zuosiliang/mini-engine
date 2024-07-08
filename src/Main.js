import Renderer from "./Renderer";
import Box from "./Box";

const main = () => {
  const renderer = new Renderer(document.getElementById("glCanvas"));
  const { world } = renderer;
  world.add(new Box());
  renderer.render();
};

window.onload = main;
