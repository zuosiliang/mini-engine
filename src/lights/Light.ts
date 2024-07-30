import { vec3 } from "gl-matrix";

class Light {
  position: vec3;
  color: [number, number, number];

  constructor(positions: vec3, color: [number, number, number]) {
    this.position = positions;
    this.color = color;
  }
}

export default Light;
