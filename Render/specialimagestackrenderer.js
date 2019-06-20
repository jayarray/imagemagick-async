let Path = require('path');
let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));

let SpecialRendererBaseClass = require(Path.join(Filepath.RenderDir(), 'specialrendererbaseclass.js')).SpecialRendererBaseClass;
let LinuxCommands = require('linux-commands-async');

//--------------------------------------

class SpecialImageStackRenderer extends SpecialRendererBaseClass {
  constructor() {
  }

  /**
   * @override
   */
  Render(layer, outputDir, format) {
    return new Promise((resolve, reject) => {
      let filename = Guid.Filename(Guid.DEFAULT_LENGTH, format);
      let outputPath = Path.join(outputDir, filename);
      let cmd = `${layer.args.foundation.Command()} ${outputPath}`;

      LinuxCommands.Command.LOCAL.Execute(cmd, []).then(output => {
        if (output.stderr) {
          reject(`Failed to render special image stack: ${output.stderr}`);
          return;
        }

        resolve(outputPath);
      }).catch(error => reject(`Failed to render special image stack: ${error}`));
    });
  }
}

//------------------------------
// EXPORTS

exports.SpecialImageStackRenderer = SpecialImageStackRenderer;