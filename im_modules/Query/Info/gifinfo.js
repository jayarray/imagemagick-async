let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InfoBaseClass = require(Path.join(Filepath.QueryInfoDir(), 'infobaseclass.js')).InfoBaseClass;

//------------------------------------

class GifInfo extends InfoBaseClass {
  constructor(filepath, format, info) {
    super({
      filepath: filepath,
      format: format,
      info: info
    });
  }

  /**
   * @returns {Array<ImageInfo>} Returns a list of ImageInfo objects. Each one holds information about a frame.
   */
  Frames() {
    return this.info.frames;
  }

  /**
   * @param {number} i The index of the desired frame.
   */
  GetFrame(i) {
    return this.info.frames[i];
  }

  /**
   * @returns {number} Returns the total number of frames that make up the gif.
   */
  FrameCount() {
    return this.info.frames.length;
  }

  /**
   * @param {number} i The index of the frame.
   * @returns {{red: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}, green: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}, blue: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}, alpha: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}}} Returns the statistics for each channel in this file.
   */
  ChannelStatistics(i) {
    let frame = this.info.frames[i];
    return frame.ChannelStatistics();
  }

  /**
   * @param {number} i The index of the frame.
   * @returns {{min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}} Returns a consolidated summary of all channel statistic values.
   */
  ImageStatistics(i) {
    let frame = this.info.frames[i];
    return frame.ImageStatistics();
  }
}

//-------------------------------
// EXPORTS

exports.GifInfo = GifInfo;