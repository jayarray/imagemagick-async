let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ImageInfo = require(Path.join(Filepath.QueryInfoDir(), 'imageinfo.js')).ImageInfo;
let GifInfo = require(Path.join(Filepath.QueryInfoDir(), 'gifinfo.js')).GifInfo;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));

let LinuxCommands = require('linux-commands-async');
let LocalCommand = require('linux-commands-async').Command.LOCAL;

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

    if (i == geometryStr.length - 1 && str.length != 0)
      args.push(str);
  }

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
  object.geometry = geometry;

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
  object.statistics.red = null;
  line = GetLineContaining(lines, 'Red:');
  if (line) {
    let redLines = lines.slice(line.lineNumber);
    let redStats = GetStats(redLines);
    object.statistics.red = redStats;
  }

  // Green
  object.statistics.green = null;
  line = GetLineContaining(lines, 'Green:');
  if (line) {
    let greenLines = lines.slice(line.lineNumber);
    let greenStats = GetStats(greenLines);
    object.statistics.green = greenStats;
  }

  // Blue
  object.statistics.blue = null;
  line = GetLineContaining(lines, 'Blue:');
  if (line) {
    let blueLines = lines.slice(line.lineNumber);
    let blueStats = GetStats(blueLines);
    object.statistics.blue = blueStats;
  }

  // Alpha
  object.statistics.alpha = null;
  line = GetLineContaining(lines, 'Alpha:');
  if (line != null) {
    let alphaLines = lines.slice(line.lineNumber);
    let alphaStats = GetStats(alphaLines);
    object.statistics.alpha = alphaStats;
  }

  // Overall
  object.statistics.overall = null;
  line = GetLineContaining(lines, 'Overall:');
  if (line) {
    let overallLines = lines.slice(line.lineNumber);
    let overallStats = GetStats(overallLines);
    object.statistics.overall = overallStats;
  }

  if (!object.statistics.red && !object.statistics.green && !object.statistics.blue && !object.statistics.alpha && !object.statistics.overall)
    object.statistics = null;

  return object;
}

/**
 * Returns information about the image (i.e format type, dimensions, stats, etc).
 * @param {string} src Source
 * @returns {Promise<{filename: string, format: string, width: number, height: number, colorspace: string, depth: string, size: string, path:string, statistics: {red: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, blue: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, green: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, alpha: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, overall: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }}>}} Returns a Promise. If it resolves it returns an object. Otherwise, it returns an error.
 */
function GetImageInfo(src) {
  return new Promise((resolve, reject) => {
    LocalCommand.Execute('identify', ['-verbose', `info:${src}`]).then(output => {
      if (output.stderr) {
        reject(`Failed to get image info: ${output.stderr}`);
        return;
      }

      let imageInfo = ParseImageInfo(output.stdout);
      imageInfo.path = src;

      let info = {
        dimensions: { width: imageInfo.geometry.width, height: imageInfo.geometry.height },
        colorspace: imageInfo.colorspace,
        depth: imageInfo.depth,
        channelStatistics: imageInfo.statistics,
        imageStatistics: imageInfo.overall,
        filesize: imageInfo.size
      };

      let imageInfoObj = new ImageInfo(src, imageInfo.format, info);

      resolve(imageInfoObj);
    }).catch(error => `Failed to get image info: ${error}`);
  });
}

//----------------------------------
// GIF

function GifFrameCount(src) { // displays info for all images making up the GIF.
  return new Promise((resolve, reject) => {
    LocalCommand.Execute('identify', [src]).then(output => {
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
    let imageInfo = ParseImageInfo(currStr);

    let info = {
      dimensions: { width: imageInfo.geometry.width, height: imageInfo.geometry.height },
      colorspace: imageInfo.colorspace,
      depth: imageInfo.depth,
      channelStatistics: imageInfo.statistics,
      imageStatistics: imageInfo.overall,
      filesize: imageInfo.size
    };

    let imageInfoObj = new ImageInfo(src, imageInfo.format, info);
    imageInfos.push(imageInfoObj);
  }
  object.images = imageInfos;

  return object;
}

/**
 * Returns information about the GIF file and all of the images that make it up (i.e. format type, dimensions, stats, etc).
 * @param {string} src Source
 * @returns {Promise<{frameCount: number, path: string, images: Array<{filename: string, format: string, width: number, height: number, colorspace: string, depth: string, size: string, path:string, statistics: {red: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, blue: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, green: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, alpha: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }, overall: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number }}>}>}} Returns a Promise. If it resolves it returns an object. Otherwise, it returns an error.
 */
function GetGifInfo(src) {
  return new Promise((resolve, reject) => {
    GifFrameCount(src).then(frameCount => {
      LocalCommand.Execute('identify', ['-verbose', `info:${src}`]).then(output => {
        if (output.stderr) {
          reject(`Failed to get GIF info: ${output.stderr}`);
          return;
        }

        let gifInfo = ParseGifInfo(output.stdout);
        gifInfo.frameCount = frameCount;
        gifInfo.path = src;

        let sampleFrame = gifInfo.images[0];

        let info = {
          dimensions: { width: sampleFrame.geometry.width, height: sampleFrame.geometry.height },
          colorspace: sampleFrame.colorspace,
          depth: sampleFrame.depth,
          filesize: imageInfo.size,
          frames: gifInfo.images
        };

        let gifInfoObj = new GifInfo(src, sampleFrame.Format(), info);

        resolve(gifInfoObj);
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
  return new Promise((resolve, reject) => {
    LocalCommand.Execute('identify', ['-format', '%m', src]).then(output => {
      if (output.stderr) {
        reject(`Failed to identify format: ${output.stderr}`);
        return;
      }

      let outputStr = output.stdout.trim();
      let format = null;

      if (outputStr.startsWith('GIF'))
        format = 'GIF';
      else
        format = outputStr;

      resolve(format.toLowerCase());
    }).catch(error => `Failed to identify format: ${error}`);
  });
}

//------------------------------------

function GetInfo(src) {
  return new Promise((resolve, reject) => {
    Format(src).then(format => {
      if (format == 'gif') {
        GetGifInfo(src).then(infoObj => {
          resolve(infoObj);
        }).catch(error => `Failed to get info: ${error}`);
      }
      else {
        GetImageInfo(src).then(infoObj => {
          resolve(infoObj);
        }).catch(error => `Failed to get info: ${error}`);
      }
    });
  });
}


//-------------------------------------
// PIXELS

function ParsePixelInfo(infoStr) {
  let lines = infoStr.trim().split('\n').slice(1);
  let infos = [];

  for (let i = 0; i < lines.length; ++i) {
    let currLine = lines[i];
    let parts = currLine.split(' ').filter(str => str && str != '' && str.trim() != '').map(str => str.trim());

    // Coordinates
    let coordinatesStr = parts[0].trim().replace(':', '');
    let coordinateParts = coordinatesStr.split(',');
    let x = parseInt(coordinateParts[0]);
    let y = parseInt(coordinateParts[1]);

    // Color
    let hexStr = parts[2];

    // Check transparency
    let uniqueChars = Array.from(new Set(hexStr.replace('#', '').split('')));

    infos.push({
      x: x,
      y: y,
      color: hexStr,
      isTransparent: uniqueChars.length == 1 && uniqueChars[0] == '0'
    });
  }

  return infos;
}

//-------------------------
// IMAGE INFO

class Pixel {
  /**
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @param {string} color Hex color string
   * @param {bool} isTransparent 
   */
  constructor(x, y, color, isTransparent) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isTransparent = isTransparent;
  }
}

// IMAGE INFO (No longer in use)

class ImageInfoDecomissioned {
  constructor(src, infoObj, isGif) {
    this.src_ = src;
    this.info_ = infoObj;
    this.isGif_ = isGif;
  }

  /**
   * Get info about the pixel located at (x,y).
   * @param {number} x X-coordinate
   * @param {number} y Y-ccordinate
   * @returns {Promise<{x: number, y: number, color: string}>} Returns a promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  PixelInfo(x, y) {
    let error = Validate.IsInteger(x);
    if (error)
      return Promise.reject(`Failed to get pixel info: x is ${error}`);

    error = Validate.IsInteger(y);
    if (error)
      return Promise.reject(`Failed to get pixel info: y is ${error}`);

    return new Promise((resolve, reject) => {
      let args = [this.info_.path, '-crop', `1x1+${x}+${y}`, 'text:-'];
      LocalCommand.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to get pixel info: ${output.stderr}`);
          return;
        }

        let info = ParsePixelInfo(output.stdout.trim())[0];
        let pixel = new Pixel(x, y, info.color, info.isTransparent);
        resolve(pixel);
      }).catch(error => `Failed to get pixel info: ${error}`);
    });
  }

  /**
   * Get info about all pixels in the specified row.
   * @param {number} row Row number
   * @returns {Promise<Array<{x: number, y: number, color: string}>>} Returns a promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  PixelRowInfo(row) {
    let error = Validate.IsInteger(row);
    if (error)
      return Promise.reject(`Failed to get pixel row info: row is ${error}`);

    return new Promise((resolve, reject) => {
      let args = [this.info_.path, '-crop', `${this.info_.width}x1+0+${row}`, 'text:-'];
      LocalCommand.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to get pixel row info: ${output.stderr}`);
          return;
        }

        let pixels = [];

        let infos = ParsePixelInfo(output.stdout.trim());
        infos.forEach(info => pixels.push(new Pixel(info.x, row, info.color, info.isTransparent)));
        resolve(pixels);
      }).catch(error => `Failed to get pixel row info: ${error}`);
    });
  }

  /**
   * Get info about all pixels in the specified column.
   * @param {number} column Column number
   * @returns {Promise<Array<{x: number, y: number, color: string}>>} Returns a promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  PixelColumnInfo(column) {
    let error = Validate.IsInteger(column);
    if (error)
      return Promise.reject(`Failed to get pixel column info: row is ${error}`);

    return new Promise((resolve, reject) => {
      let args = [this.info_.path, '-crop', `1x${this.info_.height}+${column}+0`, 'text:-'];
      LocalCommand.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to get pixel column info: ${output.stderr}`);
          return;
        }

        let infos = ParsePixelInfo(output.stdout.trim())

        let pixels = [];
        infos.forEach(info => pixels.push(new Pixel(column, info.y, info.color, info.isTransparent)));
        resolve(pixels);
      }).catch(error => `Failed to get pixel column info: ${error}`);
    });
  }

  /**
   * Get info about all pixels in the specified range.
   * @param {number} startRow Starting row number
   * @param {number} endRow Ending row number
   * @param {number} startColumn Starting column number
   * @param {number} endColumn Ending column number
   * @returns {Promise<Array<{x: number, y: number, color: string}>>} Returns a promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  PixelRangeInfo(startRow, endRow, startColumn, endColumn) {
    let error = Validate.IsInteger(startRow);
    if (error)
      return Promise.reject(`Failed to get pixel range info: start row is ${error}`);

    error = Validate.IsInteger(endRow);
    if (error)
      return Promise.reject(`Failed to get pixel range info: end row is ${error}`);

    error = Validate.IsInteger(startColumn);
    if (error)
      return Promise.reject(`Failed to get pixel range info: start column is ${error}`);

    error = Validate.IsInteger(endColumn);
    if (error)
      return Promise.reject(`Failed to get pixel range info: end column is ${error}`);

    return new Promise((resolve, reject) => {
      let width = (endColumn - startColumn) + 1;
      let height = (endRow - startRow) + 1;

      let parentDir = LinuxCommands.Path.ParentDir(this.src_);
      let tempFilepath = PATH.join(parentDir, Guid.Filename(Guid.DEFAULT_LENGTH, 'txt'));
      let args = [this.info_.path, '-crop', `${width}x${height}+${startColumn}+${startRow}`, `text:${tempFilepath}`];

      LocalCommand.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to get pixel range info: ${output.stderr}`);
          return;
        }

        // Read from file
        LinuxCommands.File.Read(tempFilepath, LocalCommand).then(text => {
          let infos = ParsePixelInfo(text.trim())
          let pixels = [];

          // Adjust pixel coordinates
          infos.forEach((info, i) => {
            let adjustedX = info.x + startColumn;
            let adjustedY = info.y + startRow;
            pixels.push(new Pixel(adjustedX, adjustedY, info.color, info.isTransparent))
          });

          // Clean up temp file
          LinuxCommands.File.Remove(tempFilepath, LocalCommand).then(success => {
            resolve(pixels);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(`Failed to get pixel range info: ${error}`));
    });
  }

  AllPixels(tempDir) {
    // TO DO (???)
  }
}

//-------------------------------------
// EXPORTS

exports.GetInfo = GetInfo;