class Chain {
  constructor(builder) {
    this.items = builder.items;
    this.tempDirPath = builder.tempDirPath;
    this.outputPath = builder.outputPath;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.items = [];
        this.tempDirPath = null;
        this.outputPath = null;
      }

      /**
       * FIRST: Set the temp directory path where you'd like to render everything in this chain.
       * @param {string} str 
       */
      setTempDirPath(str) {
        this.tempDirPath = str;
        return this;
      }

      /**
       * SECOND
       * @param {Item} item 
       */
      add(item) {
        this.items.push(item);
        return this;
      }

      /**
       * THIRD: Set the final path for the render you want.
       * @param {string} str 
       */
      setOutputPath(str) {
        this.outputPath = str;
        return this;
      }


      build() {
        return new Chain(this);
      }
    }
    return new Builder();
  }
}

//------------------------------
// EXPORTS

exports.Chain = Chain;