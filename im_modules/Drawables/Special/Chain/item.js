class ItemBaseClass {
  constructor(properties) {
    this.type = properties.type;
    this.obj = properties.obj;
    this.outputPath = properties.outputPath;
  }
}

//--------------------------

class CommandStringItem extends ItemBaseClass {
  constructor(builder) {
    super(builder)
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'string';
      }

      /**
       * @param {string} str 
       */
      setOutputPath(str) {
        this.outputPath = str;
        return this;
      }

      /**
       * @param {str} s 
       */
      setCommand(s) {
        this.obj = s;
        return this;
      }

      build() {
        return new CommandStringItem(this);
      }
    }
    return new Builder();
  }
}

//--------------------------

class RenderItem extends ItemBaseClass {
  constructor(builder) {
    super(builder)
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'render';
      }

      /**
       * @param {string} str 
       */
      setOutputPath(str) {
        this.outputPath = str;
        return this;
      }

      /**
       * @param {Layer} layer
       */
      setLayer(layer) {
        this.obj = layer;
        return this;
      }

      build() {
        return new RenderItem(this);
      }
    }
    return new Builder();
  }
}

//------------------------------
// EXPORTS

exports.CommandStringItem = CommandStringItem;
exports.RenderItem = RenderItem;