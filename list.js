let LINUX_COMMANDS = require('linux-commands-async');
let LOCAL_COMMAND = LINUX_COMMANDS.Command.LOCAL;

//---------------------------------
// FONTS

/** 
 * @returns {Promise<Array<{name: string, family: string, style: string, stretch: string, weight: number}>>} Returns a promise. If it resolves, it returns a list of objects containing font information. Otherwise, it returns an error.
 */
function Fonts() {
  return new Promise((resolve, reject) => {
    let args = ['-list', 'font'];
    LOCAL_COMMAND.Execute('identify', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get fonts: ${output.stderr}`);
        return;
      }

      let outputStr = output.stdout.trim();
      outputStr = outputStr.split('\n').filter(line => line && line != '' && line.trim() != '').map(line => line.trim()).slice(1).join('\n');

      let blocks = outputStr.split('Font:').filter(str => str && str != '' && str.trim() != '').map(str => str.trim());

      let fonts = [];
      blocks.forEach(block => {
        let lines = block.split('\n').filter(line => line && line != '' && line.trim() != '').map(line => line.trim());

        let name = lines[0].trim();
        let family = lines[1].split(':')[1].trim();
        let style = lines[2].split(':')[1].trim();
        let stretch = lines[3].split(':')[1].trim();
        let weight = parseInt(lines[4].split(':')[1].trim());

        fonts.push({
          name: name,
          family: family,
          style: style,
          stretch: stretch,
          weight: weight
        });
      });

      resolve(fonts);
    }).catch(error => `Failed to get fonts: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.Fonts = Fonts;