import Shader from "../core/Shader";
import CubemapShader from "../shaders/CubemapShader";
import { mat4, mat3 } from "gl-matrix";
import LoadingManager from "../loaders/LoadingManager";
import { BufferObject } from "../geometries/Geometry";

type SkyboxSrcs = [
  right: string,
  left: string,
  top: string,
  bottom: string,
  back: string,
  front: string,
];

class Skybox extends BufferObject<"positions" | "indices"> {
  texture: WebGLTexture | null = null;
  loadingManager: LoadingManager = new LoadingManager();
  srcs: SkyboxSrcs | [] = [];
  shader: Shader = new Shader(CubemapShader.vsSource, CubemapShader.fsSource);
  constructor(files: SkyboxSrcs) {
    super();
    this.srcs = files ?? this.srcs;
    this.#initBuffers();
    this.#initTexture();
  }

  #initTexture() {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    const { srcs } = this;

    const skyboxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);

    const faceInfos = [
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: srcs[0] },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: srcs[1] },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: srcs[2] },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: srcs[3] },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: srcs[4] },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: srcs[5] },
    ];

    faceInfos.forEach((faceInfo) => {
      const { target, url } = faceInfo;
      if (!url) {
        throw new Error("provided pictures are not complete");
      }
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 512;
      const height = 512;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;

      gl.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        0,
        format,
        type,
        null,
      );

      const image = new Image();
      this.loadingManager.itemStart(); // Start loading item

      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        this.loadingManager.itemEnd();
      };
      image.onerror = () => {
        console.error("Failed to load texture image:", url);
        this.loadingManager.itemError(url); // Handle error
      };

      image.src = url;
    });

    gl.texParameteri(
      gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    this.texture = skyboxTexture;
  }

  #initBuffers() {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    const positions = [
      // Positions
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v0-v3-v4-v5 right
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0, // v0-v5-v6-v1 up
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0, // v1-v6-v7-v2 left
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
      1.0, // v7-v4-v3-v2 down
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v4-v7-v6-v5 back
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

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );

    this.buffers = {
      positions: { buffer: positionBuffer, data: positions },
      indices: { buffer: indexBuffer, data: indices },
    };
  }

  #draw() {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (this.buffers?.indices) {
      const vertexCount = this.buffers.indices.data.length;
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
  }

  render() {
    const {
      buffers,
      shader,
      shader: { shaderProgram } = {},
      renderer: { gl, camera },
    } = this;

    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    if (!buffers) {
      throw new Error("the buffers can not be empty");
    }
    if (!camera) {
      throw new Error("the camera can not be empty");
    }
    shader.use();
    const vertexPosition = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition",
    );
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;

      if (!buffers.positions) {
        throw new Error("the positions buffer is empty");
      }
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
    if (!buffers.indices) {
      throw new Error("the indices buffer is empty");
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices.buffer);

    // Extract the rotation part of the view matrix
    const viewMatrix3x3 = mat3.create();
    mat3.fromMat4(viewMatrix3x3, camera.viewMatrix);

    // Manually create a 4x4 matrix from the 3x3 matrix
    const viewMatrix4x4 = mat4.create();
    mat4.identity(viewMatrix4x4);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        viewMatrix4x4[i * 4 + j] = viewMatrix3x3[i * 3 + j];
      }
    }

    shader.setMat4("uViewMatrix", viewMatrix4x4);
    shader.setMat4("uProjectionMatrix", camera.projectionMatrix);

    shader.setInt("uSkybox", 0);

    // Bind the cubemap texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

    this.#draw();
  }
}

export default Skybox;
