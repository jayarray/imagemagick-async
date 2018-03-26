let VALIDATE = require('./validate.js');
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
  let parts = min.split(':');
  parts = parts[1].trim().split(' ');
  let minRgbValue = parseInt(parts[0]);

  let minPercentValue = parts[1];
  minPercentValue = minPercentValue.replace('(', '');
  minPercentValue = minPercentValue.replace(')', '');
  minPercentValue = parseFloat(parseFloat(minPercentValue * 100).toPrecision(6));

  object.min = {
    number: minRgbValue,
    percent: minPercentValue
  };

  // MAX
  parts = max.split(':');
  parts = parts[1].trim().split(' ');
  let maxRgbValue = parseInt(parts[0]);

  let maxPercentValue = parts[1];
  maxPercentValue = maxPercentValue.replace('(', '');
  maxPercentValue = maxPercentValue.replace(')', '');
  maxPercentValue = parseFloat(parseFloat(maxPercentValue * 100).toPrecision(6));

  object.max = {
    number: maxRgbValue,
    percent: maxPercentValue
  };

  // MEAN
  parts = mean.split(':');
  parts = parts[1].trim().split(' ');
  let meanRgbValue = parseFloat(parseFloat(parts[0]).toFixed(6));

  let meanPercentValue = parts[1];
  meanPercentValue = meanPercentValue.replace('(', '');
  meanPercentValue = meanPercentValue.replace(')', '');
  meanPercentValue = parseFloat(parseFloat(meanPercentValue * 100).toPrecision(6));

  object.mean = {
    number: meanRgbValue,
    percent: meanPercentValue
  };

  // STD
  parts = std.split(':');
  parts = parts[1].trim().split(' ');
  let stdRgbValue = parseFloat(parseFloat(parts[0]).toFixed(6));

  let stdPercentValue = parts[1];
  stdPercentValue = stdPercentValue.replace('(', '');
  stdPercentValue = stdPercentValue.replace(')', '');
  stdPercentValue = parseFloat(parseFloat(stdPercentValue * 100).toPrecision(6));

  object.std = {
    number: stdRgbValue,
    percent: stdPercentValue
  };

  // KURTOSIS
  let kurtosisStr = kurtosis.split(':')[1].trim();
  object.kurtosis = parseFloat(parseFloat(kurtosisStr).toPrecision(6));

  // SKEWNESS
  let skewnessStr = skewness.split(':')[1].trim();
  object.skewness = parseFloat(parseFloat(skewnessStr).toPrecision(6));

  // ENTROPY
  let entropyStr = entropy.split(':')[1].trim();
  object.entropy = parseFloat(parseFloat(entropyStr).toPrecision(6));

  return object;
}

function GetStats(lines) {
  let minStr = GetLineContaining(lines, 'min:').string;
  let maxStr = GetLineContaining(lines, 'max:').string;
  let meanStr = GetLineContaining(lines, 'mean:').string;
  let stdStr = GetLineContaining(lines, 'standard deviation:').string;
  let kurtosisStr = GetLineContaining(lines, 'kurtosis:').string;
  let skewnessStr = GetLineContaining(lines, 'skewness:').string;
  let entropyStr = GetLineContaining(lines, 'entropy:').string;

  let statsObj = ParseStats(minStr, maxStr, meanStr, stdStr, kurtosisStr, skewnessStr, entropyStr);
  return statsObj;
}

function ParseImageInfo(infoStr) {
  let lines = infoStr.split('\n');

  let object = {};

  // Base filename
  let line = GetLineContaining(lines, 'Base filename:').string;
  let filename = line.split(':')[1].trim();
  object.filename = filename;

  // Format
  line = GetLineContaining(lines, 'Format:').string;
  let format = line.split(':')[1].trim();
  object.format = format;

  // Geometry (Width and Height)
  line = GetLineContaining(lines, 'Geometry:').string;
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

  // Statistics:
  object.statistics = {};

  // Red
  line = GetLineContaining(lines, 'Red:');
  let redLines = lines.slice(line.lineNumber);
  let redStats = GetStats(redLines);
  object.statistics.red = redStats;

  // Green
  line = GetLineContaining(lines, 'Green:');
  let greenLines = lines.slice(line.lineNumber);
  let greenStats = GetStats(greenLines);
  object.statistics.green = greenStats;

  // Blue
  line = GetLineContaining(lines, 'Blue:');
  let blueLines = lines.slice(line.lineNumber);
  let blueStats = GetStats(blueLines);
  object.statistics.blue = blueStats;

  // Alpha
  object.alpha = null;

  line = GetLineContaining(lines, 'Alpha:');
  if (line != null) {
    let alphaLines = lines.slice(line.lineNumber);
    let alphaStats = GetStats(alphaLines);
    object.alpha = alphaStats;
  }

  // Overall
  line = GetLineContaining(lines, 'Overall:');
  let overallLines = lines.slice(line.lineNumber);
  let overallStats = GetStats(overallLines);
  object.statistics.overall = overallStats;

  return object;
}

/**
 * Returns information about the image (i.e format type, dimensions, stats, etc).
 * @param {string} src Source
 * @returns {Promise<{filename: string, format: string, width: number, height: number, colorspace: string, depth: string, size: string, path:string, statistics: {red: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, blue: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, green: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, alpha: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, overall: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }}>}} Returns a Promise. If it resolves it returns an object. Otherwise, it returns an error.
 */
function ImageInfo(src) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to get image info: source is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('identify', ['-verbose', `info:${src}`]).then(output => {
      if (output.stderr) {
        reject(`Failed to get image info: ${output.stderr}`);
        return;
      }

      let imageInfo = ParseImageInfo(output.stdout);
      imageInfo.path = src;

      resolve(imageInfo);
    }).catch(error => `Failed to get image info: ${error}`);
  });
}

//----------------------------------
// GIF

function GifFrameCount(src) { // displays info for all images making up the GIF.
  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('identify', [src]).then(output => {
      if (output.stderr) {
        reject(`Failed to get image info: ${output.stderr}`);
        return;
      }

      let lineCount = output.stdout.trim().split('\n').length;
      resolve(lineCount);
    }).catch(error => `Failed to get image info: ${error}`);
  });
}

function ParseGifInfo(infoStr) {
  let object = {};

  // Base filename
  let line = GetLineContaining(infoStr.split('\n'), 'Base filename:').string;
  let filename = line.split(':')[1].trim();
  object.filename = filename;

  // Get all image infos
  let infoStrings = infoStr.split('Image: ').filter(str => str && str != '' && str.trim() != '').map(str => str.trim());

  let imageInfos = [];
  for (let i = 0; i < infoStrings.length; ++i) {
    let currStr = infoStrings[i];
    let info = ParseImageInfo(currStr);
    imageInfos.push(info);
  }
  object.images = imageInfos;

  return object;
}

/**
 * Returns information about the GIF file and all of the images that make it up (i.e. format type, dimensions, stats, etc).
 * @param {string} src Source
 * @returns {Promise<{frameCount: number, path: string, images: Array<{filename: string, format: string, width: number, height: number, colorspace: string, depth: string, size: string, path:string, statistics: {red: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, blue: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, green: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, alpha: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, overall: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }}>}>}} Returns a Promise. If it resolves it returns an object. Otherwise, it returns an error.
 */
function GifInfo(src) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to get GIF info: source is ${error}`);

  return new Promise((resolve, reject) => {
    GifFrameCount(src).then(frameCount => {
      LOCAL_COMMAND.Execute('identify', ['-verbose', `info:${src}`]).then(output => {
        if (output.stderr) {
          reject(`Failed to get GIF info: ${output.stderr}`);
          return;
        }

        let gifInfo = ParseGifInfo(output.stdout);
        gifInfo.frameCount = frameCount;
        gifInfo.path = src;

        resolve(gifInfo);
      }).catch(error => `Failed to get GIF info: ${error}`);
    }).catch(error => `Failed to get GIF info: ${error}`);
  });
}

//--------------------------------------
// FORMAT

/**
 * @param {string} src Source
 * @returns {Promise<string>} Returns a promise. If it resolves, it returns a lowercase string representing the format type. Otherwise, it returns an error.
 */
function Format(src) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to identify format: source is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('identify', [src]).then(output => {
      if (output.stderr) {
        reject(`Failed to identify format: ${output.stderr}`);
        return;
      }

      let parts = output.stdout.trim().split(' ')
        .filter(p => p && p != '' && p.trim() != '')
        .map(p => p.trim());

      resolve(parts[1].toLowerCase());
    }).catch(error => `Failed to identify format: ${error}`);
  });
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

//--------------------------------------

let src = '/home/isa/Downloads/pika3D.png';

Format(src).then(format => {
  console.log(`FORMAT: ${format}`);

  if (format == 'gif') {
    GifInfo(src).then(info => {
      console.log(`OUTPUT: ${JSON.stringify(info)}`)
    }).catch(error => {
      console.log(`ERROR: ${error}`);
    });
  }
  else {
    ImageInfo(src).then(info => {
      console.log(`OUTPUT: ${JSON.stringify(info)}`)
    }).catch(error => {
      console.log(`ERROR: ${error}`);
    });
  }
}).catch(error => {
  console.log(`ERROR: ${error}`);
});

//-------------------------------------
// EXPORTS

exports.Format = Format;
exports.ImageInfo = ImageInfo;
exports.GifInfo = GifInfo;
