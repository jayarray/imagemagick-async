let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let TransformBaseClass = require(Path.join(Filepath.TransformDir(), 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------

class DisplaceBaseClass extends TransformBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args
    });
  }
}

//--------------------------------
// EXPORTS

exports.DisplaceBaseClass = DisplaceBaseClass;