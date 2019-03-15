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

        this.currItem = {
          type: null,
          obj: null,
          outputPath: null
        };
      }

      /**
       * Reset the current item. (If current item exists, it will push current item to list and reset.)
       */
      push() {
        if (this.currItem == null) {
          this.currItem = {
            type: null,
            obj: null,
            outputPath: null
          };
        }
        else {
          // Add to list
          this.items.push(this.currItem);

          // Reset item
          this.currItem = {
            type: null,
            obj: null,
            outputPath: null
          };
        }

        return this;
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
       * @param {string} s Image magick command string
       */
      commandString(s) {
        this.currItem.type = 'string';
        this.currItem.obj = s;
        this.items.push(item);
        return this;
      }

      /**
       * SECOND
      * @param {Special} c Special command object  // REMOVE (???)
      */
      specialCommand(c) {
        this.currItem.type = 'command';
        this.currItem.obj = c;
        this.items.push(item);
        return this;
      }

      /**
       * SECOND
       * @param {Layer} layer
       */
      render(layer) {
        this.currItem.type = 'render';
        this.currItem.obj = layer;
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