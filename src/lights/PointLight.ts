import { vec3 } from "gl-matrix";
import Light from "./Light";

class PointLight extends Light {
  constant: number;
  linear: number;
  quadratic: number;

  constructor(
    position: vec3,
    color: [number, number, number],
    constant: number,
    linear: number,
    quadratic: number,
  ) {
    super(position, color);

    this.constant = constant;
    this.linear = linear;
    this.quadratic = quadratic;
  }
  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
  }
}

export default PointLight;
