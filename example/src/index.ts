import * as T from "mini-engine";

const main = () => {
  const canvasDom = document.getElementById("glCanvas") as HTMLCanvasElement;
  const renderer = new T.Renderer(canvasDom as HTMLCanvasElement);
  const world = new T.World();
  const box = new T.Box();

  const plane = new T.Plane();

  const light1 = new T.PointLight({
    position: [0, 0, -3],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
  const light2 = new T.PointLight({
    position: [0, 0, 0],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
  const light3 = new T.PointLight({
    position: [-5, -5, -5],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
  const light4 = new T.PointLight({
    position: [0, 0, -2],
    color: [1, 1, 1],
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });

  const textureLoader = new T.TextureLoader();
  const colorMap = textureLoader.load(
    "../TilesCeramicSquareLarge001_COL_1K.jpg",
  );

  const meshPlane = new T.Mesh(
    plane,
    new T.MeshBasicMaterial({ color: [1, 0, 0] }),
  );

  meshPlane.setPosition(0, 0, -2);
  meshPlane.setScale(1, 1, 1);
  meshPlane.rotateX(Math.PI / 2);
  const mesh = new T.Mesh(box, new T.MeshBasicMaterial({ color: [0, 0.4, 1] }));

  const mesh2 = new T.Mesh(
    box,
    new T.MeshPhongMaterial({
      color: [0, 1, 0],
      specular: [1, 1, 1],
      shininess: 300,
      colorMap,
    }),
  );

  const mesh3 = new T.Mesh(
    box,
    new T.MeshPhongMaterial({
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

  const camera = new T.PerspectiveCamera({
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

  const skybox = new T.Skybox([
    "../right.jpg",
    "../left.jpg",
    "../bottom.jpg",
    "../top.jpg",
    "../front.jpg",

    "../back.jpg",
  ]);

  const picker = new T.GPUPicker();
  new T.OrbitControl(camera, canvasDom);
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

  const outlineRenderer = new T.OutlineRenderer();

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

// const test = () => {
//   const canvasDom = document.getElementById("glCanvas");
//   const renderer = new T.Renderer(canvasDom);
//   const world = new T.World();
//   const box = new T.Box();

//   const mesh = new T.Mesh(box, new T.MeshBasicMaterial({ color: [1, 0, 0] }));

//   mesh.setPosition(0, 0, -5);
//   world.add(mesh);

//   const tick = () => {
//     renderer.render(world);
//     requestAnimationFrame(tick);
//   };
//   requestAnimationFrame(tick);
// };
window.onload = main;
