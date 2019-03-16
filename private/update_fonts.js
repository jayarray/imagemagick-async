let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LinuxCommands = require('linux-commands-async');
let FontsQuery = require(Path.join(Filepath.QueryListDir(), 'fonts.js')).Fonts;

//-------------------------------------------------------------------------------------

console.log('\nUpdating fonts...');

let filepath = Path.join(Filepath.ConstantsDir(), 'fonts.json');

FontsQuery().then(arr => {
  let fontNamesArr = arr.map(x => x.name);
  let o = { values: fontNamesArr };
  let jsonStr = JSON.stringify(o);

  LinuxCommands.File.Create(filepath, jsonStr, LinuxCommands.Command.LOCAL).then(success => {
    console.log('Done!');
  }).catch(error => console.log(`\nFailed to update fonts: ${error}.`));
}).catch(error => console.log(console.log(`\nFailed to update fonts: ${error}.`)));