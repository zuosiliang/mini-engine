const vsSource = `
    attribute vec3 aVertexPosition;
    varying vec3 vTextureCoord;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    void main(void) {
        vTextureCoord = aVertexPosition;
        vec4 pos = uProjectionMatrix * uViewMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = pos.xyww;
    }
`;

const fsSource = `
    precision mediump float;
    varying vec3 vTextureCoord;
    uniform samplerCube uSkybox;
    void main(void) {
        gl_FragColor = textureCube(uSkybox, vTextureCoord);
    }
`;

export default { vsSource, fsSource };
