const vsSource = `



attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;
varying highp vec3 vTransformedNormal;
varying highp vec3 vWorldPosition;

void main(void) {
    vec4 worldPosition = uModelMatrix * aVertexPosition;
    vWorldPosition = worldPosition.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    
    vTextureCoord = aTextureCoord;
    vTransformedNormal = (uNormalMatrix * vec4(aVertexNormal, 0.0)).xyz;
}
`;

const fsSource = `
precision mediump float;

varying highp vec3 vTransformedNormal;
varying highp vec3 vWorldPosition;

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
varying highp vec2 vTextureCoord;

void main(void) {
    vec3 normal = normalize(vTransformedNormal);
    vec3 viewDir = normalize(uViewWorldPosition - vWorldPosition);

    vec3 materialColor = uUseTexture ? texture2D(u_texture, vTextureCoord).rgb : uMaterialColor;

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

    gl_FragColor = vec4(result, 1.0);
}

`;

export default {
  vsSource,
  fsSource,
};
