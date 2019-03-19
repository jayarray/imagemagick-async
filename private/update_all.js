let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;

//--------------------------------------------

console.log('\nUpdating all constants...');

let failed = 0;
let succeeded = 0;

// Color channels
try {
  let x = require(Path.join(Filepath.PrivateDir(), 'update_color_channels.js'));
  succeeded += 1;
}
catch (err) {
  failed += 1;
  console.log(err.stack);
}

// Dispose
try {
  let x = require(Path.join(Filepath.PrivateDir(), 'update_dispose.js'));
  succeeded += 1;
}
catch (err) {
  failed += 1;
  console.log(err.stack);
}

// Fonts
try {
  let x = require(Path.join(Filepath.PrivateDir(), 'update_fonts.js'));
  succeeded += 1;
}
catch (err) {
  failed += 1;
  console.log(err.stack);
}

// Gradient direction
try {
  let x = require(Path.join(Filepath.PrivateDir(), 'update_gradient_direction.js'));
  succeeded += 1;
}
catch (err) {
  failed += 1;
  console.log(err.stack);
}

// Gradient extent
try {
  let x = require(Path.join(Filepath.PrivateDir(), 'update_gradient_extent.js'));
  succeeded += 1;
}
catch (err) {
  failed += 1;
  console.log(err.stack);
}

// Gravity
try {
  let x = require(Path.join(Filepath.PrivateDir(), 'update_gravity.js'));
  succeeded += 1;
}
catch (err) {
  failed += 1;
  console.log(err.stack);
}

console.log('\nFinished updating!');
console.log(`\nTOTAL=${succeeded + failed}, SUCCESSFUL=${succeeded}, FAILED=${failed}`);