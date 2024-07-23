import Camera from "../Camera";
import Vector2 from "../math/Vector2";
import Spherical from "../math/Spherical";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";

class OrbitControl {
  camera: Camera;
  canvas: HTMLCanvasElement;
  rotateStart: Vector2;
  rotateEnd: Vector2;
  rotateDelta: Vector2;
  target: { x: number; y: number; z: number };
  rotateSpeed: number;
  sphericalDelta: Spherical;
  spherical: Spherical;
  onMouseDown: (event: any) => void;
  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    this.rotateStart = new Vector2();
    this.rotateEnd = new Vector2();

    this.rotateDelta = new Vector2();
    this.target = new Vector3();
    this.rotateSpeed = 1;
    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();

    this.onMouseDown = (event) => {
      this.rotateStart.set(event.clientX, event.clientY);

      this.canvas.addEventListener("mousemove", this.onMouseMove);
      this.canvas.addEventListener("mouseup", this.onMouseUp);
    };

    this.onMouseMove = (event) => {
      this.rotateEnd.set(event.clientX, event.clientY);

      this.rotateDelta
        .subVectors(this.rotateEnd, this.rotateStart)
        .multiplyScalar(this.rotateSpeed);

      this.sphericalDelta.theta -=
        (2 * Math.PI * this.rotateDelta.x) / this.canvas.clientHeight;

      this.sphericalDelta.phi -=
        (2 * Math.PI * this.rotateDelta.y) / this.canvas.clientHeight;

      this.rotateStart.copy(this.rotateEnd);

      this.update();
    };

    this.onMouseUp = () => {
      this.canvas.removeEventListener("mousemove", this.onMouseMove);
      this.canvas.removeEventListener("mouseup", this.onMouseUp);
    };
    this.canvas.addEventListener("mousedown", this.onMouseDown);
  }

  setTarget(target) {
    this.target = target;
  }

  setRotateSpeed(speed) {
    this.rotateSpeed = speed;
  }

  update() {
    const offset = new Vector3();

    const position = this.camera.position;
    const positionV3 = new Vector3(position[0], position[1], position[2]);

    offset.copy(positionV3).sub(this.target);

    // angle from z-axis around y-axis
    this.spherical.setFromVector3(offset);

    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    this.spherical.phi = Math.max(0, Math.min(Math.PI, this.spherical.phi));

    const EPS = 0.000001;
    this.spherical.phi = Math.max(
      EPS,
      Math.min(Math.PI - EPS, this.spherical.phi),
    );

    offset.setFromSpherical(this.spherical);

    positionV3.copy(this.target).add(offset);

    // scope.object.lookAt(scope.target);

    this.sphericalDelta = new Spherical();

    this.camera.setPosition(positionV3.x, positionV3.y, positionV3.z);
  }
}

export default OrbitControl;
