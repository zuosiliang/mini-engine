import { mat4, vec3 } from "gl-matrix";
import Object3D from "../core/Object3D";

interface PerspectiveCameraProps {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position?: ThreeNumbers;
  target?: ThreeNumbers;
  up?: ThreeNumbers;
}

class PerspectiveCamera extends Object3D {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: ThreeNumbers = [0, 0, 0];
  target: ThreeNumbers = [0, 0, 0];
  up: ThreeNumbers = [0, 1, 0];
  projectionMatrix: mat4 = mat4.create();
  viewMatrix: mat4 = mat4.create();

  constructor(props: PerspectiveCameraProps) {
    const { fov, aspect, near, far, position, target, up } = props;
    super(position);
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.position = position ?? this.position;
    this.target = target ?? this.target;
    this.up = up ?? this.up;
    this.updateMatrix();
  }
  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
  }

  setAspect(aspect: number) {
    this.aspect = aspect;
  }

  updateMatrix() {
    // Initialize the projection matrix
    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      this.fov,
      this.aspect,
      this.near,
      this.far,
    );
    this.projectionMatrix = projectionMatrix;

    // Create the view matrix using lookAt
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, this.position, this.target, this.up);
    this.viewMatrix = viewMatrix;
  }

  setViewMatrix(viewMatrix: mat4) {
    this.viewMatrix = viewMatrix;
  }
}

export default PerspectiveCamera;
