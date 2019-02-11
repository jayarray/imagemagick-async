class PrimitivesBaseClass {
  constructor(builder) {
    this.name = builder.name;
    this.args = builder.args;
    this.type = 'primitive';
    this.offset = { x: 0, y: 0 };
  }

  /**
   * @override
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // Override
  }
}

//---------------------------
// EXPORTS

exports.PrimitivesBaseClass = PrimitivesBaseClass;