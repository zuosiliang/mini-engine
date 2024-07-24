import LoadingManager from "./LoadingManager";
import Texture from "../textures/Texture";

class TextureLoader {
  loadingManager: LoadingManager;
  texture: Texture;
  constructor() {
    this.loadingManager = new LoadingManager();
  }

  load(url) {
    const { gl } = window.renderer;
    const webglTexture = gl.createTexture();
    const texture = new Texture(webglTexture);
    this.texture = texture;
    const image = new Image();
    const loadingManager = this.loadingManager;
    image.onload = function () {
      function handleTextureLoaded(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_NEAREST,
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
      handleTextureLoaded(image, webglTexture);

      loadingManager.itemEnd();
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
