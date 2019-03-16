let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');

//-------------------------------------------------------------------------------------

console.log('\nUpdating gradient direction values...');

let filepath = Path.join(Filepath.ConstantsDir(), 'gradient_direction.json');

let o = {
  values: [
    'NorthWest',
    'North',
    'Northeast',
    'West',
    'East',
    'SouthWest',
    'South',
    'SouthEast'
  ]
};

let jsonStr = JSON.stringify(o);

LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
  console.log('Done!');
}).catch(error => console.log(`Failed to update gradient direction: ${error}.`));