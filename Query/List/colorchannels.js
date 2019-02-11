let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//-----------------------------------

/**
 * @returns {Promise<Array<string>>} Returns a Promise. If it resolves, it returns a list of color channel names. Otherwise, it returns an error.
 */
function ColorChannels() {
  return new Promise((resolve, reject) => {
    let args = ['-list', 'channel']; // convert:  prints newline delimited list of channels

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to make transparent: ${output.stderr}`);
        return;
      }

      let names = output.stdout.split('\n').filter(line => line && line != '' && line.trim() != '').map(line => line.trim());
      resolve(names);
    }).catch(error => `Failed to make transparent: ${error}`);
  });
}

//------------------------
// EXPORTS

exports.ColorChannels = ColorChannels;

exports.Name = 'ColorChannels';
exports.ComponentType = 'function';
exports.Func = ColorChannels;