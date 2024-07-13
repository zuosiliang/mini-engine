import { vec3, mat4 } from "gl-matrix";
import Material from "./Material";
import Shader from "./Shader";
import Geometry from "./Geometry";

const lightVShader = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying highp vec3 vTransformedNormal;
varying highp vec3 vWorldPosition;

void main(void) {
    vec4 worldPosition = uModelMatrix * aVertexPosition;
    vWorldPosition = worldPosition.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    
    vTransformedNormal = (uNormalMatrix * vec4(aVertexNormal, 0.0)).xyz;
}
`;

const lightFShader = `
precision mediump float;

varying highp vec3 vTransformedNormal;
varying highp vec3 vWorldPosition;

uniform vec3 uLightWorldPosition;
uniform vec3 uViewWorldPosition;
uniform vec3 uLightColor;
uniform vec3 uMaterialColor;
uniform vec3 uMaterialSpecular;
uniform float uMaterialShininess;

void main(void) {
    vec3 normal = normalize(vTransformedNormal);
    vec3 lightDir = normalize(uLightWorldPosition - vWorldPosition);
    vec3 viewDir = normalize(uViewWorldPosition - vWorldPosition);
    vec3 halfDir = normalize(lightDir + viewDir);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specAngle = max(dot(halfDir, normal), 0.0);
    float spec = pow(specAngle, uMaterialShininess);
    vec3 specular = uLightColor * (spec * uMaterialSpecular);  

    vec3 diffuse = uLightColor * lambertian * uMaterialColor;
    vec3 ambient = uMaterialColor;
    vec3 finalColor = diffuse + specular;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

class MeshPhongMaterial extends Material {
  color: [number, number, number];
  specular: [number, number, number];
  shininess: number;
  shaderProgram: WebGLProgram | undefined;
  shader: Shader;

  constructor(
    color: [number, number, number],
    specular: [number, number, number],
    shininess: number,
  ) {
    super();
    this.color = color;
    this.specular = specular;
    this.shininess = shininess;
    this.shader = new Shader(lightVShader, lightFShader);
    this.shaderProgram = this.shader.shaderProgram;
  }

  bind(geometry: Geometry) {
    const { camera } = this.renderer;
    const { shader } = this;
    if (shader) {
      const modelMatrix = mat4.create();
      mat4.fromRotationTranslationScale(
        modelMatrix,
        geometry.rotation,
        geometry.position,
        geometry.scale,
      );

      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

      shader.use();
      shader.setMat4("uViewMatrix", camera.viewMatrix);
      shader.setMat4("uProjectionMatrix", camera.projectionMatrix);
      shader.setMat4("uModelMatrix", modelMatrix);
      shader.setMat4("uNormalMatrix", normalMatrix);
      shader.setVec3("uLightWorldPosition", [0, 0, 0]);
      shader.setVec3("uViewWorldPosition", [0, 0, 6]);
      shader.setVec3("uLightColor", [1, 1, 1]);
      shader.setVec3("uMaterialColor", this.color);
      shader.setVec3("uMaterialSpecular", this.specular);
      shader.setFloat("uMaterialShininess", this.shininess);
    }
  }
}

export default MeshPhongMaterial;
