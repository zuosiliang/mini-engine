# mini-engine 
## 个人学习webgl过程中模仿three.js的api语法实现的webgl渲染库

## 已完成
- 变换
- 材质贴图系统
- 相机系统
- 多光源Blinn–Phong 光照模型
- skybox
- 轨道控制器
- 选中物体边缘高亮

## todo
- 半透明
- 阴影
- 实例化
- 延迟光照
- 模型载入

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