import Camera from "../Camera";
import Spherical from "../math/Spherical";
import { vec2, vec3 } from "gl-matrix";

const convertSphericalToVec3 = (s) => {
  const { radius, phi, theta } = s;
  const sinPhiRadius = Math.sin(phi) * radius;

  const x = sinPhiRadius * Math.sin(theta);
  const y = Math.cos(phi) * radius;
  const z = sinPhiRadius * Math.cos(theta);

  return vec3.fromValues(x, y, z);
};

class OrbitControl {
  camera: Camera;
  canvas: HTMLCanvasElement;
  rotateStart: vec2;
  rotateEnd: vec2;
  rotateDelta: vec2;
  target: vec3;
  rotateSpeed: number;
  sphericalDelta: Spherical;
  spherical: Spherical;
  onMouseDown: (event: any) => void;
  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    this.rotateStart = vec2.create();
    this.rotateEnd = vec2.create();

    this.rotateDelta = vec2.create();
    this.target = vec3.create();
    this.rotateSpeed = 1;
    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();

    this.onMouseDown = (event) => {
      vec2.set(this.rotateStart, event.clientX, event.clientY);

      this.canvas.addEventListener("mousemove", this.onMouseMove);
      this.canvas.addEventListener("mouseup", this.onMouseUp);
    };

    this.onMouseMove = (event) => {
      vec2.set(this.rotateEnd, event.clientX, event.clientY);

      vec2.subtract(this.rotateDelta, this.rotateEnd, this.rotateStart);
      vec2.scale(this.rotateDelta, this.rotateDelta, this.rotateSpeed);

      this.sphericalDelta.theta -=
        (2 * Math.PI * this.rotateDelta[0]) / this.canvas.clientHeight;

      this.sphericalDelta.phi -=
        (2 * Math.PI * this.rotateDelta[1]) / this.canvas.clientHeight;

      vec2.copy(this.rotateStart, this.rotateEnd);

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
    const position = this.camera.position;

    let offset = vec3.create();

    vec3.subtract(offset, position, this.target);

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

    offset = convertSphericalToVec3(this.spherical);

    const newPosition = vec3.add(vec3.create(), this.target, offset);
    // scope.object.lookAt(scope.target);

    this.sphericalDelta = new Spherical();

    this.camera.setPosition(newPosition[0], newPosition[1], newPosition[2]);
  }
}

export default OrbitControl;
