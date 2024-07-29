import Camera from "../cameras/PerspectiveCamera";
import { mat4 } from "gl-matrix";

class BrowseControl {
  lastX: number;
  lastY: number;
  currentAngle: number[];
  dragging: boolean;
  canvas: HTMLCanvasElement;
  camera: Camera;
  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.lastX = -1;
    this.lastY = -1;
    this.dragging = false;
    this.currentAngle = [0.0, 0.0];
    this.canvas = canvas;
    this.camera = camera;

    canvas.onmousedown = (ev) => {
      const x = ev.clientX;
      const y = ev.clientY;
      const rect = ev.target.getBoundingClientRect();
      if (
        rect.left <= x &&
        x < rect.right &&
        rect.top <= y &&
        y < rect.bottom
      ) {
        this.lastX = x;
        this.lastY = y;
        this.dragging = true;
      }
    };
    document.onmouseup = (ev) => {
      this.dragging = false;
    };
    document.onmousemove = (ev) => {
      const x = ev.clientX;
      const y = ev.clientY;
      if (this.dragging) {
        const factor = 1 / canvas.height;
        const dx = factor * (this.lastX - x);
        const dy = factor * (this.lastY - y);
        this.currentAngle[0] = Math.max(
          Math.min(this.currentAngle[0] + dy, Math.PI / 2),
          -Math.PI / 2,
        );
        this.currentAngle[1] += dx;
        this.lastX = x;
        this.lastY = y;
      }
    };
  }

  update() {
    const modelMatrix = mat4.create();
    const viewMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);
    mat4.rotate(modelMatrix, modelMatrix, this.currentAngle[0], [1, 0, 0]);
    mat4.rotate(modelMatrix, modelMatrix, this.currentAngle[1], [0, 1, 0]);

    mat4.multiply(modelMatrix, this.camera.viewMatrix, modelMatrix);
    mat4.copy(viewMatrix, modelMatrix);

    this.camera.setViewMatrix(viewMatrix);
  }
}

export default BrowseControl;
