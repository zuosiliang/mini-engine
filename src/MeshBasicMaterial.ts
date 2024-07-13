import Material from "./Material";
import { vec3 } from "gl-matrix";

class MeshBasicMaterial extends Material {
  color: vec3;
  constructor(color: vec3) {
    super();
    this.color = color;
  }
}

export default MeshBasicMaterial;
