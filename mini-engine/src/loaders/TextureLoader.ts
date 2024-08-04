import LoadingManager from "./LoadingManager";
import Texture from "../textures/Texture";
import Renderer from "../core/Renderer";

class TextureLoader {
  loadingManager: LoadingManager = new LoadingManager();
  renderer: Renderer = new Renderer();
  texture: Texture | null = null;

  load(url: string) {
    const { gl } = this.renderer;
    if (!gl) {
      throw new Error("The gl context cannot be empty");
    }
    const webglTexture = gl.createTexture();
    if (!webglTexture) {
      throw new Error("The webglTexture cannot be empty");
    }
    const texture = new Texture(webglTexture);
    this.texture = texture;
    const image = new Image();
    const loadingManager = this.loadingManager;

    const checkGLError = (gl: WebGLRenderingContext, msg: string) => {
      const error = gl.getError();
      if (error !== gl.NO_ERROR) {
        console.error(msg, error);
      }
    };

    image.onload = () => {
      try {
        gl.bindTexture(gl.TEXTURE_2D, webglTexture);
        checkGLError(gl, "Error after binding texture");

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        checkGLError(gl, "Error after setting pixel store mode");

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        );
        checkGLError(gl, "Error after uploading texture image");

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        checkGLError(gl, "Error after setting TEXTURE_MAG_FILTER");

        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_NEAREST,
        );
        checkGLError(gl, "Error after setting TEXTURE_MIN_FILTER");

        gl.generateMipmap(gl.TEXTURE_2D);
        checkGLError(gl, "Error after generating mipmaps");

        gl.bindTexture(gl.TEXTURE_2D, null);
        checkGLError(gl, "Error after unbinding texture");

        loadingManager.itemEnd();
      } catch (e) {
        console.error("Exception during texture loading:", e);
        checkGLError(gl, "Exception during texture loading");
      }
    };

    image.onerror = () => {
      console.error("Failed to load texture image:", url);
      this.loadingManager.itemError(url); // Handle error
    };

    this.loadingManager.itemStart(); // Start loading item

    image.src = url;
    return texture;
  }
}

export default TextureLoader;
