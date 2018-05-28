let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let PATH = require('path');
let OPTIMIZER = require('./optimizer.js');
let LINUX_COMMANDS = require('linux-commands-async');

//--------------------------------
// CONSTANTS

const GUID_LENGTH = 32;
const MIN_FILEPATHS = 2;

//--------------------------------
// GUID

/**
 * Create a GUID.
 * @param {number} length
 * @returns {string} Returns a GUID string.
 */
function GUID(length) {
  let guid = '';

  for (let i = 0; i < length; ++i)
    guid += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

  return guid;
}

/**
 * Create a filename with GUID as name.
 * @param {number} length 
 * @param {string} extension 
 */
function GuidFilenameGenerator(length, extension) {
  return `${GUID(length)}.${extension}`;
}

//---------------------------------
// ARGS

function GetArgs(layer) {
  if (layer) {
    if (layer.Type() == 'canvas' || layer.Type() == 'file')
      return layer.GetArgs_();
    return layer.Args();
  }
  return null;
}

//---------------------------------
// LAYER (Base class)

class Layer {
  constructor() {
    this.layers_ = [];
  }

  /**
   * Get the command used to render the layer.
   */
  Command() {
    // Override (Different layers use different command keywords: i.e. 'convert <...>', 'compare <...>', etc)
  }

  /**
   * Add a layer to this layer.
   * @param {Layer} layer 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  Draw(layer, x, y) {
    this.layers_.push({ layer: layer, x: x, y: y });
  }

  /**
   * Write layer to disk.
   * @param {string} outputPath 
   */
  Render(outputPath) {
    return new Promise((resolve, reject) => {
      let parentDir = LINUX_COMMANDS.Path.ParentDir(outputPath);

      this.RenderLayers_(parentDir).then(filepaths => {
        // Finish if no compositing is needed.
        if (filepaths.length < MIN_FILEPATHS) {
          LINUX_COMMANDS.Move.Move(filepaths[0], outputPath, LOCAL_COMMAND).then(success => {
            resolve();
          }).catch(error => reject(error));
        }
        else {
          // Create composite
          RenderComposite(filepaths, null, outputPath).then(success => {
            // Clean up temp files
            LINUX_COMMANDS.Remove.Files(filepaths, LOCAL_COMMAND).then(success => {
              resolve();
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }
      }).catch(error => reject(error));
    });
  }

  /**
   * Render all layers into one. (BRUTE FORCE: Needs optimizing) <= TO DO!!!
   */
  RenderLayers_(outputDir) {
    return new Promise((resolve, reject) => {
      let filepaths = [];
      let actions = [];

      // Add this layer to render list
      let thisFilepath = PATH.join(outputDir, GuidFilenameGenerator(GUID_LENGTH, 'png'));
      filepaths.push(thisFilepath);

      let thisArgs = GetArgs(this).concat(thisFilepath);
      actions.push(LOCAL_COMMAND.Execute(this.Command(), thisArgs));

      // Create flat list of layers
      let flatList = OPTIMIZER.Analyze(this).hierarchy.flatlist;

      // Add all other layers to render list
      for (let i = 0; i < flatList.length; ++i) {
        let currNode = flatList[i];
        let filepath = PATH.join(outputDir, GuidFilenameGenerator(GUID_LENGTH, 'png'));
        filepaths.push(filepath);

        let args = GetArgs(currNode.layer_.layer).concat(filepath);
        actions.push(LOCAL_COMMAND.Execute(this.Command(), args));
      }

      // Render all layers
      Promise.all(actions).then(results => {
        resolve(filepaths);
      }).catch(error => reject(error));
    });
  }

  /**
   * @returns {string} Returns the type of layer.
   */
  Type() {
    // Override
  }
}

//-------------------------------------
// COMPOSITE

function RenderComposite(filepaths, gravity, outputPath) {
  if (filepaths.length < MIN_FILEPATHS)
    return Promise.reject(`Failed to create composite: ${MIN_FILEPATHS} or more filepaths required.`);

  return new Promise((resolve, reject) => {
    let args = [];

    if (this.gravity_)
      args.push('-gravity', this.gravity_);

    // Add first 2 paths
    args.push(this.filepaths_[0], this.filepaths_[1]);

    // Add other parts accordingly
    for (let i = 2; i < this.filepaths_.length; ++i) {
      args.push('-composite', this.filepaths_[i]);
    }
    args.push('-composite', outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to creaqte GIF: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to create GIF: ${error}`);
  });
}

//---------------------------------------
// RENDER METHODS (Experimenting)

const PromiseSerial = funcs =>
  funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]));


/**
 * Get an ordered flat list of layers.
 * @param {Layer} layer 
 * @returns {Array<Layer>} Returns an aray of Layer objects.
 */
function GetOrderedFlatListOfLayers(layer) {
  let childrenFlatList = OPTIMIZER.Analyze(layer).hierarchy.flatlist.map(node => node.Layer()); // Convert Node -> Layer
  return layer.concat(childrenFlatList);
}

function SetSource(layer, source) {
  if (layer.src_)
    layer.src_ = s;
  else if (layer.src1_)
    layer.src1_ = s;
}

/**
 * Apply effects in sequence. (A <- B, AB <- C, ABC <- D)
 * @param {Layer} layer 
 * @param {string} outputDir 
 */
function ApplyEffectsInSequence(layer, outputDir) {
  return new Promise((resolve, reject) => {
    let filepaths = [];
    let actions = [];

    // Add this layer to render list
    let thisFilepath = PATH.join(outputDir, GuidFilenameGenerator(GUID_LENGTH, 'png'));
    filepaths.push(thisFilepath);

    let thisArgs = GetArgs(layer).concat(thisFilepath);
    actions.push(LOCAL_COMMAND.Execute(layer.Command(), thisArgs));

    // Create flat list of layers
    let flatList = GetOrderedFlatListOfLayers(layer);

    // Add all other layers to render list
    for (let i = 0; i < flatList.length; ++i) {
      let currLayer = flatList[i];
      let outputPath = PATH.join(outputDir, GuidFilenameGenerator(GUID_LENGTH, 'png'));
      filepaths.push(outputPath);

      let args = GetArgs(currLayer).concat(outputPath);
      let cmd = currLayer.Command();
      actions.push(LOCAL_COMMAND.Execute(cmd, args));
    }

    // Render
    PromiseSerial(actions).then(results => {
      resolve();
    }).catch(error => reject(error));
  });
}


/**
 * Apply effects in sequence. (A <- B, AB <- C, ABC <- D)
 * @param {Layer} layer 
 * @param {string} outputDir 
 */
function RenderLayersAsOrderedFlatList(layer, outputDir) {
  return new Promise((resolve, reject) => {
    let filepaths = [];
    let actions = [];

    // Add this layer to render list
    let thisFilepath = PATH.join(outputDir, GuidFilenameGenerator(GUID_LENGTH, 'png'));
    filepaths.push(thisFilepath);

    let thisArgs = GetArgs(layer).concat(thisFilepath);
    actions.push(LOCAL_COMMAND.Execute(layer.Command(), thisArgs));

    // Create flat list of layers
    let flatList = GetOrderedFlatListOfLayers(layer);

    // Add all other layers to render list
    for (let i = 0; i < flatList.length; ++i) {
      let currLayer = flatList[i];
      let filepath = PATH.join(outputDir, GuidFilenameGenerator(GUID_LENGTH, 'png'));
      filepaths.push(filepath);

      let args = GetArgs(currLayer).concat(filepath);
      let cmd = currLayer.Command();
      actions.push(LOCAL_COMMAND.Execute(cmd, args));
    }

    // Render all layers
    Promise.all(actions).then(results => {
      resolve(filepaths);
    }).catch(error => reject(error));
  });
}


// Render layers in sequence (no special rules)
function RenderMethod1(layer, outputPath) {

}


// All layers rendered individually and then composited.
function RenderMethod2(layer, outputPath) {

}


// Method #2 + apply effects directly to layer.
function RenderMethod3(layer, outputPath) {

}



//--------------------------------------
// EXPORTS

exports.Layer = Layer;