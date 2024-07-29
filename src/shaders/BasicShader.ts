// Vertex shader program
const vsSource = `#version 300 es
in vec4 aVertexPosition;
in vec2 aTextureCoord;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out highp vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}
`;

const fsSource = `#version 300 es
precision mediump float;

uniform bool uUseTexture;
uniform vec3 uColor;
uniform sampler2D u_texture;

in highp vec2 vTextureCoord;
out vec4 outColor;

void main(void) {
    if (uUseTexture) {
        outColor = texture(u_texture, vTextureCoord);
    } else {
        outColor = vec4(uColor, 1.0);
    }
}
`;

export default { vsSource, fsSource };
