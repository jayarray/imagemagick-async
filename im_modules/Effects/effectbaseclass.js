class Effect {
  constructor(builder) {
    this.name = builder.name;
    this.type = builder.type;
    this.args = builder.args;
  }

  static get Builder() {
    class Builder {
      constructor() {}

      /**
       * @param {string} name
       */
      name(name) {
        this.name = name;
        return this;
      }

      /**
       * @param {string} type
       */
      type(type) {
        this.type = type;
        return this;
      }

      /**
       * @param {Array<{name: string, type: string, value: any}>} tuples
       */
      args(tuples) {
        this.args = {};

        tuples.forEach(t => {
          this.args[t.name] = { type: t.type, value: t.value };
        });

        return this;
      }

      build() {
        return new Effect(this);
      }
    }

    return Builder;
  }
}

//-------------------------------
// EXPORTS

exports.Builder = Effect.Builder;
