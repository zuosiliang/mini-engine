import { vec3, quat } from "gl-matrix";

class Object3D {
  render() {}
  position: vec3;
  rotation: quat;
  scale: vec3;
  constructor(position?: vec3, rotation?: vec3, scale?: quat) {
    this.position = position ?? vec3.create();
    this.scale = rotation ?? vec3.fromValues(1, 1, 1);
    this.rotation = scale ?? quat.create();
  }
}

export default Object3D;
