let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let SpecialBaseClass = require(Path.join(Filepath.SpecialDir(), 'specialbaseclass.js')).SpecialBaseClass;

//----------------------------------

class ImageStackBaseClass extends SpecialBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      subtype: 'stack'
    });
  }

  /**
   * @returns {string} Returns a string containing the image stack command WITHOUT the destination appended.
   */
  Command() {
    // Override
  }
}

//------------------------------
// EXPORTS

exports.ImageStackBaseClass = ImageStackBaseClass;