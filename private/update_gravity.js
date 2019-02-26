let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');
let GravityQuery = require(Path.join(Filepath.ListDir(), 'gravity.js')).Gravity;

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