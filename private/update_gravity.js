let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');
let GravityQuery = require(Path.join(Filepath.QueryListDir(), 'gravity.js')).Gravity;

//-------------------------------------------------------------------------------------
//
// NOTE: All scripts in this folder are for updating files in the 'Constants' folder.
//
//-------------------------------------------------------------------------------------

console.log('\nUpdating gravity values...');

let filepath = Path.join(Filepath.ConstantsDir(), 'gravity.json');

GravityQuery().then(arr => {
  let o = { values: arr };
  let jsonStr = JSON.stringify(o);

  LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
    console.log('Done!');
  }).catch(error => console.log(`\nFailed to update gravity: ${error}.`));
}).catch(error => console.log(`\nFailed to update gravity: ${error}.`));