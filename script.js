let CONSTANTS = require('./constants.js');
let API = require('./api.js');
let LINUX_COMMANDS = require('linux-commands-async');
let GRADIENT = require('./gradient.js');
let COORDINATES = require('./coordinates.js');

//----------------------------
// CONSTANTS

const KEYWORDS = [
  'apply',
  'draw',
  'layer',
  'to',
  'render'
];

const PARAMETER_NAMES = [
  'name',
  'src',
  'src1',
  'src2',
  'type', // Used in Layer declaration
  'degrees',
  'factor',
  'amplitude',
  'frequency',
  'radius',
  'sigma',
  'angle',
  'hastransparency',
  'paintvalue',
  'charcoalvalue',
  'isheavilyshaded',
  'fuzz',
  'channel',
  'fillcolor',
  'highlightcolor',
  'lowlightcolor',
  'gravity',
  'filepaths',
  'width',
  'height',
  'x',
  'y',
  'center',
  'start',
  'end',
  'desiredcolor',
  'targetcolor',
  'pixels',
  'horizontal',
  'vertical',
  'offset',
  'vector',
  'center'
];

//-----------------------------
// BUILDER

function BuildCanvasObj(name, argDict) {
  let obj = null;

  if (name == 'ColorCanvas')
    obj = API.ColorCanvas(argDict.width, argDict.height, argDict.color);
  else if (name == 'ImageCanvas')
    obj = API.ImageCanvas(argDict.width, argDict.height, argDict.src);
  else if (name == 'LinearGradient') {
    let vector = null;
    if (argDict.vector) {
      let vectorParts = argDict.vector.split(';');
      let start = null;
      let end = null;

      for (let i = 0; i < vectorParts.length; ++i) {
        let currParts = vectorParts[i].split('=');
        let left = currParts[0];

        let rightParts = currParts[1].split(',');
        let x = rightParts[0];
        let y = rightParts[1];

        if (left == 'start')
          start = COORDINATES.Create(x, y);
        else if (left == 'end')
          end = COORDINATES.Create(x, y);
      }
      vector = GRADIENT.CreateVector(start, end);
    }

    let boundingBox = null;
    if (argDict.boundingBox) {
      let boundingBoxParts = argDict.boundingBox.split(';');
      let center = null;
      let width = null;
      let height = null;

      for (let i = 0; i < boundingBoxParts.length; ++i) {
        let currParts = boundingBoxParts[i].split('=');
        let left = currParts[0];

        let rightParts = currParts[1].split(',');
        if (left == 'center') {
          let rightParts = currParts[1].split(',');
          let x = rightParts[0];
          let y = rightParts[1];
          center = COORDINATES.Create(x, y);
        }
        else if (left == 'width')
          width = parseInt(currParts[1]);
        else if (left == 'height')
          height = parseInt(currParts[1]);
      }
      boundingBox = GRADIENT.CreateBoundingBox(center, width, height);
    }

    obj = GRADIENT.CreateLinearGradient(argDict.startColor, argDict.endColor, vector, argDict.angle, boundingBox, argDict.direction, argDict.extent);
  }
  else if (name == 'RadialGradient') {
    let boundingBox = null;
    if (argDict.boundingBox) {
      let boundingBoxParts = argDict.boundingBox.split(';');
      let center = null;
      let width = null;
      let height = null;

      for (let i = 0; i < boundingBoxParts.length; ++i) {
        let currParts = boundingBoxParts[i].split('=');
        let left = currParts[0];

        let rightParts = currParts[1].split(',');
        if (left == 'center') {
          let rightParts = currParts[1].split(',');
          let x = rightParts[0];
          let y = rightParts[1];
          center = COORDINATES.Create(x, y);
        }
        else if (left == 'width')
          width = parseInt(currParts[1]);
        else if (left == 'height')
          height = parseInt(currParts[1]);
      }
      boundingBox = GRADIENT.CreateBoundingBox(center, width, height);
    }

    let center = null;
    if (argDict.center) {
      let centerParts = argDict.center.split(',');
      let x = centerParts[0];
      let y = centerParts[1];
      center = COORDINATES.Create(x, y);
    }

    obj = GRADIENT.CreateRadialGradient(argDict.startColor, argDict.endColor, center, argDict.radialWidth, argDict.radialHeight, argDict.angle, boundingBox, argDict.extent);
  }

  return obj;
}

/**
 * Build an Fx layer.
 * @param {string} name 
 * @param {Object} argDict 
 */
function BuildFxObj(name, argDict) {
  let obj = null;

  if (name == 'Swirl') {
    obj = API.Swirl(argDict.src, argDict.degrees);
  }
  else if (name == 'Implode') {
    obj = API.Implode(argDict.src, argDict.factor);
  }
  else if (name == 'Wave') {
    obj = API.Wave(argDict.src, argDict.amplitude, argDict.frequency);
  }
  else if (name == 'Blur') {
    obj = API.Blur(argDict.src, argDict.radius, argDict.sigma, argDict.hasTransparency);
  }
  else if (name == 'OilPainting') {
    obj = API.OilPainting(argDict.src, argDict.paintValue);
  }
  else if (name == 'CharcoalSketch') {
    obj = API.CharcoalSketch(argDict.src, argDict.charcoalValue);
  }
  else if (name == 'ColoringBookSketch') {
    obj = API.ColoringBookSketch(argDict.src, argDict.isHeavilyShaded);
  }
  else if (name == 'PencilSketch') {
    obj = API.PencilSketch(argDict.src, argDict.radius, argDict.sigma, argDict.angle);
  }

  return obj;
}


/**
 * Build a Mod layer.
 * @param {string} name 
 * @param {Object} argDict 
 */
function BuildModObj(name, argDict) {
  let obj = null;

  if (name == 'Add') {
    obj = API.Add(argDict.src1, argDict.src2);
  }
  else if (name == 'AutoLevel') {
    obj = API.AutoLevel(argDict.src);
  }
  else if (name == 'ChangedPixels') {
    obj = API.ChangedPixels(argDict.src1, argDict.src2, argDict.fuzz);
  }
  else if (name == 'ChannelAdjust') {
    obj = API.ChannelAdjust(argDict.src, argDict.channel, argDict.value);
  }
  else if (name == 'Colorize') {
    obj = API.Colorize(argDict.src, argDict.fillColor, argDict.percent);
  }
  else if (name == 'Compare') {
    obj = API.Compare(argDict.src1, argDict.src2, argDict.highlightColor, argDict.lowlightColor);
  }
  else if (name == 'Composite') {
    obj = API.Composite(argDict.filepaths, argDict.gravity);
  }
  else if (name == 'Crop') {
    obj = API.Crop(argDict.src, argDict.width, argDict.height, argDict.x, argDict.y, argDict.removeVirtualCanvas);
  }
  else if (name == 'CutOut') {
    obj = API.CutOut(argDict.baseImagePath, argDict.cutoutImagePath);
  }
  else if (name == 'CutIn') {
    obj = API.CutIn(argDict.baseImagePath, argDict.cutoutImagePath);
  }
  else if (name == 'Difference') {
    obj = API.Difference(argDict.src1, argDict.src2);
  }
  else if (name == 'Exclusion') {
    obj = API.Exclusion(argDict.src1, argDict.src2);
  }
  else if (name == 'GrayscaleFormat') {
    obj = API.GrayscaleFormat(argDict.src);
  }
  else if (name == 'Intersection') {
    obj = API.Intersection(argDict.src1, argDict.src2);
  }
  else if (name == 'MirrorHorizontal') {
    obj = API.MirrorHorizontal(argDict.src);
  }
  else if (name == 'MirrorVertical') {
    obj = API.MirrorVertical(argDict.src);
  }
  else if (name == 'MultiplyBlackTransparency') {
    obj = API.MultiplyBlackTransparency(argDict.src1, argDict.src2);
  }
  else if (name == 'MultiplyWhiteTransparency') {
    obj = API.MultiplyWhiteTransparency(argDict.src1, argDict.src2);
  }
  else if (name == 'Negate') {
    obj = API.Negate(argDict.src);
  }
  else if (name == 'Offset') {
    obj = API.Offset(argDict.src, argDict.x0, argDict.y0, argDict.x1, argDict.y1);
  }
  else if (name == 'Replace') {
    obj = API.Replace(argDict.src, argDict.targetColor, argDict.desiredColor, argDict.fuzz);
  }
  else if (name == 'ResizeFillGivenArea') {
    obj = API.ResizeFillGivenArea(argDict.src, argDict.width, argDict.height);
  }
  else if (name == 'ResizeIgnoreAspectRatio') {
    obj = API.ResizeIgnoreAspectRatio(argDict.src, argDict.width, argDict.height);
  }
  else if (name == 'ResizeOnlyEnlargeSmaller') {
    obj = API.ResizeOnlyEnlargeSmaller(argDict.src, argDict.width, argDict.height);
  }
  else if (name == 'ResizeOnlyShrinkLarger') {
    obj = API.ResizeOnlyShrinkLarger(argDict.src, argDict.width, argDict.height);
  }
  else if (name == 'ResizePercentage') {
    obj = API.ResizePercentage(argDict.src, argDict.percent);
  }
  else if (name == 'ResizePixelCountLimit') {
    obj = API.ResizePixelCountLimit(argDict.src, argDict.pixels);
  }
  else if (name == 'RgbFormat') {
    obj = API.RgbFormat(argDict.src);
  }
  else if (name == 'Roll') {
    obj = API.Roll(argDict.src, argDict.horizontal, argDict.vertical);
  }
  else if (name == 'RotateAroundCenter') {
    obj = API.RotateAroundCenter(argDict.src, argDict.degrees);
  }
  else if (name == 'RotateAroundPoint') {
    obj = API.RotateAroundPoint(argDict.src, argDict.x, argDict.y, argDict.degrees);
  }
  else if (name == 'RotateImage') {
    obj = API.RotateImage(argDict.src, argDict.degrees);
  }
  else if (name == 'Subtract') {
    obj = API.Subtract(argDict.src1, argDict.src2);
  }
  else if (name == 'Transparency') {
    obj = API.Transparency(argDict.src, argDict.percent);
  }
  else if (name == 'Transpose') {
    obj = API.Transpose(argDict.src);
  }
  else if (name == 'Transverse') {
    obj = API.Transverse(argDict.src);
  }
  else if (name == 'UnchangedPixels') {
    obj = API.UnchangedPixels(argDict.src1, argDict.src2, argDict.fuzz);
  }
  else if (name == 'Union') {
    obj = API.Union(argDict.src1, argDict.src2);
  }

  return obj;
}

/**
 * Build an object associated with the provided name and parameters.
 * @param {string} name Name of Fx or Mod
 * @param {Object} argDict 
 */
function Build(name, argDict) {
  if (CONSTANTS.FX_NAMES.includes(name))
    return BuildFxObj(name, argDict);
  else if (CONSTANTS.MOD_NAMES.includes(name))
    return BuildModObj(name, argDict);
  else if (CONSTANTS.CANVAS_NAMES.includes(name))
    return BuildCanvasObj(name, argDict);
  return null;
}

//------------------------------
// PARSER

function ContainsWhiteSpace(str) {
  for (let i = 0; i < str.length; ++i) {
    if (str.charAt(i).trim() == '')
      return true;
  }
  return false;
}

function IsWhiteSpace(str) {
  return str.trim() == '';
}

/**
 * Validate a single line of text.
 * @param {*} str 
 */
function Validate(str) {
  let parts = str.split(' ').filter(l => l && l.trim() != '' && l != '').map(l => l.trim());
  let firstPart = parts[0].trim();
  let otherParts = parts.slice(1);

  if (firstPart.toLowerCase() == 'layer') {
    let typeParts = otherParts[0].split(':');
    let typeLabel = typeParts[0];
    let typeValue = typeParts[1];

    // Check type
    if (typeLabel.toLowerCase() != 'type')
      return { isValid: false, error: 'TYPE must be declared immediately after LAYER keyword' };

    if (IsWhiteSpace(typeValue))
      return { isValid: false, error: 'TYPE cannot be whitespace' };

    if (ContainsWhiteSpace(typeValue))
      return { isValid: false, error: 'TYPE cannot contain whitespace' };


    // Check parameters
    let theseParts = otherParts.slice(1);
    if (theseParts.length == 0)
      return { isValid: false, error: 'missing parameters for this layer' };

    let nameParameterIsDeclared = false;
    let argDict = {};

    for (let i = 0; i < theseParts.length; ++i) {
      let currPart = theseParts[i];
      let currPartParts = currPart.split(':');
      let thisParameterName = currPartParts[0];
      let thisParameterValue = currPartParts[1];

      if (!PARAMETER_NAMES.includes(thisParameterName.toLowerCase()))
        return { isValid: false, error: `invalid paramater found: ${thisParameterName}` };

      if (thisParameterName.toLowerCase() == 'name')
        nameParameterIsDeclared = true;

      argDict[thisParameterName] = thisParameterValue;
    }

    if (!nameParameterIsDeclared)
      return { isValid: false, error: 'NAME was not declared' };
    else if (nameParameterIsDeclared && otherParts.length == 1)
      return { isValid: false, error: 'missing parameters for this layer' };
    else {
      let layer = Build(typeValue, argDict);

      if (argDict['offset']) {
        let offsetParts = argDict['offset'].split(',');
        let xOffset = parseInt(offsetParts[0]);
        let yOffset = parseInt(offsetParts[1]);
        layer.SetOffset(xOffset, yOffset);
      }
      return { isValid: true, layer: layer, name: argDict.name, error: null };
    }

  }
  else if (firstPart.toLowerCase() == 'apply' && otherParts[0].toLowerCase() == 'to') {
    let layerName = otherParts[1];

    // Check for layer name
    if (IsWhiteSpace(layerName))
      return { isValid: false, error: 'layer name cannot be whitespace' };

    if (ContainsWhiteSpace(layerName))
      return { isValid: false, error: 'layer name cannot contain whitespace' };


    // Check for FX|MOD name
    let fxModParts = otherParts[2].split(':');
    let fxModLabel = fxModParts[0];
    let fxModValue = fxModParts[1];

    if (fxModLabel.toLowerCase() != 'name')
      return { isValid: false, error: `applied effect NAME must be declared immediately after layer name has been specified` };

    if (IsWhiteSpace(fxModValue))
      return { isValid: false, error: `applied effect NAME cannot be whitespace` };

    if (ContainsWhiteSpace(fxModValue))
      return { isValid: false, error: `applied effect NAME cannot contain whitespace` };


    // Check parameters
    let theseParts = otherParts.slice(3);

    if (theseParts.length == 0)
      return { isValid: false, error: 'missing parameters for applied effect' };

    let argDict = {};

    for (let i = 1; i < theseParts.length; ++i) {
      let currPart = theseParts[i];
      let currPartParts = currPart.split(':');
      let thisParameterName = currPartParts[0];
      let thisParameterValue = currPartParts[1];

      if (!PARAMETER_NAMES.includes(thisParameterName.toLowerCase()))
        return { isValid: false, error: `invalid paramater found: ${thisParameterName}` };

      argDict[thisParameterName] = thisParameterValue;
    }

    let fxOrMod = Build(fxModValue, argDict);
    return { isValid: true, layer: fxOrMod, to: layerName, error: null };
  }
  else if (firstPart.toLowerCase() == 'draw' && otherParts[0].toLowerCase() == 'to') {
    // Check TO-layer
    let toName = otherParts[1];
    if (IsWhiteSpace(toName))
      return { isValid: false, error: 'layer name cannot be whitespace' };
    if (ContainsWhiteSpace(toName))
      return { isValid: false, error: 'layer names cannot contain whitespace' };

    // Check FROM-layer(s)
    let fromNames = [];

    let theseParts = otherParts.slice(2);
    if (theseParts.length == 0)
      return { isValid: false, error: 'missing layer names' };

    for (let i = 0; i < theseParts.length; ++i) {
      let currName = theseParts[i];
      if (IsWhiteSpace(currName))
        return { isValid: false, error: 'layer name cannot be whitespace' };
      if (ContainsWhiteSpace(currName))
        return { isValid: false, error: 'layer name cannot contain whitespace' };

      fromNames.push(currName);
    }

    return { isValid: true, to: toName, fromNames: fromNames, error: null };
  }
  else if (firstPart.toLowerCase() == 'render') {
    if (otherParts != 2)
      return { isValid: false, error: 'exactly 2 arguments are required: <layerName> <outputPath>' };

    // Check layer name
    let layerName = otherParts[0];
    if (IsWhiteSpace(layerName))
      return { isValid: false, error: 'layer name cannot be whitespace' };
    if (ContainsWhiteSpace(layerName))
      return { isValid: false, error: 'layer name cannot contain whitespace' };

    // Check output path
    let outputPath = otherParts[1];
    if (IsWhiteSpace(outputPath))
      return { isValid: false, error: 'output path cannot be whitespace' };
    if (ContainsWhiteSpace(outputPath))
      return { isValid: false, error: 'output path cannot contain whitespace' };

    return { isValid: true, layerName: layerName, outputPath: outputPath, error: null };

  }
  else
    return { isValid: false, error: 'must begin line with one of the following: LAYER, APPLY TO, DRAW TO' };
}

/**
 * Parse multi-line text.
 * @param {*} str 
 */
function CheckSyntax(str) {
  let layers = [];
  let layerdict = [];
  let renderActions = [];

  let lines = str.split('\n');

  for (let i = 0; i < lines.length; ++i) {
    let validation = Validate(lines[i]);

    if (validation.error)
      return { isValid: false, error: `Line ${i + 1}: ${validation.error}` };

    let firstWord = str.split(' ')[0];
    if (firstWord.toLowerCase() == 'layer') {
      let name = argDict.name;
      let layer = argDict.layer;
      if (!layerdict[name]) {
        layerdict[name] = layer;
        layers.push(layer);
      }
      else
        return { isValid: false, error: `Line ${i + 1}: layer name already exists: ${name}` };
    }
    else if (firstWord.toLowerCase() == 'apply') {
      let layerName = validation.to;
      if (!layerdict[layerName])
        return { isValid: false, error: `Line ${i + 1}: layer name does not exist: ${name}` };

      let thisLayer = layerdict[layerName];
      thisLayer.ApplyFxOrMod(validation.fxOrMod);
      layerdict[layerName] = thisLayer;
    }
    else if (firstWord.toLowerCase() == 'draw') {
      let layerName = validation.to;
      if (!layerdict[layerName])
        return { isValid: false, error: `Line ${i + 1}: layer name does not exist: ${name}` };

      let thisLayer = layerdict[layerName];

      let fromNames = validation.fromNames;
      for (let i = 0; i < fromNames.length; ++i) {
        let currFromName = fromNames[i];
        if (!layerdict[layerName])
          return { isValid: false, error: `Line ${i + 1}: layer name does not exist: ${name}` };

        let fromLayer = layerdict[currFromName];

        if (validation.argDict['offset']) {
          let offsetParts = validation.argDict['offset'].split(',');
          let xOffset = parseInt(offsetParts[0]);
          let yOffset = parseInt(offsetParts[1]);
          thisLayer.Draw(fromLayer, xOffset, yOffset);
        }
        else
          thisLayer.Draw(fromLayer);
      }
    }
    else if (firstWord.toLowerCase() == 'render') {
      let layerName = validation.layerName;
      if (!layerdict[layerName])
        return { isValid: false, error: `Line ${i + 1}: layer name does not exist: ${name}` };

      let layer = layerdict[layerName];
      let outputPath = validation.outputPath;
      renderActions.push(layer.Render(outputPath));
    }
  }
  return { isValid: true, layers: layers, layerdict: layerdict, renderActions: renderActions, error: null };
}


/**
 * Parse string of commands
 * @param {string} str 
 */
function Parse(str) {
  let check = CheckSyntax(str);

  if (check.isValid)
    return { layers: check.layers, layerdict: check.layerdict, renderActions: check.renderActions };
  return { layers: null, layerdict: null, error: check.error };
}

/**
 * Parse a script from file.
 * @param {string} filepath 
 * @returns {Promise<string>} Returns a Promise that returns a string if successful. Otherwise, it returns an error.
 */
function Load(filepath) {
  return new Promise((resolve, reject) => {
    LINUX_COMMANDS.File.Read(filepath).then(str => {
      let parsed = Parse(str);
      if (parsed.error) {
        reject(parsed.error);
        return;
      }

      resolve({
        layers: parsed.layers,
        layerdict: parsed.layerdict,
        renderActions: parsed.renderActions
      });
    }).catch(error => reject(error));
  });
}

function Execute(filepath) {
  return new Promise((resolve, reject) => {
    Load(filepath).then(obj => {
      Promise.all(obj.renderActions).then(success => {
        resolve();
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

//-------------------------------
// EXPORTS

exports.Parse = Parse;
exports.Load = Load;
exports.Execute = Execute;