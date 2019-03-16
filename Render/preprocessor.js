let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let Consolidator = require(Path.join(Filepath.LayerDir(), 'consolidator.js'));

//-------------------------------------
// PRIVATE

/**
 * @param {string} currDirPath 
 * @returns {string} Returns temp dir path with GUI name.
 */
function GetTempDirPath(currDirPath) {
  let tempDirPath = Path.join(currDirPath, Guid.Create(Guid.DEFAULT_LENGTH));
  return tempDirPath
}

/**
 * @param {string} currDirPath 
 * @param {string} format 
 * @returns {string} Returns temp file path with GUI name.
 */
function GetTempFilepath(currDirPath, format) {
  let tempDirPath = Path.join(currDirPath, Guid.Filename(Guid.DEFAULT_LENGTH, format));
  return tempDirPath
}

//--------------------------------------
// PUBLIC

/**
 * Create all temp dir and file paths ahead of time and update all effect layer sources for rendering. (Good for error checking ahead of time and avoiding recursive functions.)
 * @param {Layer} layer 
 * @returns {Array<{dirpath: string, filepath: string, group: Array, prevOutputPath: string}>}
 */
function PreprocessDrawablesForRendering(layer, outputDir, format, includeFoundation) {
  let foundation = layer.args.foundation;
  let appliedEffects = layer.args.appliedEffects;

  let consolidatedGroups = null;
  if (includeFoundation)
    consolidatedGroups = Consolidator.GroupConsolidatables([foundation].concat(appliedEffects));
  else
    consolidatedGroups = Consolidator.GroupConsolidatables(appliedEffects);

  let preProcessedItems = [];

  let tempDirPath = GetTempDirPath(outputDir);
  let tempFilePath = GetTempFilepath(outputDir, format);

  let prevOutputPath = null;

  for (let i = 0; i < consolidatedGroups.length; ++i) {
    let item = {
      dirpath: tempDirPath,
      filepath: tempFilePath,
      group: consolidatedGroups[i],
      prevOutputPath: prevOutputPath
    };

    preProcessedItems.push(item);

    // Update paths
    prevOutputPath = item.filepath;
    tempDirPath = GetTempDirPath(outputDir);
    tempFilePath = GetTempFilepath(outputDir, format);
  }

  return preProcessedItems;
}

/**
 * Check if there are any errors caused by effects, primitives, args, etc.
 * @param {Layer} layer
 * @returns {boolean} Returns true if there are any errors. False otherwise. 
 */
function CheckForErrors(layer) {
  // TO DO
}

//-----------------------------
// EXPORTS

exports.PreprocessDrawablesForRendering = PreprocessDrawablesForRendering;