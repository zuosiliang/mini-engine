import Renderer from "../core/Renderer";
import Shader from "../core/Shader";
import Texture from "../textures/Texture";

interface MaterialProps {
  color: ThreeNumbers;
  colorMap?: Texture;
}

abstract class Material {
  shader: Shader | undefined;
  renderer: Renderer;
  color: ThreeNumbers = [1, 1, 1];
  colorMap: Texture | null = null;

  constructor(props: MaterialProps) {
    const { color, colorMap } = props;
    this.color = color ?? this.color;
    this.colorMap = colorMap ?? this.colorMap;
    this.renderer = new Renderer();
  }
  abstract bind(): void;
  updateShader(shader: Shader): void {
    this.shader = shader;
  }
}
export default Material;
