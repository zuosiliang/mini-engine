import Geometry from "./Geometry";
import Shader from "../core/Shader";

class Box extends Geometry {
  constructor() {
    super();
    this.initBuffers();
  }

  private initBuffers() {
    const { gl } = this.renderer;

    const positions = [
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0, // Front face
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0, // Back face
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0, // Top face
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0, // Bottom face
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0, // Right face
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0, // Left face
    ];

    const normals = [
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0, // Front face
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0, // Back face
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // Top face
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0, // Bottom face
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0, // Right face
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0, // Left face
    ];

    const uvs = [
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // Front face
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // Back face
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // Top face
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // Bottom face
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // Right face
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // Left face
    ];

    const indices = [
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );

    this.vao = {};
    this.buffers = {
      positions: { buffer: positionBuffer, data: positions },
      normals: { buffer: normalBuffer, data: normals },
      uvs: { buffer: uvBuffer, data: uvs },
      indices: { buffer: indexBuffer, data: indices },
    };
  }

  updateShader(shader: Shader) {
    this.shader = shader;
  }

  bindVao(materialType) {
    const { gl } = this.renderer;
    gl.bindVertexArray(this.vao[materialType]);
  }

  createVao(materialType) {
    const { gl } = this.renderer;
    const { buffers, shader } = this;

    if (!buffers) {
      throw new Error("buffers went wrong");
    }
    const { shaderProgram } = shader;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.vao[materialType] = vao;

    this.shader.attributeTypes.forEach((attributeType) => {
      const attributeTypeVariableMap = {
        positions: "aVertexPosition",
        uvs: "aTextureCoord",
        normals: "aVertexNormal",
      };
      const attribute = attributeTypeVariableMap[attributeType];
      const attributeLocation = gl.getAttribLocation(shaderProgram, attribute);

      if (attributeLocation !== -1) {
        let numComponents;
        if (attributeType === "positions") numComponents = 3;
        else if (attributeType === "normals") numComponents = 3;
        else if (attributeType === "uvs") numComponents = 2;

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
      }
    });

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices.buffer);
    gl.bindVertexArray(null);
  }

  clone() {
    return new Box();
  }
}

export default Box;