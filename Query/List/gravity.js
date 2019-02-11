let LINUX_COMMANDS = require('linux-commands-async');
let LOCAL_COMMAND = LINUX_COMMANDS.Command.LOCAL;

//---------------------------------
// GRAVITY

/** 
 * @returns {Promise<Array<{string}>>} Returns a promise. If it resolves, it returns a list of gravity names. Otherwise, it returns an error.
 */
function Gravity() {
  return new Promise((resolve, reject) => {
    let args = ['-list', 'gravity'];
    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get gravity values: ${output.stderr}`);
        return;
      }

      let names = output.stdout.trim().split('\n').filter(line => line && line != '' && line.trim() != '').map(line => line.trim());

      resolve(names);
    }).catch(error => `Failed to get gravity values: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.Gravity = Gravity;

exports.Name = 'Gravity';
exports.ComponentType = 'function';
exports.Func = Gravity;