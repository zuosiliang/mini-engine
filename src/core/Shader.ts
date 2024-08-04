import Renderer from "./Renderer";
import { vec3, mat4, mat3, vec4 } from "gl-matrix";
import { AttributeType } from "../geometries/Geometry";

interface DefineConfig {
  pointLight?: number;
}

class Shader {
  attributeTypes: AttributeType[] = [];
  vsSource: string = "";
  fsSource: string = "";
  renderer: Renderer;
  shaderProgram: WebGLProgram | null = null;
  constructor(vsSource: string, fsSource: string, defineConfig?: DefineConfig) {
    this.renderer = new Renderer();
    this.vsSource = defineConfig
      ? this.#modifyDefines(vsSource, defineConfig)
      : vsSource;

    this.fsSource = defineConfig
      ? this.#modifyDefines(fsSource, defineConfig)
      : fsSource;

    this.#initShaderProgram(this.vsSource, this.fsSource);
  }

  updateAttributes(attributeTypes: AttributeType[]) {
    this.attributeTypes = attributeTypes;
  }

  setMat4(name: string, value: mat4) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniformMatrix4fv(
      gl.getUniformLocation(shaderProgram, name),
      false,
      value,
    );
  }

  setMat3(name: string, value: mat3) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniformMatrix3fv(
      gl.getUniformLocation(shaderProgram, name),
      false,
      value,
    );
  }

  setVec4(name: string, value: vec4) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniform4fv(gl.getUniformLocation(shaderProgram, name), value);
  }

  setVec3(name: string, value: vec3) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, name), value);
  }

  setInt(name: string, value: number) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniform1i(gl.getUniformLocation(shaderProgram, name), value);
  }

  setFloat(name: string, value: number) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniform1f(gl.getUniformLocation(shaderProgram, name), value);
  }

  setFloatArr(name: string, value: Float32Array) {
    const {
      renderer: { gl },
      shaderProgram,
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }
    if (!shaderProgram) {
      throw new Error("the shader can not be empty");
    }
    gl.uniform1fv(gl.getUniformLocation(shaderProgram, name), value);
  }

  #modifyDefines(src: string, defineConfig: DefineConfig) {
    const lines = src.split("\n");

    if (defineConfig.pointLight !== undefined) {
      const definePointLight = `#define NR_POINT_LIGHTS ${defineConfig.pointLight}`;
      lines.splice(3, 0, definePointLight);
    }
    return lines.join("\n");
  }

  #loadShader(type: number, source: string): WebGLShader | null {
    const {
      renderer: { gl },
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }

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

  #initShaderProgram(vsSource: string, fsSource: string): void {
    const {
      renderer: { gl },
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }

    const vertexShader = this.#loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.#loadShader(gl.FRAGMENT_SHADER, fsSource);

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
    const {
      renderer: { gl },
    } = this;
    if (!gl) {
      throw new Error("the gl context can not be empty");
    }

    if (this.shaderProgram) {
      gl.useProgram(this.shaderProgram);
    }
  }
}

export default Shader;
