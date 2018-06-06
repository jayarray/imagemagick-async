let GUID = require('./guid.js');
let API = require('./api.js');
let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');

//--------------------------------

let outputDir = '/home/isa/Downloads';
let format = 'png';

// Create main canvas
let forestSrc = PATH.join(outputDir, 'forest.png');
let forest = API.ImageCanvas(1920, 1080, forestSrc);

//-----------------------------------
// Draw pikachus on canvases
let pikaSrc = PATH.join(outputDir, 'pikachu.png');
let pikaCount = 30;
let degreesInterval = 10;
let horizontalOffset = forest.Width() / pikaCount;

let pikachuList = [];
let pikachuPaths = [];
let pikachuActions = [];

console.log('\nCreating rotated images...');

for (let i = 0; i < pikaCount; ++i) {
  // Create pikachu canvas
  let pikachu = API.ImageCanvas(877, 910, pikaSrc);

  // Apply rotate effect
  let rotate = API.RotateImage('?', degreesInterval * i);
  pikachu.ApplyFxOrMod(rotate);
  pikachuList.push(pikachu);

  // Register action
  let pikachuPath = PATH.join(outputDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
  pikachuActions.push(pikachu.Render(pikachuPath));
  pikachuPaths.push(pikachuPath);
}

// Render all pikachus
Promise.all(pikachuActions).then(results => {
  console.log('Done!');
  console.log('\nCreating composite images...');

  // Create composites
  let compPaths = [];
  let compActions = [];

  for (let i = 0; i < pikachuActions.length; ++i) {
    let width = pikachuList[0].Width();
    let height = pikachuList[0].Height();
    let currPikachuPath = pikachuPaths[i];

    let pikachuCanvas = API.ImageCanvas(width, height, currPikachuPath);
    let compPath = PATH.join(outputDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));

    let forestCanvas = API.ImageCanvas(1920, 1080, forestSrc);
    let horizontalOffset = 100;
    let xOffset = 1600 - (horizontalOffset * i) - pikachuList[i].xOffset_;

    forestCanvas.Draw(pikachuCanvas, xOffset, 0);
    compActions.push(forestCanvas.Render(compPath));
    compPaths.push(compPath);
  }

  // Render composites
  Promise.all(compActions).then(success => {
    console.log('Done!');
    console.log('\nCreating GIF...');

    // Create GIF
    let blankCanvas = API.ColorCanvas(forest.Width(), forest.Height(), 'none');
    let loop = null;
    let delay = 10;
    let dispose = 'None';
    let gifPath = PATH.join(outputDir, 'pikachu.gif');

    API.CreateGif(blankCanvas, compPaths, loop, delay, dispose, gifPath).then(success => {
      console.log('Done!');
      console.log('\nCleaning up temp directory...');

      LINUX_COMMANDS.Remove.Files(pikachuPaths.concat(compPaths), LINUX_COMMANDS.Command.LOCAL).then(success => {
        console.log('Done!');
        console.log('\nSUCCESS :-)');
      }).catch(error => {
        console.log(`ERROR cleaning up temp files: ${error}`);
      });
    }).catch(error => {
      console.log(`ERROR creating GIF: ${error}`);
    });
  }).catch(error => {
    console.log(`ERROR rendering composites: ${error}`);
  });
}).catch(error => {
  console.log(`ERROR rendering pikachus: ${error}`);
});