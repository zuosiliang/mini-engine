import { vec3, quat } from "gl-matrix";

class Object3D {
  position: ThreeNumbers = [0, 0, 0];
  rotation: quat = quat.create();
  scale: ThreeNumbers = [1, 1, 1];
  constructor(position?: ThreeNumbers, rotation?: quat, scale?: ThreeNumbers) {
    this.position = position ?? this.position;
    this.scale = scale ?? this.scale;
    this.rotation = rotation ?? this.rotation;
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

  setRotation(rotation: quat) {
    this.rotation = rotation;
  }
}

export default Object3D;
