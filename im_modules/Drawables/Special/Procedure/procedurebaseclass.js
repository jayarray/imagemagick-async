let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let SpecialBaseClass = require(Path.join(Filepath.SpecialDir(), 'specialbaseclass.js')).SpecialBaseClass;

//----------------------------------

class ProcedureBaseClass extends SpecialBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      subtype: 'procedure'
    });
  }

  /**
   * @returns {Promise} Returns a Promise that resolves but does not return anything.
   */
  Render() {
    // Override
  }
}

//------------------------------
// EXPORTS

exports.ProcedureBaseClass = ProcedureBaseClass;