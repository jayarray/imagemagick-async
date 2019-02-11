class Layer {
  constructor(builder) {
    this.canvas = builder.canvas;
    this.effects = builder.effects;
    this.offset = builder.offset;
  }

  static get Builder() {
    class Builder {
      constructor() {}

      canvas(canvas) {
        this.canvas = canvas;
        return this;
      }

      effects(effects) {
        this.effects = effects;
        return this;
      }

      offset(offset) {
        this.offset = offset;
        return this;
      }

      build() {
        return new Layer(this);
      }
    }

    return Builder;
  }
}

//---------------------------
// EXPORTS

exports.Builder = Layer.Builder;
