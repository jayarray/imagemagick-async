class InfoBaseClass {
  constructor(properties) {
    this.filepath = properties.filepath;
    this.format = properties.format;
    this.info = properties.info;
  }

  /**
   * @returns {string} Returns the filepath of this file.
   */
  Filepath() {
    return this.filepath;
  }

  /**
   * @returns {string} Returns the format of this file.
   */
  Format() {
    return this.format;
  }

  /**
   * @returns {{width: number, height: number}} Returns the dimensions of this file.
   */
  Dimensions() {
    return this.info.dimensions;
  }

  /**
   * @returns {string} Returns the colorspace of this file.
   */
  Colorspace() {
    return this.info.colorspace;
  }

  /**
   * @returns {string} Returns the color depth of this file.
   */
  Depth() {
    return this.info.depth;
  }

  /**
   * @returns {string} Returns a string with the filesize.
   */
  Filesize() {
    return this.info.filesize;
  }
}

//--------------------------------
// EXPORTS

exports.InfoBaseClass = InfoBaseClass;