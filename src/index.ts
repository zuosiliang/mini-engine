import Camera from "./cameras/PerspectiveCamera";
import Renderer from "./core/Renderer";
import Box from "./geometries/Box";
import Mesh from "./core/Mesh";
import MeshPhongMaterial from "./materials/MeshPhongMaterial";
import MeshBasicMaterial from "./materials/MeshBasicMaterial";
import PointLight from "./lights/PointLight";
import Skybox from "./extras/Skybox";
import Plane from "./geometries/Plane";
import OrbitControl from "./controls/OrbitControl";
import TextureLoader from "./loaders/TextureLoader";
import OutlineRenderer from "./effectRenderers/OutlineRenderer";
import GPUPicker from "./extras/GPUPicker";
import World from "./core/World";

const main = () => {
  const canvasDom = document.getElementById("glCanvas") as HTMLCanvasElement;
  const renderer = new Renderer(canvasDom as HTMLCanvasElement);
  const world = new World();
  const box = new Box();

  const plane = new Plane();

  const light1 = new PointLight({
    position: [0, 0, -3],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
  const light2 = new PointLight({
    position: [0, 0, 0],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
  const light3 = new PointLight({
    position: [-5, -5, -5],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
  const light4 = new PointLight({
    position: [0, 0, -2],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });

  const textureLoader = new TextureLoader();
  const colorMap = textureLoader.load(
    "../TilesCeramicSquareLarge001_COL_1K.jpg",
  );

  const meshPlane = new Mesh(
    plane,
    new MeshBasicMaterial({ color: [1, 0, 0] }),
  );

  meshPlane.setPosition(0, 0, -2);
  meshPlane.setScale(1, 1, 1);
  meshPlane.rotateX(Math.PI / 2);
  const mesh = new Mesh(box, new MeshBasicMaterial({ color: [0, 0.4, 1] }));

  const mesh2 = new Mesh(
    box,
    new MeshPhongMaterial({
      color: [0, 1, 0],
      specular: [1, 1, 1],
      shininess: 300,
      colorMap,
    }),
  );

  const mesh3 = new Mesh(
    box,
    new MeshPhongMaterial({
      color: [0, 1, 0],
      specular: [1, 1, 1],
      shininess: 300,
    }),
  );

  mesh.setPosition(0, 0, 0);
  mesh.rotateX(-Math.PI * 2);
  mesh.setScale(1, 1, 1);
  mesh2.setPosition(8, 3, -8);
  mesh2.rotateX(-Math.PI * 2);
  mesh2.setScale(1, 1, 1);
  mesh3.setPosition(5, 5, -5);
  mesh3.rotateX(-Math.PI * 2);
  mesh3.setScale(1, 1, 1);

  const camera = new Camera({
    fov: (45 * Math.PI) / 180,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 100.0,
  });

  window.addEventListener("resize", () => {
    camera.setAspect(window.innerWidth / window.innerHeight);
    camera.updateMatrix();
    renderer.resize(window.innerWidth, window.innerHeight);
  });

  camera.setPosition(0, 0, 10);
  // camera.updateMatrix();

  const skybox = new Skybox([
    "../right.jpg",
    "../left.jpg",
    "../bottom.jpg",
    "../top.jpg",
    "../front.jpg",

    "../back.jpg",
  ]);

  const picker = new GPUPicker();
  new OrbitControl(camera, canvasDom);
  world.add(mesh);
  world.add(mesh2);
  world.add(mesh3);
  world.add(meshPlane);
  world.add(camera);
  world.add(light1);
  world.add(light2);
  world.add(light3);
  world.add(light4);
  world.add(skybox);

  // const controls = new BrowseControl(canvasDom, camera);

  const outlineRenderer = new OutlineRenderer();

  const pointer: {
    x: number;
    y: number;
  } = { x: 0, y: 0 };

  const onPointerMove = (e: MouseEvent) => {
    pointer.x = e.clientX;
    pointer.y = canvasDom.height - e.clientY;
  };

  canvasDom.addEventListener("pointermove", onPointerMove);
  // canvasDom.addEventListener("click", onPointerMove);

  const r = () => {
    // time *= 0.001;

    // const cameraPosition = [Math.cos(time * 0.1), 0, Math.sin(time * 0.1)];
    // camera.setPosition(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

    const selected = picker.pick(pointer, world) ?? [];
    mesh3.rotateX(Math.PI / 100);
    camera.updateMatrix();
    outlineRenderer.updateSelectedObjects(selected);
    outlineRenderer.render(world);

    // renderer.render(world);
    requestAnimationFrame(r);
  };
  requestAnimationFrame(r);
};

window.onload = main;
