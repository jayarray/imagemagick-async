let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//----------------------------------
// MODIFIER

class Modifier {
  constructor() {
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments needed for executing the modifier command.
   */
  Args() {
    // Override
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments needed for executing the modifier command.
   */
  Render(outputPath) {
    return new Promise((resolve, reject) => {
      let args = this.Args().concat(outputPath);

      LOCAL_COMMAND.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to render modifier: ${output.stderr}`);
          return;
        }
        resolve();
      }).catch(error => `Failed to render modifier: ${error}`);
    });
  }
}

//--------------------------
// COLOR

class Negate extends Modifier {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for negating colors.
   */
  Args() {
    return [this.src_, '-negate'];
  }
}

class Colorize extends Modifier {
  constructor(src, fillColor, percent) {
    this.src_ = src;
    this.fillColor_ = fillColor;
    this.percent_ = percent;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for colorizing.
   */
  Args() {
    return [this.src_, '-fill', this.fillColor_, '-colorize', `${this.percent_}%`];
  }
}

class ToGrayscale extends Modifier {
  constructor(src) {
    this.src_ = src;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for converting to grayscale format.
   */
  Args() {
    return [this.src_, '-colorspace', 'Gray'];
  }
}

class ToRGB extends Modifier {
  constructor(src) {
    this.src_ = src;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for converting to RGB format.
   */
  Args() {
    return [this.src_, '-colorspace', 'RGB'];
  }
}

class Replace extends Modifier {
  constructor(src, targetColor, desiredColor, fuzz) {
    this.src_ = src;
    this.targetColor_ = targetColor;
    this.desiredColor_ = desiredColor;
    this.fuzz_ = fuzz;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for replacing one color with another.
   */
  Args() {
    return [this.src_, '-alpha', 'on', '-channel', 'rgba', '-fuzz', `${this.fuzz_}%`, '-fill', this.desiredColor_, '-opaque', this.targetColor_];
  }
}

class MakeTransparent extends Modifier {
  constructor(src, percent) {
    this.src_ = src;
    this.percent_ = percent;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for making an image transparent.
   */
  Args() {
    return [src, '-alpha', 'on', '-channel', 'a', '-evaluate', 'set', `${opacity}%`];
  }
}

class AdjustChannel extends Modifier {
  constructor(src, channel, value) {
    this.src_ = src;
    this.channel_ = channel;
    this.value_ = value;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for adjusting color channels.
   */
  Args() {
    return [this.src_, '-alpha', 'set', '-channel', this.channel_, '-evaluate', 'set', this.value_];
  }
}

class AutoLevel extends Modifier {
  constructor(src) {
    this.src_ = src;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for auto leveling colors.
   */
  Args() {
    return [this.src_, '-auto-level'];
  }
}

//-------------------------------------
// FILTERS

class Blur extends Modifier {
  constructor(src, radius, sigma, hasTransparency) {
    this.src_ = src;
    this.radius_ = radius;
    this.sigma_ = sigma;
    this.hasTransparency_ = hasTransparency;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying a blur filter.
   */
  Args() {
    let args = [this.src_];

    if (this.hasTransparency_)
      args.push('-channel', 'RGBA');
    args.push('-blur', `${this.radius_}x${this.sigma_}`);

    return args;
  }
}

class OilPainting extends Modifier {
  constructor(src, paintValue) {
    this.src_ = src;
    this.paintValue_ = paintValue;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying an oil painting filter.
   */
  Args() {
    return [this.src_, '-paint', this.paintValue_];
  }
}

class CharcoalSketch extends Modifier {
  constructor(src, charcoalValue) {
    this.src_ = src;
    this.charcoalValue_ = charcoalValue;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying a charcoal sketch filter.
   */
  Args() {
    return [this.src_, '-charcoal', this.charcoalValue_];
  }
}

class ColoringBookSketch extends Modifier {
  constructor(src, isHeavilyShaded) {
    this.src_ = src;
    this.isHeavilyShaded_ = isHeavilyShaded;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying a coloring book sketch filter.
   */
  Args() {
    let args = [this.src_];

    if (this.isHeavilyShaded_)
      args.push('-segment', '1x1', '+dither', '-colors', 2);
    args.push('-edge', 1, '-negate', '-normalize', '-colorspace', 'Gray', '-blur', '0x.5', '-contrast-stretch', '0x50%');

    return args;
  }
}

class PencilSketch extends Modifier {
  constructor(src, radius, sigma, angle) {
    this.src_ = src;
    this.radius_ = radius;
    this.sigma_ = sigma;
    this.angle_ = angle;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying a pencil sketch filter.
   */
  Args() {
    let args = [this.src_, '-colorspace', 'Gray', '-sketch', `${this.radius_}x${this.sigma_}+${this.angle_}`];

    /*
    if (hasTransparency)
      args.push('-channel', 'RGBA'); */
    args.push('-blur', `${this.radius_}x${this.sigma_}`);

    return args;
  }
}

//--------------------------------
// FX

class Swirl extends Modifier {
  constructor(src, degrees) {
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying a swirl effect.
   */
  Args() {
    return [this.src_, '-swirl', this.degrees_];
  }
}

class Implode extends Modifier {
  constructor(src, factor) {
    this.src_ = src;
    this.factor_ = factor;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying an imploding or exploding effect.
   */
  Args() {
    return [this.src_, '-implode', this.factor_];
  }
}

class Wave extends Modifier {
  constructor(src, amplitude, frequency) {
    this.src_ = src;
    this.amplitude_ = amplitude;
    this.frequency_ = frequency;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for applying an imploding or exploding effect.
   */
  Args() {
    return [this.src_, '-background', 'transparent', '-wave', `${this.amplitude_}x${this.frequency_}`];
  }
}