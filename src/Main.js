import Renderer from "./Renderer";

const main = () => {
  const renderer = new Renderer(document.getElementById("glCanvas"));
  renderer.render();
};

window.onload = main;
