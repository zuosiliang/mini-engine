import Material from "../materials/Material";
import Renderer from "./Renderer";
import Geometry from "../geometries/Geometry";
import Shader from "./Shader";
import PhongShader from "../shaders/PhongShader";
import BasicShader from "../shaders/BasicShader";
import { vec3, mat4 } from "gl-matrix";
import { v4 } from "uuid";
import Object3D from "./Object3D";
import { MaterialType } from "./Renderer";

class Mesh extends Object3D {
  geometry: Geometry;
  material: Material;
  renderer: Renderer;
  shaderProgram: WebGLProgram | null | undefined;
  shader: Shader | undefined;
  id: string;
  materialType: MaterialType;
  constructor(geometry: Geometry, material: Material) {
    super();
    this.geometry = geometry;
    this.material = material;
    this.renderer = window.renderer;
    this.id = v4();
    this.materialType = material.constructor.name;
  }

  private createShaderProgram() {
    const { lights, shaders } = this.renderer;

    if (this.materialType === MaterialType.MeshPhongMaterial) {
      const existingShader = shaders[MaterialType.MeshPhongMaterial];

      if (!existingShader) {
        const shader = new Shader(PhongShader.vsSource, PhongShader.fsSource, {
          pointLight: lights.length,
        });
        shaders[MaterialType.MeshPhongMaterial] = shader;
        this.shader = shader;
        this.shader.updateAttributes(["positions", "normals", "uvs"]);
      } else {
        this.shader = existingShader;
      }
    }
    if (this.materialType === MaterialType.MeshBasicMaterial) {
      const existingShader = shaders[MaterialType.MeshBasicMaterial];

      if (!existingShader) {
        const shader = new Shader(BasicShader.vsSource, BasicShader.fsSource);
        shaders[MaterialType.MeshBasicMaterial] = shader;
        this.shader = shader;
        this.shader.updateAttributes(["positions"]);
      } else {
        this.shader = existingShader;
      }
    }
    this.geometry.updateShader(this.shader);
    this.material.updateShader(this.shader);

    if (!this.geometry.vao[this.materialType]) {
      this.geometry.createVao(this.materialType);
    }
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

    geometry.bindVao(this.materialType);
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
