import { vec3 } from "gl-matrix";
import Light from "./Light";

class PointLight extends Light {
  position: vec3;
  ambient: vec3;
  diffuse: vec3;
  specular: vec3;

  constructor(position: vec3, ambient: vec3, diffuse: vec3, specular: vec3) {
    super();
    this.position = position;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
  }
  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
  }
}

export default PointLight;
