interface PointLightProps {
  position: ThreeNumbers;
  color: ThreeNumbers;
  constant: number;
  linear: number;
  quadratic: number;
}

class PointLight {
  position: ThreeNumbers = [0, 0, 0];
  color: ThreeNumbers = [1, 1, 1];
  constant: number = 1.0;
  linear: number = 0.09;
  quadratic: number = 0.032;

  constructor(props: PointLightProps) {
    const { position, color, constant, linear, quadratic } = props;
    this.position = position ?? this.position;
    this.color = color ?? this.color;
    this.constant = constant ?? this.constant;
    this.linear = linear ?? this.linear;
    this.quadratic = quadratic ?? this.quadratic;
  }
}

export default PointLight;
