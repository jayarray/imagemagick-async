class GradientBaseClass {
  constructor() {
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
exports.ComponentType = 'private';