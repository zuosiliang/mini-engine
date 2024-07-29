import Geometry from "./Geometry";
import Shader from "./Shader";

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

    this.buffers = {
      positions: { buffer: positionBuffer, data: positions },
      normals: { buffer: normalBuffer, data: normals },
      indices: { buffer: indexBuffer, data: indices },
    };
  }

  updateShader(shader: Shader) {
    this.shader = shader;
    this.bindVao();
  }

  bind() {
    const { gl } = this.renderer;

    gl.bindVertexArray(this.vao);
  }

  private bindVao() {
    const { gl } = this.renderer;
    const { buffers, shader } = this;
    const { shaderProgram } = shader;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.vao = vao;
    const vertexPosition = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition",
    );

    const vertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");

    if (!buffers) {
      throw new Error("buffers went wrong");
    }
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions.buffer);
      gl.vertexAttribPointer(
        vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      gl.enableVertexAttribArray(vertexPosition);
    }

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals.buffer);
      gl.vertexAttribPointer(
        vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      gl.enableVertexAttribArray(vertexNormal);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices.buffer);

    gl.bindVertexArray(null);
  }
}

export default Plane;
