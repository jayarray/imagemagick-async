let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//----------------------------------
// CONSTANTS

const DIMENSION_MIN = 1;

//-----------------------------------
// ERROR CHECK

function GetParentClass(o) {
  return Object.getPrototypeOf(o.constructor).name;
}

function AllObjectsArePrimitiveType(arr) {
  for (let i = 0; i < arr.length; ++i) {
    let parentClass = GetParentClass(arr[i].primitive_);
    if (parentClass != 'Primitive')
      return false;
  }
  return true;
}

//-----------------------------------
// ELEMENT

class Element {
  constructor(primitive, xOffset, yOffset) {
    this.primitive_ = primitive;
    this.xOffset_ = xOffset;
    this.yOffset_ = yOffset;
  }

  Args() {
    this.primitive_.Offset(this.xOffset_, this.yOffset_); // Apply offsets
    return this.primitive_.Args();
  }
}


//-----------------------------------
// CANVAS

class Canvas {
  constructor(width, height) {
    this.elements_ = [];
  }

  /**
   * Add primitive types to the canvas.
   * @param {Primitive} primitive A primitive type
   * @param {number} xOffset X-offset
   * @param {number} yOffset Y-offset
   */
  Add(primitive, xOffset, yOffset) {
    this.elements_.push(new Element(primitive, xOffset, yOffset));
  }

  /**
   * @param {string} outputPath The location where the image will be rendered.
   */
  Draw(outputPath) {
    // Override
  }
}

//----------------------------------------
// PLAIN CANVAS

class PlainCanvas extends Canvas {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   */
  constructor(width, height, color) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.color_ = color;
  }

  /**
   * @override
   * @param {string} outputPath The location where the image will be rendered.
   * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it will return an error.
   */
  Draw(outputPath) {
    let error = VALIDATE.IsStringInput(outputPath);
    if (error)
      return Promise.reject(`Failed to draw canvas: output path is ${error}`);

    if (this.elements_.length > 0 && !AllObjectsArePrimitiveType(this.elements_))
      return Promise.reject(`Failed to draw canvas: canvas contains non-primitive types.`);

    return new Promise((resolve, reject) => {
      // Add canvas args
      let args = ['-size', `${this.width_}x${this.height_}`, `canvas:${this.color_}`];

      // Add args for all elements on canvas
      if (this.elements_.length == 0) {
        args.push(outputPath);
      }
      else {
        this.elements_.forEach(element => {
          args = args.concat(element.Args());
        });
        args.push(outputPath);
      }

      LOCAL_COMMAND.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to draw canvas: ${output.stderr}`);
          return;
        }
        resolve();
      }).catch(error => `Failed to draw canvas: ${error}`);
    });
  }

  /**
   * Create a PlainCanvas object with the specified properties.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   * @returns {PlainCanvas} Returns a PlainCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, color) {
    if (
      VALIDATE.IsInteger(width) ||
      VALIDATE.IsIntegerInRange(width, DIMENSION_MIN, null) ||
      VALIDATE.IsInteger(height) ||
      VALIDATE.IsIntegerInRange(height, DIMENSION_MIN, null) ||
      VALIDATE.IsStringInput(color)
    )
      return null;

    return new PlainCanvas(width, height, color);
  }
}

//----------------------------------------
// GRADIENT CANVAS

class GradientCanvas extends Canvas {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} gradient A LinearGradient or RadialGradient object.
   */
  constructor(width, height, gradient) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.gradient_ = gradient;
  }

  /**
   * @override
   * @param {string} outputPath The location where the image will be rendered.
   * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it will return an error.
   */
  Draw(outputPath) {
    let error = VALIDATE.IsStringInput(outputPath);
    if (error)
      return Promise.reject(`Failed to draw canvas: output path is ${error}`);

    if (this.elements_.length > 0 && !AllObjectsArePrimitiveType(this.elements_))
      return Promise.reject(`Failed to draw canvas: canvas contains non-primitive types.`);

    return new Promise((resolve, reject) => {
      // Add canvas and gradient args
      let args = ['-size', `${this.width_}x${this.height_}`].concat(this.gradient_.Args());

      // Add args for all elements on canvas
      if (this.elements_.length == 0) {
        args.push(outputPath);
      }
      else {
        this.elements_.forEach(element => {
          args = args.concat(element.Args());
        });
        args.push(outputPath);
      }

      LOCAL_COMMAND.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to draw canvas: ${output.stderr}`);
          return;
        }
        resolve();
      }).catch(error => `Failed to draw canvas: ${error}`);
    });
  }

  /**
   * Create a GradientCanvas object with the specified gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} gradient A LinearGradient or RadialGradient object.
   * @returns {GradientCanvas} Returns a GradientCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, gradient) {
    let parentClass = GetParentClass(gradient);
    if (parentClass != 'Gradient')
      return null;

    return new GradientCanvas(width, height, gradient);
  }
}

//------------------------------------
// IMAGE CANVAS

class ImageCanvas extends Canvas {
  /**
   * @param {string} src Source
   */
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @override
   * @param {string} outputPath The location where the image will be rendered.
   * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it will return an error.
   */
  Draw(outputPath) {
    let error = VALIDATE.IsStringInput(outputPath);
    if (error)
      return Promise.reject(`Failed to draw canvas: output path is ${error}`);

    if (this.elements_.length > 0 && !AllObjectsArePrimitiveType(this.elements_))
      return Promise.reject(`Failed to draw canvas: canvas contains non-primitive types.`);

    return new Promise((resolve, reject) => {
      // Include all elements on the canvas
      let args = [this.src_];

      // Add args for all elements on canvas
      if (this.elements_.length == 0) {
        args.push(outputPath);
      }
      else {
        this.elements_.forEach(element => {
          args = args.concat(element.Args());
        });
        args.push(outputPath);
      }

      LOCAL_COMMAND.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to draw canvas: ${output.stderr}`);
          return;
        }
        resolve();
      }).catch(error => `Failed to draw canvas: ${error}`);
    });
  }

  /**
   * Create an ImageCanvas object. If inputs are invalid it returns null.
   * @param {string} src Source
   */
  static Create(src) {
    if (VALIDATE.IsStringInput(src))
      return null;

    return new ImageCanvas(src);
  }
}

//--------------------------------
// EXPORTS

exports.CreatePlainCanvas = PlainCanvas.Create;
exports.CreateGradientCanvas = GradientCanvas.Create;
exports.CreateImageCanvas = ImageCanvas.Create;