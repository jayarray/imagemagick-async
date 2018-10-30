let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Composite extends COMPOSE_BASECLASS {
  constructor(filepaths, gravity) {
    super();
    this.filepaths_ = filepaths;
    this.gravity_ = gravity;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.gravity_)
      args.push('-gravity', this.gravity_);

    // Add first 2 paths
    args.push(this.filepaths_[0], this.filepaths_[1]);

    // Add other parts accordingly
    for (let i = 2; i < this.filepaths_.length; ++i) {
      args.push('-composite', this.filepaths_[i]);
    }

    args.push('-composite');

    return args;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return this.Args();
  }

  /**
   * @override
   */
  NumberOfSources() {
    return 0;
  }

  /**
   * @override
   */
  Name() {
    return 'Composite';
  }

  /**
   * Create a Composite object. Creates a single image from a list of provided images. The first image is the bottom-most layer and the last image is the top-most layer.
   * @param {Array<string>} filepaths
   * @returns {Composite} Returns a Composite object. If inputs are invalid, it returns null.
   */
  static Create(filepaths, gravity) {
    if (!filepaths || filepaths.length < 2)
      return null;

    return new Composite(filepaths, gravity);
  }
}

//--------------------------
// EXPORTS

exports.Create = Composite.Create;
exports.Name = 'Composite';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';