import Object3D from "./Object3D";
import Renderer from "./Renderer";
import { vec3, quat } from "gl-matrix";
import Shader from "./Shader";
type AttributeType = "positions" | "normals" | "indices";

type AttributeBuffer = Partial<
  Record<
    AttributeType,
    {
      data: number[];
      buffer: WebGLBuffer | null;
    }
  >
>;

abstract class Geometry extends Object3D {
  buffers: AttributeBuffer | undefined;
  renderer: Renderer;
  shader: Shader | undefined;
  constructor(position?: vec3, rotation?: vec3, scale?: quat) {
    super(position, rotation, scale);
    this.renderer = window.renderer;
  }

  abstract bind(): void;

  abstract updateShader(shader: Shader): void;

  abstract clone(): any;
}

export default Geometry;
