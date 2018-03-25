let VALIDATE = require('./validate.js');
let COLOR = require('./color.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const DIMENSION_MIN = 1;

//-------------------------------------
// IMAGE

function GetLineContaining(lines, text) {
  for (let i = 0; i < lines.length; ++i) {
    let currLine = lines[i];
    if (currLine.includes(text))
      return { string: currLine.trim(), lineNumber: i };
  }
  return null;
}

function ParseGeometry(geometryStr) {
  let args = [];

  let str = '';
  for (let i = 0; i < geometryStr.length; ++i) {
    let currChar = geometryStr.charAt(i);
    if (!isNaN(currChar))
      str += currChar;
    else {
      args.push(str);
      str = '';
    }
  }

  // Push any remaining string to args list
  if (str != '')
    args.push(str);

  return {
    width: parseInt(args[0]),
    height: parseInt(args[1]),
    xOffset: parseInt(args[2]),
    yOffset: parseInt(args[3])
  };
}

function ParseStats(min, max, mean, std, kurtosis, skewness, entropy, overall) { // Array<string> = [min, max, mean, std, kurtosis, skewness, entropy]
  let object = {};

  // MIN
  let parts = min.split(' ');
  let minRgbValue = parseInt(parts[0]);

  let minPercentValue = parts[1];
  minPercentValue = minPercentValue.replace('(');
  minPercentValue = minPercentValue.replace(')');
  minPercentValue = parseFloat(minPercentValue * 100);

  object.min = {
    rgb: minRgbValue,
    percent: minPercentValue
  };

  // MAX
  let parts = max.split(' ');
  let maxRgbValue = parseInt(parts[0]);

  let maxPercentValue = parts[1];
  maxPercentValue = maxPercentValue.replace('(');
  maxPercentValue = maxPercentValue.replace(')');
  maxPercentValue = parseFloat(minPercentValue * 100);

  object.max = {
    rgb: maxRgbValue,
    percent: maxPercentValue
  };

  // MEAN
  let parts = max.split(' ');
  let meanRgbValue = parseInt(parts[0]);

  let meanPercentValue = parts[1];
  meanPercentValue = meanPercentValue.replace('(');
  meanPercentValue = meanPercentValue.replace(')');
  meanPercentValue = parseFloat(meanPercentValue * 100);

  object.mean = {
    rgb: meanRgbValue,
    percent: meanPercentValue
  };

  // STD
  let parts = max.split(' ');
  let stdRgbValue = parseInt(parts[0]);

  let stdPercentValue = parts[1];
  stdPercentValue = stdPercentValue.replace('(');
  stdPercentValue = stdPercentValue.replace(')');
  stdPercentValue = parseFloat(stdPercentValue * 100);

  object.mean = {
    rgb: stdRgbValue,
    percent: stdPercentValue
  };

  // KURTOSIS
  let kurtosisStr = kurtosis.split(' ')[1];
  object.kurtosis = parseInt(kurtosisStr);

  // SKEWNESS
  let skewnessStr = skewness.split(' ')[1];
  object.skewness = parseInt(skewnessStr);

  // ENTROPY
  let entropyStr = entropy.split(' ')[1];
  object.entropy = parseInt(entropyStr);

  return object;
}

function ImageInfo(src) {
  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('identify', ['-verbose', `info:${src}`]).then(output => {
      if (output.stderr) {
        reject(`Failed to get image info: ${output.stderr}`);
        return;
      }

      let lines = output.stdout.split('\n');

      let object = {};

      // Path
      object.path = src;

      // Base filename
      let line = GetLineContaining(lines, 'Base filename:').string;
      let filename = line.split(':')[1].trim();
      object.filename = filename;

      // Format
      line = GetLineContaining(lines, 'Format:').string;
      let format = line.split(':')[1].trim();
      object.format = format;

      // Geometry
      let line = GetLineContaining(lines, 'Geometry:').string;
      let geometryStr = line.split(':')[1].trim();
      let geometry = ParseGeometry(geometryStr);
      object.width = geometry.width;
      object.height = geometry.height;

      // Color space
      line = GetLineContaining(lines, 'Colorspace:').string;
      let colorspace = line.split(':')[1].trim();
      object.colorspace = colorspace;

      // Depth
      line = GetLineContaining(lines, 'Depth:').string;
      let depth = line.split(':')[1].trim();
      object.depth = depth;

      // File size
      line = GetLineContaining(lines, 'Filesize:').string;
      let size = line.split(':')[1].trim();
      object.size = size;

      // Pixel count:
      line = GetLineContaining(lines, 'Number pixels:').string;
      let size = line.split(':')[1].trim();
      object.size = size;

      // Statistics

      // RED
      line = GetLineContaining(lines, 'Red:');
      let redLines = lines.slice(line.index);

      // min
      line = GetLineContaining(redLines, '');
      let size = line.split(':')[1].trim();
      object.size = size;

      // max

      // mean

      // standard dev

      // kurtosis

      // skewness

      // entropy

      // BLUE


      // GREEN


    }).catch(error => `Failed to get image info: ${error}`);
  });
}

function GifInfo(src) { // displays info for all images making up the GIF.
  // TO DO
}


class SourceInfo {
  constructor() {
    // TO DO
  }

  static GetInfo(src) {
    // TO DO
  }
}

//-------------------------------------
// PIXELS

function PixeRowlInfo(src, row) {
  // TO DO
}

function AllPixelRowsInfo(src) {
  // TO DO
}

class PixelRowInfo {
  constructor() {
    // TO DO
  }
}

//-------------------------------------
// EXPORTS

exports.Source

