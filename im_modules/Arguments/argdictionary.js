class ArgDictionary {
  constructor(builder) {
    this.dict = builder.dict;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.dict = {};
      }

      /**
       * @param {string} name 
       * @param {object} properties 
       */
      add(name, properties) {
        this.dict[name] = properties;
      }

      build() {
        return new ArgDictionary(this);
      }
    }
    return Builder;
  }

  /**
   * @param {string} name The name of the desired argument.
   * @return {object} Returns an object with the corresponding properties.
   */
  Get(name) {
    return this.dict[name];
  }
}

//----------------------------------
// EXPORTS

exports.Builder = ArgDictionary.Builder;