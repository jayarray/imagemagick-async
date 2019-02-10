class AnimationBaseClass {
  constructor(builder) {
    this.category = 'animation';
    this.name = builder.name;
    this.args = builder.args;
  }

  Args() {
    // override
  }

  Errors() {
    // override
  }
}

//--------------------------
// EXPORTS

exports.AnimationBaseClass = AnimationBaseClass;