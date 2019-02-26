let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');
let ColorChannelsQuery = require(Path.join(Filepath.ListDir(), 'colorchannels.js')).ColorChannels;

//-----------------------------------

console.log('\nUpdating color channels...');

let filepath = Path.join(Filepath.ConstantsDir(), 'color_channels.json');

ColorChannelsQuery().then(arr => {
  let o = { values: arr };
  let jsonStr = JSON.stringify(o);

  LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
    console.log('Done!');
  }).catch(error => console.log(`\nFailed to update color channels: ${error}.`));
}).catch(error => error => console.log(`\nFailed to update color channels: ${error}.`));