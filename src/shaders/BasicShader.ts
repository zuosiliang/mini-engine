// Vertex shader program
const vsSource = `
attribute vec4 aVertexPosition;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
    }
`;

const fsSource = `
precision mediump float;

uniform bool uUseTexture;
uniform vec3 uColor;
uniform sampler2D u_texture;
varying highp vec2 vTextureCoord;

void main(void) {
    if (uUseTexture) {
        gl_FragColor = texture2D(u_texture, vTextureCoord);
    } else {
        gl_FragColor = vec4(uColor, 1.0);
    }
}
`;

export default { vsSource, fsSource };
