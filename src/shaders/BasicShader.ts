// Vertex shader program
const vsSource = `
attribute vec4 aVertexPosition;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
    }
`;

// Fragment shader program
const fsSource = `
precision mediump float;

uniform vec3 uColor;
void main(void) {
    gl_FragColor = vec4(uColor, 1.0);
    }
`;

export default { vsSource, fsSource };
