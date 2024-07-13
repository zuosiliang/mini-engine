import Renderer from "./Renderer";
import { vec3, mat4, mat3, vec4 } from "gl-matrix";

type DefineConfig = {
  pointLight?: number;
};

class Shader {
  uniforms: Record<string, mat4 | mat3 | vec3 | vec4 | number>;

  vsSource: string;
  fsSource: string;
  renderer: Renderer;
  shaderProgram: WebGLProgram | undefined;
  constructor(vsSource: string, fsSource: string, defineConfig?: DefineConfig) {
    this.renderer = window.renderer;
    this.vsSource = defineConfig
      ? this.customShader(vsSource, defineConfig)
      : vsSource;
    this.fsSource = defineConfig
      ? this.customShader(fsSource, defineConfig)
      : fsSource;
    this.initShaderProgram(this.vsSource, this.fsSource);
    this.uniforms = {};
  }

  setMat4(name: string, value: mat4) {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      this.uniforms[name] = value;
      gl.uniformMatrix4fv(
        gl.getUniformLocation(this.shaderProgram, name),
        false,
        value,
      );
    }
  }

  setMat3(name: string, value: mat3) {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      this.uniforms[name] = value;
      gl.uniformMatrix3fv(
        gl.getUniformLocation(this.shaderProgram, name),
        false,
        value,
      );
    }
  }

  setVec4(name: string, value: vec4) {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      this.uniforms[name] = value;
      gl.uniform4fv(gl.getUniformLocation(this.shaderProgram, name), value);
    }
  }

  setVec3(name: string, value: vec3) {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      this.uniforms[name] = value;
      gl.uniform3fv(gl.getUniformLocation(this.shaderProgram, name), value);
    }
  }

  setInt(name: string, value: number) {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      this.uniforms[name] = value;
      gl.uniform1i(gl.getUniformLocation(this.shaderProgram, name), value);
    }
  }

  setFloat(name: string, value: number) {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      this.uniforms[name] = value;
      gl.uniform1f(gl.getUniformLocation(this.shaderProgram, name), value);
    }
  }

  private customShader(src, defines) {
    return src;
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

  private initShaderProgram(vsSource: string, fsSource: string): void {
    const { gl } = this.renderer;

    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      throw new Error("shader cannot be empty!");
    }

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
      throw new Error("Unable to create program");
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram),
      );
    }

    this.shaderProgram = shaderProgram;
  }

  use() {
    const { gl } = this.renderer;
    if (this.shaderProgram) {
      gl.useProgram(this.shaderProgram);
    }
  }
}

export default Shader;
