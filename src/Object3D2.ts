import { vec3, quat } from "gl-matrix";
import Vector3 from "./math/Vector3";

class Object3D {
  render() {}
  position: Vector3;
  rotation: quat;
  scale: Vector3;
  constructor(position?: vec3, rotation?: vec3, scale?: quat) {
    this.position = position ?? new Vector3();
    this.scale = scale ?? new Vector3(1, 1, 1);
    this.rotation = rotation ?? quat.create();
  }

  setPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  rotateX(rad: number) {
    quat.rotateX(this.rotation, this.rotation, rad);
  }

  rotateY(rad: number) {
    quat.rotateY(this.rotation, this.rotation, rad);
  }

  rotateZ(rad: number) {
    quat.rotateZ(this.rotation, this.rotation, rad);
  }

  setScale(x: number, y: number, z: number) {
    this.scale.set(x, y, z);
  }
}

export default Object3D;
