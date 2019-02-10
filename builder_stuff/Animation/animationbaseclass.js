class AnimationBaseClass {
  constructor(properties) {
    this.category = 'animation';
    this.name = properties.name;
    this.args = properties.args;
  }

  Errors() {
    // override
  }
}

//--------------------------
// EXPORTS

exports.AnimationBaseClass = AnimationBaseClass;