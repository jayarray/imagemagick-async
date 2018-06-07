let LINUX_COMMANDS = require('linux-commands-async');
let LOCAL_COMMAND = LINUX_COMMANDS.Command.LOCAL;

//-----------------------------------------------
// FONTS

function Fonts() {
  return new Promise((resolve, reject) => {
    let args = ['-list', 'font'];

    LOCAL_COMMAND.Execute('convert', args, LOCAL_COMMAND).then(output => {
      if (output.stderr) {
        reject(output.stderr);
        return;
      }

      // Parse output here
      // ???
    }).catch(error => reject(error));
  });

}