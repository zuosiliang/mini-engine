import Renderer, { MaterialType } from "../core/Renderer";
import Shader from "../core/Shader";

export type AttributeType = "positions" | "normals" | "uvs" | "indices";

type AttributeBuffers = Partial<
  Record<
    AttributeType,
    {
      data: number[];
      buffer: WebGLBuffer | null;
    }
  >
>;

type Vao = Partial<Record<MaterialType, WebGLVertexArrayObject | null>>;

abstract class BufferObject<K extends AttributeType> {
  buffers: { [key in K]: AttributeBuffers[key] } | null = null;
  vao: Vao = {};
  renderer: Renderer = new Renderer();
  shader: Shader | null = null;
}

abstract class Geometry extends BufferObject<
  "positions" | "normals" | "uvs" | "indices"
> {
  updateShader(shader: Shader): void {
    this.shader = shader;
  }

  bindVao(materialType: MaterialType) {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (this.vao[materialType]) {
      gl.bindVertexArray(this.vao[materialType]);
    }
  }

  createVao(materialType: MaterialType) {
    const {
      buffers,
      shader,
      renderer: { gl },
    } = this;

    if (!buffers) {
      throw new Error("the buffers can not be empty");
    }
    if (!shader) {
      throw new Error("the shader can not be empty");
    }
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.vao[materialType] = vao;

    const attributeTypeVariableMap: Omit<
      Record<AttributeType, string>,
      "indices"
    > = {
      positions: "aVertexPosition",
      uvs: "aTextureCoord",
      normals: "aVertexNormal",
    };
    const { shaderProgram } = shader;

    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    shader.attributeTypes.forEach((attributeType: AttributeType) => {
      if (attributeType === "indices") {
        return;
      }
      const attribute = attributeTypeVariableMap[attributeType];
      const attributeLocation = gl.getAttribLocation(shaderProgram, attribute);
      if (attributeLocation === -1 || !buffers[attributeType]) {
        throw new Error(
          `the ${attributeType} buffer is empty, or it is not used in the shader`,
        );
      }

      const numComponents = (function () {
        const attributeTypeNum = {
          positions: 3,
          normals: 3,
          uvs: 2,
        };
        return attributeTypeNum[attributeType];
      })();

      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[attributeType].buffer);
      gl.vertexAttribPointer(
        attributeLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      gl.enableVertexAttribArray(attributeLocation);
    });
    if (!buffers.indices) {
      throw new Error("the indices buffer is empty");
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices.buffer);
    gl.bindVertexArray(null);
  }
}

export { BufferObject, Geometry };
