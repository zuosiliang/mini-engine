import { Geometry } from "./Geometry";

class Plane extends Geometry {
  constructor() {
    super();
    this.#initBuffers();
  }

  #initBuffers() {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    const positions = [
      -1.0,
      1.0,
      0.0, // top left
      1.0,
      1.0,
      0.0, // top right
      -1.0,
      -1.0,
      0.0, // bottom left
      1.0,
      -1.0,
      0.0, // bottom right
    ];

    const normals = [
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    ];

    const uvs = [
      0.0,
      1.0, // top left
      1.0,
      1.0, // top right
      0.0,
      0.0, // bottom left
      1.0,
      0.0, // bottom right
    ];

    const indices = [0, 1, 2, 2, 1, 3];

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

    this.buffers = {
      positions: { buffer: positionBuffer, data: positions },
      normals: { buffer: normalBuffer, data: normals },
      uvs: { buffer: uvBuffer, data: uvs },
      indices: { buffer: indexBuffer, data: indices },
    };
  }
}

export default Plane;
