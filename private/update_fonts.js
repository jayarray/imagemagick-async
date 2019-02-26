let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');
let FontsQuery = require(Path.join(Filepath.ListDir(), 'fonts.js')).Fonts;

//-------------------------------------------------------------------------------------

console.log('\nUpdating fonts...');

let filepath = Path.join(Filepath.ConstantsDir(), 'fonts.json');

FontsQuery().then(arr => {
  let o = { values: arr };
  let jsonStr = JSON.stringify(o);

  LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
    console.log('Done!');
  }).catch(error => console.log(`\nFailed to update fonts: ${error}.`));
}).catch(error => console.log(console.log(`\nFailed to update fonts: ${error}.`)));