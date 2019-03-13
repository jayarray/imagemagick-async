let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InfoBaseClass = require(Path.join(Filepath.QueryInfoDir(), 'infobaseclass.js')).InfoBaseClass;

//------------------------------------

class ImageInfo extends InfoBaseClass {
  constructor(filepath, format, info) {
    super({
      filepath: filepath,
      format: format,
      info: info
    });
  }

  /**
   * @returns {{red: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}, green: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}, blue: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}, alpha: {min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}}} Returns the statistics for each channel in this file.
   */
  ChannelStatistics() {
    return this.info.channelStatistics;
  }

  /**
   * @returns {{min: {number: number, percent: number}, max: {number: number, percent: number}, mean: {number: number, percent: number}, std: {number: number, percent: number}, kurtosis: number, skewness: number, entropy: number}} Returns a consolidated summary of all channel statistic values.
   */
  ImageStatistics() {
    return this.info.imageStatistics;
  }
}

//-----------------------------
// EXPORTS

exports.ImageInfo = ImageInfo;