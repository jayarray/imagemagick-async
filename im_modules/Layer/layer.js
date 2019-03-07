let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Offset = require(Path.join(Filepath.InputsDir(), 'offset.js')).Offset;
let GravityValues = require(Path.join(Filepath.ConstantsDir(), 'gravity.js')).values;
let ObjectInterface = require(Path.join(RootDir, 'objectinterface.js')).ObjectInterface;

//-------------------------------------

class Layer extends ObjectInterface {
  constructor(builder) {
    super({
      category: 'layer',
      type: 'Layer',
      name: 'Layer',
      args: builder.args
    });
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.args = {
          foundation: null,
          overlays: [],
          appliedEffects: [],
          primitives: [],
          offset: Offset.Builder.x(0).y(0).build(),
          id: null,
          drawPrimitivesFirst: true,
          gravity: 'Center'
        };
      }

      /**
       * Declare the layer that will serve as the canvas.
       * @param {Canvas | Effect} drawableLayer
       */
      foundation(drawableLayer) {
        this.args.foundation = drawableLayer;
        return this;
      }

      /**
       * Add a layer on top of the others.
       * @param {Layer} layer 
       */
      overlay(layer) {
        this.args.overlays.push(layer);
      }

      /**
       * @param {Effect} effect 
       */
      applyEffect(effect) {
        this.args.appliedEffects.push(effect);
        return this;
      }

      /**
       * Draw a Primitive type on the foundation layer.
       * @param {Primitive} primitive 
       */
      draw(primitive) {
        this.args.primitives.push(primitive);
        return this;
      }

      /**
       * Establish the offset for the foundation layer. (The resulting image will inherit this offset.)
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
        return this;
      }

      /**
       * Declare a name for this layer.
       * @param {string} str Name of the layer. (Optional)
       */
      id(str) {
        this.args.id = str;
        return this;
      }

      /**
       * Call this function if you want to draw primitives first and apply effects after.
       */
      drawPrimitivesFirst() {
        this.args.drawPrimitivesFirst = true;
        return this;
      }

      /**
       * Call this function if you want to apply effects first and draw primitives on the resulting image.
       */
      applyEffectsFirst() {
        this.args.drawPrimitivesFirst = false;
        return this;
      }

      /**
       * Specify the gravity that will be used when overlaying layers.
       * @param {string} str 
       */
      gravity(str) {
        this.args.gravity = str;
        return this;
      }

      build() {
        return new Layer(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    // foundation
    // overlays
    // applied effects
    // primitives
    // offset
    // id
    // drawPrimitivesFirst
    // gravity

    // CONT
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      foundation: {
        category: 'drawable',
        types: ['Canvas', 'Effect']
      },
      overlays: {
        category: 'drawable',
        type: 'Layer',
        isArray: true
      },
      appliedEffects: {
        category: 'drawable',
        type: 'Effect',
        isArray: true
      },
      primitives: {
        category: 'drawable',
        type: 'Primitive',
        isArray: true
      },
      offset: {
        type: 'Offset'
      },
      id: {
        type: 'string'
      },
      drawPrimitivesFirst: {
        type: 'boolean',
        default: true
      },
      gravity: {
        type: 'string',
        options: GravityValues
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.Layer = Layer;