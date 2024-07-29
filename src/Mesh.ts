import Material from "./Material";
import Renderer from "./Renderer";
import Geometry from "./Geometry";
import Shader from "./Shader";
import MeshPhongMaterial from "./materials/MeshPhongMaterial";
import MeshBasicMaterial from "./materials/MeshBasicMaterial";
import PhongShader from "./shaders/PhongShader";
import BasicShader from "./shaders/BasicShader";
import { vec3, mat4 } from "gl-matrix";
import { v4 } from "uuid";
import Object3D from "./Object3D";

class Mesh extends Object3D {
  geometry: Geometry;
  material: Material;
  renderer: Renderer;
  shaderProgram: WebGLProgram | null | undefined;
  shader: Shader | undefined;
  id: string;
  constructor(geometry: Geometry, material: Material) {
    super();
    this.geometry = geometry;
    this.material = material;
    this.renderer = window.renderer;
    this.id = v4();
  }

  private createShaderProgram() {
    const { lights } = this.renderer;

    if (this.material instanceof MeshPhongMaterial) {
      const shader = new Shader(PhongShader.vsSource, PhongShader.fsSource, {
        pointLight: lights.length,
      });
      this.shader = shader;
    }
    if (this.material instanceof MeshBasicMaterial) {
      const shader = new Shader(BasicShader.vsSource, BasicShader.fsSource);
      this.shader = shader;
    }
    this.geometry.updateShader(this.shader);
    this.material.updateShader(this.shader);
  }

  render() {
    const { geometry, material } = this;
    const { camera } = this.renderer;

    const modelMatrix = mat4.create();
    mat4.fromRotationTranslationScale(
      modelMatrix,
      this.rotation,
      this.position,
      this.scale,
    );

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    this.createShaderProgram();
    this.shader.use();
    this.shader.setMat4("uViewMatrix", camera.viewMatrix);
    this.shader.setMat4("uProjectionMatrix", camera.projectionMatrix);
    this.shader.setMat4("uModelMatrix", modelMatrix);
    this.shader.setMat4("uNormalMatrix", normalMatrix);
    this.shader.setVec3("uViewWorldPosition", camera.position);

    geometry.bind();
    material.bind();

    this.draw();
  }

  private draw() {
    const { gl } = this.renderer;
    const { geometry } = this;

    const vertexCount = geometry.buffers.indices.data.length;

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
  }
}

export default Mesh;
