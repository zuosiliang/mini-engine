import Geometry from "./Geometry";
import Shader from "../core/Shader";

class Plane extends Geometry {
  clone() {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.initBuffers();
  }

  private initBuffers() {
    const { gl } = this.renderer;

    const positions = [
      -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
    ];

    const normals = [
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    ];

    const indices = [0, 1, 2, 2, 1, 3];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

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
}

export default Plane;
