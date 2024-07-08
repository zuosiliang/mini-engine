import { mat4, vec3 } from "gl-matrix";

class Renderer {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  buffers:
    | { position: WebGLBuffer | null; indices: WebGLBuffer | null }
    | undefined;

  constructor(canvas: HTMLCanvasElement) {
    if (canvas) {
      this.canvas = canvas;
    } else {
      throw new Error("The provided canvas is not or undefined");
    }

    const gl = this.canvas.getContext("webgl2");
    if (gl) {
      this.gl = gl;
    } else {
      throw new Error("No WebGL2 support");
    }

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    });

    this.initBuffers();
  }

  private loadShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);

    if (!shader) {
      throw new Error("Something went wrong while creating the shader");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          this.gl.getShaderInfoLog(shader),
      );
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private initShaderProgram(
    vsSource: string,
    fsSource: string,
  ): WebGLProgram | null {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const shaderProgram = this.gl.createProgram();

    if (!shaderProgram) {
      throw new Error("Unable to create program");
    }

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          this.gl.getProgramInfoLog(shaderProgram),
      );
      return null;
    }

    return shaderProgram;
  }

  private initBuffers() {
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

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW,
    );

    this.buffers = {
      position: positionBuffer,
      indices: indexBuffer,
    };
  }

  render() {
    // Vertex shader program
    const vsSource = `
            attribute vec4 aVertexPosition;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            void main(void) {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
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
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram,
          "aVertexPosition",
        ),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix",
        ),
        modelViewMatrix: this.gl.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix",
        ),
      },
    };

    // Camera position and orientation
    const cameraPosition = vec3.fromValues(0, 0, 6);
    const cameraTarget = vec3.fromValues(0, 0, 0);
    const upVector = vec3.fromValues(0, 1, 0);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.lookAt(modelViewMatrix, cameraPosition, cameraTarget, upVector);

    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

    if (!this.buffers) {
      throw new Error("buffers went wrong");
    }
    {
      const numComponents = 3;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
      this.gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      this.gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition,
      );
    }

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    this.gl.useProgram(programInfo.program);

    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );
    this.gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );

    {
      const vertexCount = 36;
      const type = this.gl.UNSIGNED_SHORT;
      const offset = 0;
      this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    }
  }
}

export default Renderer;
