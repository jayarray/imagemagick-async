let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');

//-------------------------------------------------------------------------------------

console.log('\nUpdating dispose values...')
let filepath = Path.join(Filepath.ConstantsDir(), 'dispose.json');

let o = {
  values: [
    'Background',
    'None',
    'Previous',
    'Undefined'
  ]
};

let jsonStr = JSON.stringify(o);

LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
  console.log('Done!');
}).catch(error => console.log(`\nFailed to update dispose values: ${error}.`));