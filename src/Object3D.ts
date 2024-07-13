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

  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
  }

  rotateX(rad: number) {
    quat.rotateX(this.rotation, this.rotation, rad);
  }

  rotateY(rad: number) {
    quat.rotateY(this.rotation, this.rotation, rad);
  }

  setScale(x: number, y: number, z: number) {
    vec3.set(this.scale, x, y, z);
  }
}

export default Object3D;
