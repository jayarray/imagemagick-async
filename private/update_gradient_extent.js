let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');
let ColorChannelsQuery = require(Path.join(Filepath.ListDir(), 'colorchannels.js')).ColorChannels;
let FontsQuery = require(Path.join(Filepath.ListDir(), 'fonts.js')).Fonts;
let GravityQuery = require(Path.join(Filepath.ListDir(), 'gravity.js')).Gravity;

//-------------------------------------------------------------------------------------

console.log('\nUpdating gradient extent values...');

let filepath = Path.join(Filepath.ConstantsDir(), 'gradient_extent.json');

let o = {
  values: [
    'Circle',
    'Diagonal',
    'Ellipse',
    'Maximum',
    'Minimum'
  ]
};

let jsonStr = JSON.stringify(o);

LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
  console.log('Done!');
}).catch(error => console.log(`Failed to update gradient extent: ${error}.`));