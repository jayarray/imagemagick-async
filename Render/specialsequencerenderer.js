let Path = require('path');
let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));

let SpecialRendererBaseClass = require(Path.join(Filepath.RenderDir(), 'specialrendererbaseclass.js')).SpecialRendererBaseClass;
let LinuxCommands = require('linux-commands-async');

//--------------------------------------

class SpecialSequenceRenderer extends SpecialRendererBaseClass {
  constructor() {
    super();
  }

  Render(layer, outputDir, format) {
    return new Promise((resolve, reject) => {
      let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
      let outputPath = Path.join(outputDir, filename);

      let foundation = layer.args.foundation;
      let desiredDest = foundation.args.dest;

      // Temporarily change the output path
      foundation.args.dest = outputPath;

      foundation.Render().then(success => {

        // Restore dest
        foundation.args.dest = desiredDest;

        // Move file to desired dest
        LinuxCommands.Move.Move(outputPath, desiredDest, LinuxCommands.Command.LOCAL).then(success => {
          resolve(desiredDest);
        }).catch(error => `Failed to move special sequence render: ${error}`);
      }).catch(error => `Failed to render special sequence render: ${error}`);
    });
  }
}

//------------------------------
// EXPORTS

exports.SpecialSequenceRenderer = SpecialSequenceRenderer;