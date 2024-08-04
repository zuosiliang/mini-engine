# mini-engine 
## 个人学习webgl过程中模仿three.js的api语法实现的webgl渲染库

## 使用方法

```
import * as T from "mini-engine";

const test = () => {
  const canvasDom = document.getElementById("glCanvas")
  const renderer = new T.Renderer(canvasDom);
  const world = new T.World();
  const box = new T.Box();

  const mesh = new T.Mesh(box, new T.MeshBasicMaterial({ color: [1, 0, 0] }));

  mesh.setPosition(0, 0, -5);
  world.add(mesh);

  const tick = () => {
    renderer.render(world);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
window.onload = test;


```