let GUID = require('./guid.js');
let API = require('./api.js');
let PATH = require('path');
let COORDINATES = require('./coordinates.js');
let LINUX_COMMANDS = require('linux-commands-async');

//----------------------------------

let outputDir = '/home/isa/Downloads';
let logoDir = PATH.join(outputDir, 'logo');
let logoSrc = PATH.join(logoDir, 'logo.png');
let animationDir = PATH.join(logoDir, 'animation');
let imageSeqDir = PATH.join(animationDir, 'imgseq');
let format = 'png';


// Create main canvas
let canvasWidth = 1920;
let canvasHeight = 1080;
let canvas = API.ColorCanvas(canvasWidth, canvasHeight, 'black');

// Render canvas
console.log('\nRendering background...');
let canvasDest = PATH.join(imageSeqDir, 'background.png');
canvas.Render(canvasDest).then(success => {
  console.log('Done!');
  console.log('\nRendering swirls...');

  // Prepare swirl renders
  let degrees = 3160;
  let fps = 30;
  let duration = 3;
  let frameCount = fps * duration;
  let degreeInterval = degrees / frameCount;

  let swirlPaths = [];
  let swirlActions = [];

  for (let i = 0; i < frameCount; ++i) {
    let currDegrees = Math.ceil(degreeInterval * i);
    if (currDegrees > degrees)
      currDegrees = degrees;

    let swirl = API.Swirl(logoSrc, currDegrees);
    let swirlPath = PATH.join(imageSeqDir, `swirl_${i + 1}.${format}`);
    swirlActions.push(swirl.Render(swirlPath));
    swirlPaths.push(swirlPath);
  }

  // Render all swirls
  Promise.all(swirlActions).then(success => {
    console.log('Done!');
    console.log('\nRendering composites...');

    // Prepare composite renders
    swirlPaths = swirlPaths.reverse();
    let compPaths = [];
    let compActions = [];
    let gravity = 'Center';
    let digitCount = frameCount.toString().length;

    let lastIndex = 0;

    for (let i = 0; i < swirlActions.length; ++i) {
      let comp = API.Composite([canvasDest, swirlPaths[i]], gravity);

      let numberString = `${'0'.repeat(digitCount)}${i + 1}`;
      numberString = numberString.substring(numberString.length - 3);

      let compPath = PATH.join(imageSeqDir, `comp_${numberString}.${format}`);
      compActions.push(comp.Render(compPath));
      compPaths.push(compPath);
      lastIndex = i;
    }

    lastIndex += 1;

    // Add additional 1-second worth of still unswirled logo
    for (let i = 0; i < fps * 2 + 1; ++i) {
      let comp = API.Composite([canvasDest, swirlPaths[swirlPaths.length - 1]], gravity);

      let numberString = `${'0'.repeat(digitCount)}${lastIndex}`;
      numberString = numberString.substring(numberString.length - 3);

      let compPath = PATH.join(imageSeqDir, `comp_${numberString}.${format}`);
      compActions.push(comp.Render(compPath));
      compPaths.push(compPath);
      lastIndex += 1;
    }

    // Render all comps
    Promise.all(compActions).then(success => {
      console.log('Done!');
      console.log('\nCleaning up temp files...');

      let cleanupPaths = [canvasDest].concat(swirlPaths);
      LINUX_COMMANDS.Remove.Files(cleanupPaths, LINUX_COMMANDS.Command.LOCAL).then(success => {
        console.log('\nSuccess :-)');
      }).catch(error => {
        console.log(`ERROR cleaning up temp files: ${error}`);
      });
    }).catch(error => {
      console.log(`ERROR rendering composites: ${error}`);
    });
  }).catch(error => {
    console.log(`ERROR rendering swirls: ${error}`);
  });
}).catch(error => {
  console.log(`ERROR rendering background: ${error}`);
});