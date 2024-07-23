import { mat4, vec3 } from "gl-matrix";

class Camera {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: vec3;
  target: vec3;
  up: vec3;
  projectionMatrix!: mat4;
  viewMatrix!: mat4;

  constructor(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    position?: vec3,
    target?: vec3,
    up?: vec3,
  ) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.position = position ?? vec3.fromValues(0, 0, 0);
    this.target = target ?? vec3.fromValues(0, 0, 0);
    this.up = up ?? vec3.fromValues(0, 1, 0);
    this.updateMatrix();
  }
  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
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

export default Camera;
