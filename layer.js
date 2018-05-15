//---------------------------------
// LAYER (Base class)

class Layer {
  constructor() {
    this.layers_ = [];
  }

  /**
   * Add a layer to this layer.
   * @param {Layer} layer 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  Draw(layer, x, y) {
    this.layers_.push({ layer: layer, x: x, y: y });
  }

  /**
   * Write layer to disk.
   * @param {string} outputPath 
   */
  Render(outputPath) {
    // Override
  }

  /**
   * Render all layers into one.
   */
  RenderLayers_() {
    // TO DO
  }

  /**
   * @returns {string} Returns the type of layer.
   */
  Type() {
    // Override
  }
}

//---------------------------------------
// FILE

class FileLayer extends Layer {
  constructor() {
    super();
  }

  /**
   * @override
   * @param {string} outputPath 
   */
  Render(outputPath) {
    // TO DO
  }

  /**
   * @override
   */
  Type() {
    return 'file';
  }
}

//---------------------------------------
// PRIMITIVE

class Primitive extends Layer {
  constructor() {
    super();
  }

  /**
   * @override
   */
  Render(outputPath) {

  }

  /**
   * @override
   */
  Type() {
    return 'primitive';
  }
}

//---------------------------------------
// MODS

class Mod extends Layer {
  constructor() {
    super();
  }

  /**
   * @override
   */
  Render(outputPath) {

  }

  /**
   * @override
   */
  Type() {
    return 'mod';
  }
}

//--------------------------------------
// EXPORTS

exports.Layer = Layer;