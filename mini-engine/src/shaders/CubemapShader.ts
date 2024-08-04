const vsSource = `#version 300 es
in vec3 aVertexPosition;
out vec3 vTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main(void) {
    // Flip the y-coordinate
    vTextureCoord = vec3(aVertexPosition.x, -aVertexPosition.y, aVertexPosition.z);
    vec4 pos = uProjectionMatrix * uViewMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = pos.xyww;
}
`;

const fsSource = `#version 300 es
precision mediump float;

in vec3 vTextureCoord;
uniform samplerCube uSkybox;

out vec4 outColor;

void main(void) {
    outColor = texture(uSkybox, vTextureCoord);
}
`;

export default { vsSource, fsSource };
