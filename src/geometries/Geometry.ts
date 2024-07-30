import Renderer from "../core/Renderer";
import { vec3, quat } from "gl-matrix";
import Shader from "../core/Shader";
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

abstract class Geometry {
  buffers: AttributeBuffer | undefined;
  renderer: Renderer;
  shader: Shader | undefined;
  constructor() {
    this.renderer = window.renderer;
  }

  abstract bind(): void;

  abstract updateShader(shader: Shader): void;

  abstract clone(): any;
}

export default Geometry;
