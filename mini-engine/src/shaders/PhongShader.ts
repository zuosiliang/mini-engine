const vsSource = `#version 300 es
in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

out highp vec2 vTextureCoord;
out highp vec3 vTransformedNormal;
out highp vec3 vWorldPosition;

void main(void) {
    vec4 worldPosition = uModelMatrix * aVertexPosition;
    vWorldPosition = worldPosition.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vTextureCoord = aTextureCoord;
    vTransformedNormal = (uNormalMatrix * vec4(aVertexNormal, 0.0)).xyz;
}
`;

const fsSource = `#version 300 es
precision mediump float;

in highp vec3 vTransformedNormal;
in highp vec3 vWorldPosition;
in highp vec2 vTextureCoord;

uniform vec3 uViewWorldPosition;
uniform vec3 uMaterialColor;
uniform vec3 uMaterialSpecular;
uniform float uMaterialShininess;
uniform vec3 uLightPositions[NR_POINT_LIGHTS];
uniform vec3 uLightColors[NR_POINT_LIGHTS];
uniform float uLightConstants[NR_POINT_LIGHTS];
uniform float uLightLinears[NR_POINT_LIGHTS];
uniform float uLightQuadratics[NR_POINT_LIGHTS];

uniform bool uUseTexture;
uniform sampler2D u_texture;

out vec4 outColor;

void main(void) {
    vec3 normal = normalize(vTransformedNormal);
    vec3 viewDir = normalize(uViewWorldPosition - vWorldPosition);

    vec3 materialColor = uUseTexture ? texture(u_texture, vTextureCoord).rgb : uMaterialColor;

    vec3 result = vec3(0.0);
    for (int i = 0; i < NR_POINT_LIGHTS; i++) {
        vec3 lightDir = normalize(uLightPositions[i] - vWorldPosition);
        vec3 halfDir = normalize(lightDir + viewDir);

        float lambertian = max(dot(lightDir, normal), 0.0);
        float specAngle = max(dot(halfDir, normal), 0.0);
        float spec = pow(specAngle, uMaterialShininess);
        vec3 specular = uLightColors[i] * (spec * uMaterialSpecular);  

        vec3 diffuse = uLightColors[i] * lambertian * materialColor;

        // Compute attenuation
        float distance = length(uLightPositions[i] - vWorldPosition);
        float attenuation = 1.0 / (uLightConstants[i] + uLightLinears[i] * distance +
                                   uLightQuadratics[i] * (distance * distance));
        result += diffuse * attenuation + specular * attenuation;
    }

    outColor = vec4(result, 1.0);
}
`;

export default {
  vsSource,
  fsSource,
};
