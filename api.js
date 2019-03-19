let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;

//------------------------------------------
// Helper functions

/**
 * Check if an object is a module.
 * @param {object} moduleItem 
 * @returns {boolean} Returns true if it is a module that is part of the API structure. False otherwise.
 */
function IsModule(moduleItem) {
  // Check if item has a build function
  try {
    let x = moduleItem.Builder;
    return true;
  }
  catch (err) {
    return false;
  }
}

/**
 * Get info about modules as a dictionary. Keys are API paths, and values are objects with properties.
 * @param {string} rootName 
 * @param {object} rootNode  // Should be an object containing imports OR contain other objects. 
 * @returns {Array<{name: string, path: string, import: object, category: string, type: string, subtype: string, parameters: Array}>}
 */
function GetModulesDict(rootName, rootNode) {
  // Get all node info objects

  let rootInfo = {
    name: rootName,
    node: rootNode,
    parent: null,
    isModule: false
  };

  let needToBeChecked = [rootInfo];
  let nodeInfoArr = [];

  while (needToBeChecked.length != 0) {
    let currInfo = needToBeChecked[0];
    let childrenNames = Object.keys(currInfo.node);
    let childrenInfoArr = [];

    childrenNames.forEach(name => {
      let childInfo = {
        name: name,
        node: currInfo.node[name],
        parent: currInfo,
        isModule: false
      };

      if (IsModule(childInfo.node))
        childInfo.isModule = true;

      childrenInfoArr.push(childInfo);
    });

    // Update lists

    nodeInfoArr.push(currInfo); // Push already checked node
    needToBeChecked = needToBeChecked.concat(childrenInfoArr); // Append children infos
    needToBeChecked = needToBeChecked.slice(1); // Remove current info
  }

  // Add modules (only) to path dict
  let pathDict = {};
  let moduleInfoArr = nodeInfoArr.filter(x => x.isModule == true);

  moduleInfoArr.forEach(moduleInfo => {
    // Get module API path
    let pathParts = [moduleInfo.name];

    let getPath = function (info) {
      try {
        let parent = info.parent;

        if (!parent) {
          pathParts.push(info.name);
          return;
        }

        pathParts.push(parent.name);  // Push parent name to parts
        getPath(parent.parent);  // Recurse
      }
      catch (err) {
        return;
      }
    };

    // Get path parts, reverse them, delimit with '.'
    getPath(moduleInfo);
    pathParts = pathParts.reverse();
    let pathStr = pathParts.join('.');

    // Add to path dict

    let tempObj = moduleInfo.node;
    let parameters = tempObj.Parameters();
    let obj = tempObj.Builder.build()

    pathDict[pathStr] = {
      name: moduleInfo.name,
      import: moduleInfo.node,
      path: pathStr,
      category: obj.category,
      type: obj.type,
      subtype: obj.subtype,
      parameters: parameters
    };
  });

  return pathDict;
}

//----------------------------------------
// MODULE DICTS

/**
 * Get a dictionary containing the drawables and input modules.
 * @param {object} api 
 * @returns {object} Returns a dictionary.
 */
function GetModuleDictionary(api) {
  let completeDict = {};

  // Drawables dict
  let drawablesDict = GetModulesDict('Drawables', api.Drawables);
  let drawKeys = Object.keys(drawablesDict);
  drawKeys.forEach(key => completeDict[key] = drawablesDict[key]);

  // Inputs dict
  let inputsDict = GetModulesDict('Inputs', api.Inputs);
  let inputsKeys = Object.keys(inputsDict);
  inputsKeys.forEach(key => completeDict[key] = inputsDict[key]);

  return completeDict;
}


//------------------------------------------
// Object Builder

class ObjectBuilder {
  constructor(api) {
    this.api = api;
    this.args = [];
    this.path = null;
    this.moduleDict = GetModuleDictionary(api);
  }

  /**
   * Specify the API path for the object you want to build. The path should be period-delimited. EXAMPLE: "Drawables.Primitives.Bezier" . (You only need to pass in args after this function call).
   * @param {string} str 
   */
  apiPath(str) {
    this.path = str;
    return this;
  }

  /**
   * Pass in an argument to the object's builder.
   * @param {string} name Name of the argument.
   * @param {string} value Value of the argument.
   */
  passArg(name, value) {
    this.args.push({
      name: name,
      value
    });

    return this;
  }

  build() {
    let imModule = this.moduleDict[this.path];

    if (!imModule)
      return null;

    // Build and return object

    let currBuilder = imModule.Builder;

    this.args.forEach(a => {
      currBuilder = currBuilder[a.name](a.value);
    });

    let o = currBuilder.build();
    return o;
  }
}

exports.ObjectBuilder = ObjectBuilder;

//------------------------------------------
// API

let Api = {};


// Animation

Api.Animation = {
  Gif: require(Path.join(Filepath.AnimationDir(), 'gif.js')).Gif
};


// Constants

Api.Constants = {
  ColorChannels: require(Path.join(Filepath.ConstantsDir(), 'color_channels.json')).values,
  Dispose: require(Path.join(Filepath.ConstantsDir(), 'dispose.json')).values,
  Fonts: require(Path.join(Filepath.ConstantsDir(), 'fonts.json')).values,
  GradientDirection: require(Path.join(Filepath.ConstantsDir(), 'gradient_direction.json')).values,
  GradientExtent: require(Path.join(Filepath.ConstantsDir(), 'gradient_extent.json')).values,
  Gravity: require(Path.join(Filepath.ConstantsDir(), 'gravity.json')).values
};


// Drawables

Api.Drawables = {
  Canvases: {
    BarycentricCanvas: require(Path.join(Filepath.CanvasDir(), 'barycentriccanvas.js')).BarycentricCanvas,
    BilinearCanvas: require(Path.join(Filepath.CanvasDir(), 'bilinearcanvas.js')).BilinearCanvas,
    ColorCanvas: require(Path.join(Filepath.CanvasDir(), 'colorcanvas.js')).ColorCanvas,
    GradientCanvas: require(Path.join(Filepath.CanvasDir(), 'gradientcanvas.js')).GradientCanvas,
    ImageCanvas: require(Path.join(Filepath.CanvasDir(), 'imagecanvas.js')).ImageCanvas,
    LabelCanvas: require(Path.join(Filepath.CanvasDir(), 'labelcanvas.js')).LabelCanvas,
    NoiseCanvas: require(Path.join(Filepath.CanvasDir(), 'noisecanvas.js')).NoiseCanvas,
    PlasmaFractalCanvas: require(Path.join(Filepath.CanvasDir(), 'plasmafractalcanvas.js')).PlasmaFractalCanvas,
    PlasmaRangeCanvas: require(Path.join(Filepath.CanvasDir(), 'plasmarangecanvas.js')).PlasmaRangeCanvas,
    ShepardsCanvas: require(Path.join(Filepath.CanvasDir(), 'shepardscanvas.js')).ShepardsCanvas,
    ShepardsPowerCanvas: require(Path.join(Filepath.CanvasDir(), 'shepardspowercanvas.js')).ShepardsPowerCanvas,
    VoronoiCanvas: require(Path.join(Filepath.CanvasDir(), 'voronoicanvas.js')).VoronoiCanvas
  },
  Primitives: {
    Bezier: require(Path.join(Filepath.PrimitivesDir(), 'bezier.js')).Bezier,
    Circle: require(Path.join(Filepath.PrimitivesDir(), 'circle.js')).Circle,
    Ellipse: require(Path.join(Filepath.PrimitivesDir(), 'ellipse.js')).Ellipse,
    Image: require(Path.join(Filepath.PrimitivesDir(), 'image.js')).Image,
    Line: require(Path.join(Filepath.PrimitivesDir(), 'line.js')).Line,
    Path: require(Path.join(Filepath.PrimitivesDir(), 'path.js')).Path,
    PathComposite: require(Path.join(Filepath.PrimitivesDir(), 'pathcomposite.js')).PathComposite,
    Point: require(Path.join(Filepath.PrimitivesDir(), 'point.js')).Point,
    Text: require(Path.join(Filepath.PrimitivesDir(), 'text.js')).Text
  },
  Shapes: {
    Annulus: require(Path.join(Filepath.ShapesDir(), 'annulus.js')).Annulus,
    Polygon: require(Path.join(Filepath.ShapesDir(), 'polygon.js')).Polygon,
    Star: require(Path.join(Filepath.ShapesDir(), 'star.js')).Star
  },
  Effects: {
    Fx: {
      Aura: require(Path.join(Filepath.SpecialCommandDir(), 'aura.js')).Aura,
      Blur: require(Path.join(Filepath.FxDir(), 'blur.js')).Blur,
      CharcoalSketch: require(Path.join(Filepath.FxDir(), 'charcoalsketch.js')).CharcoalSketch,
      ColoringBookSketch: require(Path.join(Filepath.FxDir(), 'coloringbooksketch.js')).ColoringBookSketch,
      Edge: require(Path.join(Filepath.FxDir(), 'edge.js')).Edge,
      Implode: require(Path.join(Filepath.FxDir(), 'implode.js')).Implode,
      Impression: require(Path.join(Filepath.FxDir(), 'impression.js')).Impression,
      MotionBlur: require(Path.join(Filepath.FxDir(), 'motionblur.js')).MotionBlur,
      OilPainting: require(Path.join(Filepath.FxDir(), 'oilpainting.js')).OilPainting,
      PencilSketch: require(Path.join(Filepath.FxDir(), 'pencilsketch.js')).PencilSketch,
      Pixelate: require(Path.join(Filepath.FxDir(), 'pixelate.js')).Pixelate,
      RadialBlur: require(Path.join(Filepath.FxDir(), 'radialblur.js')).RadialBlur,
      ShadeAndHighlight: require(Path.join(Filepath.SpecialChainDir(), 'shadeandhighlight.js')).ShadeAndHighlight,
      Shadow: require(Path.join(Filepath.FxDir(), 'shadow.js')).Shadow,
      Swirl: require(Path.join(Filepath.FxDir(), 'swirl.js')).Swirl,
      Wave: require(Path.join(Filepath.FxDir(), 'wave.js')).Wave
    },
    Mod: {
      Color: {
        AutoLevel: require(Path.join(Filepath.ModColorDir(), 'autolevel.js')).AutoLevel,
        Brightness: require(Path.join(Filepath.ModColorDir(), 'brightness.js')).Brightness,
        ChannelAdjust: require(Path.join(Filepath.ModColorDir(), 'channeladjust.js')).ChannelAdjust,
        Colorize: require(Path.join(Filepath.ModColorDir(), 'colorize.js')).Colorize,
        GrayscaleFormat: require(Path.join(Filepath.ModColorDir(), 'grayscaleformat.js')).GrayscaleFormat,
        Hue: require(Path.join(Filepath.ModColorDir(), 'hue.js')).Hue,
        Negate: require(Path.join(Filepath.ModColorDir(), 'negate.js')).Negate,
        Replace: require(Path.join(Filepath.ModColorDir(), 'replace.js')).Replace,
        RgbFormat: require(Path.join(Filepath.ModColorDir(), 'rgbformat.js')).RgbFormat,
        Saturation: require(Path.join(Filepath.ModColorDir(), 'saturation.js')).Saturation,
        Sepia: require(Path.join(Filepath.ModColorDir(), 'sepia.js')).Sepia,
        Tint: require(Path.join(Filepath.ModColorDir(), 'tint.js')).Tint,
        Transparency: require(Path.join(Filepath.ModColorDir(), 'transparency.js')).Transparency
      },
      Compare: {
        Compare: require(Path.join(Filepath.ModCompareDir(), 'compare.js')).Compare,
        Difference: require(Path.join(Filepath.ModCompareDir(), 'difference.js')).Difference
      },
      Compose: {
        Add: require(Path.join(Filepath.ModComposeDir(), 'add.js')).Add,
        Append: require(Path.join(Filepath.ModComposeDir(), 'append.js')).Append,
        ChangedPixels: require(Path.join(Filepath.ModComposeDir(), 'changedpixels.js')).ChangedPixels,
        Composite: require(Path.join(Filepath.ModComposeDir(), 'composite.js')).Composite,
        Difference: require(Path.join(Filepath.ModComposeDir(), 'difference.js')).Difference,
        Exclusion: require(Path.join(Filepath.ModComposeDir(), 'exclusion.js')).Exclusion,
        Intersection: require(Path.join(Filepath.ModComposeDir(), 'intersection.js')).Intersection,
        MultiplyBlackTransparency: require(Path.join(Filepath.ModComposeDir(), 'multiplyblacktransparency.js')).MultiplyBlackTransparency,
        MultiplyWhiteTransparency: require(Path.join(Filepath.ModComposeDir(), 'multiplywhitetransparency.js')).MultiplyWhiteTransparency,
        Subtract: require(Path.join(Filepath.ModComposeDir(), 'subtract.js')).Subtract,
        UnchangedPixels: require(Path.join(Filepath.ModComposeDir(), 'unchangedpixels.js')).UnchangedPixels,
        Union: require(Path.join(Filepath.ModComposeDir(), 'union.js')).Union
      },
      Cut: {
        CutIn: require(Path.join(Filepath.ModCutDir(), 'cutin.js')).CutIn,
        CutOut: require(Path.join(Filepath.ModCutDir(), 'cutout.js')).CutOut
      },
      Masks: {
        BlackMask: require(Path.join(Filepath.ModMasksDir(), 'blackmask.js')).BlackMask,
        ColorMask: require(Path.join(Filepath.ModMasksDir(), 'colormask.js')).ColorMask,
        FillMask: require(Path.join(Filepath.ModMasksDir(), 'fillmask.js')).FillMask,
        Mask: require(Path.join(Filepath.ModMasksDir(), 'mask.js')).Mask,
        WhiteMask: require(Path.join(Filepath.ModMasksDir(), 'whitemask.js')).WhiteMask
      }
    },
    Transform: {
      Displace: {
        Offset: require(Path.join(Filepath.TransformDisplaceDir(), 'offset.js')).Offset,
        Roll: require(Path.join(Filepath.TransformDisplaceDir(), 'roll.js')).Roll,
        RotateAroundCenter: require(Path.join(Filepath.TransformDisplaceDir(), 'rotatearoundcenter.js')).RotateAroundCenter,
        RotateAroundPoint: require(Path.join(Filepath.TransformDisplaceDir(), 'rotatearoundpoint.js')).RotateAroundPoint,
        RotateImage: require(Path.join(Filepath.TransformDisplaceDir(), 'rotateimage.js')).RotateImage
      },
      Distort: {
        ArcDistortion: require(Path.join(Filepath.TransformDistortDir(), 'arcdistortion.js')).ArcDistortion,
        BarrelDistortion: require(Path.join(Filepath.TransformDistortDir(), 'barreldistortion.js')).BarrelDistortion,
        FourPointDistortion: require(Path.join(Filepath.TransformDistortDir(), 'fourpointdistortion.js')).FourPointDistortion,
        PolarDistortion: require(Path.join(Filepath.TransformDistortDir(), 'polardistortion.js')).PolarDistortion,
        ThreePointDistortion: require(Path.join(Filepath.TransformDistortDir(), 'threepointdistortion.js')).ThreePointDistortion
      },
      Reflect: {
        Flip: require(Path.join(Filepath.TransformReflectDir(), 'flip.js')).Flip,
        Flop: require(Path.join(Filepath.TransformReflectDir(), 'flop.js')).Flop,
        Transpose: require(Path.join(Filepath.TransformReflectDir(), 'transpose.js')).Transpose,
        Transverse: require(Path.join(Filepath.TransformReflectDir(), 'transverse.js')).Transverse
      },
      Resize: {
        Crop: require(Path.join(Filepath.TransformResizeDir(), 'crop.js')).Crop,
        ResizeDimensions: require(Path.join(Filepath.TransformResizeDir(), 'resizedimensions.js')).ResizeDimensions,
        ResizeFillGivenArea: require(Path.join(Filepath.TransformResizeDir(), 'resizefillgivenarea.js')).ResizeFillGivenArea,
        ResizePercentage: require(Path.join(Filepath.TransformResizeDir(), 'resizepercentage.js')).ResizePercentage,
        Trim: require(Path.join(Filepath.TransformResizeDir(), 'trim.js')).Trim
      }
    }
  }
};


// Inputs

Api.Inputs = {
  Gradient: {
    BoundingBox: require(Path.join(Filepath.GradientDir(), 'boundingbox.js')).BoundingBox,
    LinearGradient: require(Path.join(Filepath.GradientDir(), 'lineargradient.js')).LinearGradient,
    RadialGradient: require(Path.join(Filepath.GradientDir(), 'radialgradient.js')).RadialGradient
  },
  LineSegments: {
    CubicBezier: require(Path.join(Filepath.LineSegmentsDir(), 'cubicbezier.js')).CubicBezier,
    EllipticalArc: require(Path.join(Filepath.LineSegmentsDir(), 'ellipticalarc.js')).EllipticalArc,
    Line: require(Path.join(Filepath.LineSegmentsDir(), 'line.js')).Line,
    QuadraticBezier: require(Path.join(Filepath.LineSegmentsDir(), 'quadraticbezier.js')).QuadraticBezier,
    Smooth: require(Path.join(Filepath.LineSegmentsDir(), 'smooth.js')).Smooth
  },
  Color: require(Path.join(Filepath.InputsDir(), 'color.js')).Color,
  Coordinates: require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates,
  Offset: require(Path.join(Filepath.InputsDir(), 'offset.js')).Offset,
  PointAndColor: require(Path.join(Filepath.InputsDir(), 'pointandcolor.js')).PointAndColor,
  Vector: require(Path.join(Filepath.InputsDir(), 'vector.js')).Vector
};


// Query

Api.Query = {
  Info: {
    GetFileInfo: require(Path.join(Filepath.QueryInfoDir(), 'identify.js')).GetInfo
  },
  List: {
    ColorChannels: require(Path.join(Filepath.QueryListDir(), 'colorchannels.js')).ColorChannels,
    Fonts: require(Path.join(Filepath.QueryListDir(), 'fonts.js')).Fonts,
    Gravity: require(Path.join(Filepath.QueryListDir(), 'gravity.js')).Gravity
  }
}


// Layer

Api.Layer = {
  Layer: require(Path.join(Filepath.LayerDir(), 'layer.js')).Layer
}


// Render

Api.Render = {
  Renderer: require(Path.join(Filepath.RenderDir(), 'renderer.js')).Renderer
}

// Special

Api.Special = {
  Chain: {
    RenderItem: require(Path.join(Filepath.SpecialChainDir(), 'item.js')).RenderItem,
    CommandStringItem: require(Path.join(Filepath.SpecialChainDir(), 'item.js')).CommandStringItem,
    Chain: require(Path.join(Filepath.SpecialChainDir(), 'chain.js')).RenderItem
  }
}

exports.Api = Api;

exports.ModuleDictionary = GetModuleDictionary(Api);

