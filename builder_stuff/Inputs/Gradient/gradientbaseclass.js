class GradientBaseClass {
  constructor(builder) {
    this.name = builder.name;
    this.args = builder.args;
    this.type = 'gradient';
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments. 
   */
  Args() {
    // Override
  }
}

//--------------------------------
// EXPORTS

exports.GradientBaseClass = GradientBaseClass;