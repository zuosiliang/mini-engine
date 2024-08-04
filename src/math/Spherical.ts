class Spherical {
  radius: number;
  phi: number;
  theta: number;
  constructor(radius = 1, phi = 0, theta = 0) {
    this.radius = radius;
    this.phi = phi; // polar angle
    this.theta = theta; // azimuthal angle

    return this;
  }

  set(radius: number, phi: number, theta: number) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  }

  copy(other: { radius: number; phi: number; theta: number }) {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;

    return this;
  }

  setFromVector3(v: ThreeNumbers) {
    return this.setFromCartesianCoords(v[0], v[1], v[2]);
  }

  #clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  setFromCartesianCoords(x: number, y: number, z: number) {
    this.radius = Math.sqrt(x * x + y * y + z * z);

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(x, z);
      this.phi = Math.acos(this.#clamp(y / this.radius, -1, 1));
    }

    return this;
  }
}

export default Spherical;
