let PATH = require('path');

//--------------------------------

class Filepath {
  constructor(builder) {
    this.infos = builder.infos;
  }

  /**
   * @returns {string} Returns the full path.
   */
  String() {
    let str = builder.infos.map(x => x.name).join(PATH.sep);
    return str;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.infos = [];
      }

      /**
       * @param {string} name 
       */
      dir(name) {
        this.infos.push({
          name: name,
          type: 'dir'
        });

        return this;
      }

      /**
       * @param {string} name 
       */
      file(name) {
        this.infos.push({
          name: name,
          type: 'file'
        });

        return this;
      }

      /**
       * @param {string} path
       */
      partialPath(path) {
        let parts = path.split(PATH.sep);

        parts.forEach(x => {
          this.infos.push({
            name: x,
            type: 'dir'
          });
        });
      }

      build() {
        return new Filepath(this);
      }
    }

    return new Builder();
  }

  /**
   * @returns {string} Returns the path to the project directory.
   */
  static RootDir() {
    return __dirname;
  }

  /**
   * @returns {string} Returns the path to the im_modules folder.
   */
  static ImModulesDir() {
    return Filepath.Builder
      .partialPath(Filepath.RootDir)
      .dir('im_modules')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static AnimationDir() {
    return Filepath.Builder()
      .partialPath(Filepath.ImModulesDir)
      .dir('Animation')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static ConstantsDir() {
    return Filepath.Builder()
      .partialPath(Filepath.ImModulesDir)
      .dir('Constants')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static DrawablesDir() {
    return Filepath.Builder()
      .partialPath(Filepath.ImModulesDir)
      .dir('Drawables')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static CanvasDir() {
    return Filepath.Builder()
      .partialPath(Filepath.DrawablesDir)
      .dir('Canvas')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static PrimitivesDir() {
    return Filepath.Builder()
      .partialPath(Filepath.DrawablesDir)
      .dir('Primitives')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static ShapesDir() {
    return Filepath.Builder()
      .partialPath(Filepath.DrawablesDir)
      .dir('Shapes')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static EffectsDir() {
    return Filepath.Builder()
      .partialPath(Filepath.DrawablesDir)
      .dir('Effects')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static FxDir() {
    return Filepath.Builder()
      .partialPath(Filepath.EffectsDir)
      .dir('Fx')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static ModDir() {
    return Filepath.Builder()
      .partialPath(Filepath.EffectsDir)
      .dir('Mod')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static TransformDir() {
    return Filepath.Builder()
      .partialPath(Filepath.EffectsDir)
      .dir('Transform')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static InputsDir() {
    return Filepath.Builder()
      .partialPath(Filepath.ImModulesDir)
      .dir('Inputs')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static GradientDir() {
    return Filepath.Builder()
      .partialPath(Filepath.InputsDir)
      .dir('Gradient')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static LineSegmentsDir() {
    return Filepath.Builder()
      .partialPath(Filepath.InputsDir)
      .dir('LineSegments')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static LayerDir() {
    return Filepath.Builder()
      .partialPath(Filepath.ImModulesDir)
      .dir('Layer')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static QueryDir() {
    return Filepath.Builder()
      .partialPath(Filepath.ImModulesDir)
      .dir('Query')
      .build()
      .String();
  }

  /**
   * @returns {string} Returns a path to this directory.
   */
  static ListDir() {
    return Filepath.Builder()
      .partialPath(Filepath.QueryDir)
      .dir('List')
      .build()
      .String();
  }
}

//-------------------------------
// EXPORTS

exports.Filepath = Filepath;