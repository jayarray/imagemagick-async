let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let AnimationBaseClass = require(Path.join(Filepath.AnimationDir(), 'animationbaseclass.js')).AnimationBaseClass;

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//--------------------------------------
// GIF EXPLODE

class GifExplode extends AnimationBaseClass {
  constructor(builder) {
    super(builder);
    this.command = builder.command;
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'GifExplode';
        this.name = 'GifExplode';
        this.args = {};
        this.command = 'convert';
        this.order = ['args'];
      }

      /**
       * @param {string} str The source path.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {string} str The prefix for all resulting images.
       */
      sequenceName(str) {
        this.args.sequenceName = str;
        return this;
      }

      /**
       * @param {string} str The file extension for all resulting images.
       */
      fileExtension(str) {
        this.args.fileExtension = str;
        return this;
      }

      /**
       * @param {string} str The directory where all resulting images will be stored.
       */
      outputDir(str) {
        this.args.outputDir = str;
        return this;
      }

      build() {
        return new GifExplode(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let filenameFormatStr = `${this.args.sequenceName}_%d.${this.args.fileExtension}`;
    let destFormatStr = Path.join(this.args.outputDir, filenameFormatStr);

    return ['-coalesce', this.args.source, destFormatStr];
  }

  /**
   * @override
   */
  Errors() {
    let params = GifExplode.Parameters();
    let errors = [];
    let prefix = 'GIF_EXPLODE_ERROR';

    // Check required args

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);


    let sequenceNameErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Sequence name')
      .condition(
        new Err.StringCondition.Builder(this.args.sequenceName)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourcsequenceNameErreErr)
      errors.push(sequenceNameErr);


    let fileExtensionErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('File extension')
      .condition(
        new Err.StringCondition.Builder(this.args.fileExtension)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (fileExtensionErr)
      errors.push(fileExtensionErr);


    let outputDirErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Output directory')
      .condition(
        new Err.StringCondition.Builder(this.args.outputDir)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (outputDirErr)
      errors.push(outputDirErr);

    return errors;
  }


  /**
   * @param {string} filepath 
   * @returns {{sequenceName: string, numberStr: string, fileExtension: string, adjustedNumber: number, filepath: string}} Returns an object holding the 3 properties needed to properly rename the file.
   */
  GetSequenceNameNumberStringAndFileExtension_(filepath) {

    // Get file extension
    let fileExtension = LinuxCommands.Path.Extension(filepath).replace('.', '');

    // Get parent dir
    let parentDir = LinuxCommands.Path.ParentDir(filepath);

    // Get file name
    let fileName = LinuxCommands.Path.Filename(filepath);

    // Get sequence name
    let sequenceNameStartIndex = fileName.indexOf(this.args.sequenceName);
    let sequenceLength = this.args.sequenceName.length;
    let sequenceNameEndIndex = sequenceNameStartIndex + sequenceLength;
    let sequenceName = fileName.substring(sequenceNameStartIndex, sequenceNameEndIndex);

    // Get underscore index
    let underscoreIndex = sequenceNameEndIndex;

    // Get number
    let numberStartindex = underscoreIndex + 1;
    let numberEndIndex = numberStartindex;

    for (let i = 0; i < fileName.length; ++i) {
      let index = i + numberStartindex;
      let currChar = fileName.charAt(index);

      if (!isNaN(currChar))
        numberEndIndex += 1;
      else
        break;
    }

    let numberStr = fileName.substring(numberStartindex, numberEndIndex);
    let adjustedNumber = Number(numberStr) + 1;

    return {
      sequenceName: sequenceName,
      numberStr: numberStr,
      fileExtension: fileExtension,
      adjustedNumber: adjustedNumber,
      filepath: filepath
    };
  }


  /**
   * @returns {Promise<string>} Returns a Promise with a list of filepaths.
   */
  Render() {
    return new Promise((resolve, reject) => {
      let cmd = this.command;
      let args = this.Args();

      LocalCommand.Execute(cmd, args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        // Get filepaths produced by command

        let pattern = `${this.args.sequenceName}_*.${this.args.fileExtension}`;
        LinuxCommands.Find.FilesByName(this.args.outputDir, pattern, 1, LocalCommand).then(results => {

          let filepaths = results.paths;

          if (filepaths.length == 0) {
            resolve([]);
            return;
          }

          // Sort objects in descending order (highest to lowest) to avoid renaming overlap or skip errors
          let oArr = filepaths.map(x => this.GetSequenceNameNumberStringAndFileExtension_(x));
          oArr.sort((a, b) => b.adjustedNumber - a.adjustedNumber);


          // Adjust number assigned to filepath

          let renameFiles = (objArr, maxDigits, renamedPaths) => {
            return new Promise((resolve, reject) => {
              if (!objArr || objArr.length == 0) {
                resolve(renamedPaths);
                return;
              }

              let currObj = objArr[0];
              let nextObjs = objArr.slice(1);

              let currFilepath = currObj.filepath;

              let adjustedNumberStr = '0'.repeat(maxDigits);
              adjustedNumberStr = `${adjustedNumberStr}${currObj.adjustedNumber}`;
              adjustedNumberStr = adjustedNumberStr.substring(adjustedNumberStr.length - maxDigits);

              let newFilename = `${currObj.sequenceName}_${adjustedNumberStr}.${currObj.fileExtension}`;
              let newFilepath = Path.join(this.args.outputDir, newFilename);


              // Rename file
              LinuxCommands.Move.Move(currFilepath, newFilepath, LocalCommand).then(success => {

                // Push new filepath
                renamedPaths.push(newFilepath);

                // Recurse
                resolve(renameFiles(nextObjs, maxDigits, renamedPaths));
              }).catch(error => reject(error));
            });
          };

          let frameCount = filepaths.length + 1;         // Adjusted to accomodate starting from frame number 1
          let maxDigits = frameCount.toString().length;  // Number of characters in the number string

          renameFiles(oArr, maxDigits, []).then(newPaths => {

            // Sort paths
            newPaths.sort();

            resolve(newPaths);
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(`Failed to render '${this.name}' effect: ${error}`));
    });
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string',
        required: true
      },
      sequenceName: {
        type: 'string',
        required: true
      },
      fileExtension: {
        type: 'string',
        required: true
      }
    };
  }
}

//---------------------------------
// EXPORTS

exports.GifExplode = GifExplode;