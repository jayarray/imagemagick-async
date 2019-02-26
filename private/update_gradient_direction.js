let Path = require('path');
let RootDir = Path.resolve('.');
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