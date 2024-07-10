import { mat4, vec3, quat } from "gl-matrix";
import Renderer from "./Renderer";
import Object3D from "./Object3D";

class Box extends Object3D {
  buffers:
    | { position: WebGLBuffer | null; indices: WebGLBuffer | null }
    | undefined;
  renderer: Renderer;
  constructor(position: vec3, rotation: vec3, scale: quat) {
    super(position, rotation, scale);
    this.renderer = window.renderer;
    this.initBuffers();
  }

  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
  }

  rotateX(rad: number) {
    quat.rotateX(this.rotation, this.rotation, rad);
  }

  rotateY(rad: number) {
    quat.rotateY(this.rotation, this.rotation, rad);
  }

  setScale(x: number, y: number, z: number) {
    vec3.set(this.scale, x, y, z);
  }

  private loadShader(type: number, source: string): WebGLShader | null {
    const { gl } = this.renderer;

    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error("Something went wrong while creating the shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader),
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private initShaderProgram(
    vsSource: string,
    fsSource: string,
  ): WebGLProgram | null {
    const { gl } = this.renderer;

    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
      throw new Error("Unable to create program");
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram),
      );
      return null;
    }

    return shaderProgram;
  }

  private initBuffers() {
    const { gl } = this.renderer;

    const positions = [
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0,
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
      3,
      2,
      6,
      3,
      6,
      7, // top
      4,
      5,
      1,
      4,
      1,
      0, // bottom
      1,
      5,
      6,
      1,
      6,
      2, // right
      4,
      0,
      3,
      4,
      3,
      7, // left
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
      position: positionBuffer,
      indices: indexBuffer,
    };
  }

  render() {
    const { gl, camera } = this.renderer;

    // Vertex shader program
    const vsSource = `
            attribute vec4 aVertexPosition;
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            void main(void) {
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
            }
        `;

    // Fragment shader program
    const fsSource = `
            void main(void) {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;

    const shaderProgram = this.initShaderProgram(vsSource, fsSource);
    if (!shaderProgram) {
      return;
    }

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix",
        ),
        viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
        modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
      },
    };

    // Initialize the model matrix and apply transformations
    const modelMatrix = mat4.create();
    mat4.fromRotationTranslationScale(
      modelMatrix,
      this.rotation,
      this.position,
      this.scale,
    );

    if (!this.buffers) {
      throw new Error("buffers went wrong");
    }
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      camera.projectionMatrix,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.viewMatrix,
      false,
      camera.viewMatrix,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelMatrix,
      false,
      modelMatrix,
    );

    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }
}

export default Box;
