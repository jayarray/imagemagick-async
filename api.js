let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;

//------------------------------------------
// Helper functions

function IsNode(moduleItem) {
  // Check if item has a build function
  try {
    let x = moduleItem.Builder.build();
    return false;
  }
  catch (err) {
    return true;
  }
}


/**
 * @param {object} rootNode
 * @param {string} moduleName
 */
function GetImModule(rootNode, moduleName) {
  let imModule = null;
  let nodeNames = Object.keys(rootNode);
  let needToBeChecked = nodeNames.map(name => rootNode[name]);

  while (needToBeChecked.length != 0) {
    let curr = needToBeChecked[i];

    if (IsNode(curr)) {
      let childrenNames = Object.keys(curr);

      if (childrenNames.length > 0) {
        let children = childrenNames.map(name => curr[name]);
        needToBeChecked.push(children);
      }
    }
    else {
      if (curr.name == moduleName) {
        imModule = curr;
        break;
      }
    }

    // Remove currently checked item
    needToBeChecked = needToBeChecked.slice(1);
  }

  return imModule;
}

//------------------------------------------
// Object Builder

class ObjectBuilder {
  constructor(api) {
    this.api = api;
    this.objectName = null;
    this.args = [];
    this.nodeNames = [];
  }

  /**
   * Declare the name of the object you wish to build.
   * @param {string} str 
   */
  name(str) {
    this.objectName = str;
    return this;
  }

  /**
   * Use this when specifying the path to a module inside the API object. Example: in('Drawables').in('Canvas') searches in api.Drawables.Canvas and any other child nodes in this path. If no node names are specified, the entire API structure will be searched.
   * @param {string} nodeName 
   */
  in(nodeName) {
    this.nodeNames.push(nodeName);
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
    let imModule = null;

    // Acquire specified im module
    if (this.nodeNames.length > 0) {
      let node = this.api;

      for (let i = 0; i < this.nodeNames.length; ++i) {
        let currNodeName = this.nodeNames[i];
        node = node[currNodeName];
      }

      if (IsNode(node))
        imModule = GetImModule(node, this.name);
    }
    else
      imModule = GetImModule(this.api, this.name);

    if (imModule) {
      // Build and return object
      let currBuilder = imModule.Builder;
      this.args.forEach(a => currBuilder = currBuilder[a.name](a.value));

      let o = currBuilder.build();
      return o;
    }

    return null;
  }
}

exports.ObjectBuilder = ObjectBuilder;

//------------------------------------------
// API

let api = {};


// Animation

api.Animation = {
  Gif: require(Path.join(Filepath.AnimationDir(), 'gif.js')).Gif
};


// Constants

api.Constants = {
  ColorChannels: require(Path.join(Filepath.ConstantsDir(), 'color_channels.json')).values,
  Dispose: require(Path.join(Filepath.ConstantsDir(), 'dispose.json')).values,
  Fonts: require(Path.join(Filepath.ConstantsDir(), 'fonts.json')).values,
  GradientDirection: require(Path.join(Filepath.ConstantsDir(), 'gradient_direction.json')).values,
  GradientExtent: require(Path.join(Filepath.ConstantsDir(), 'gradient_extent.json')).values,
  Gravity: require(Path.join(Filepath.ConstantsDir(), 'gravity.json')).values
};


// Drawables

api.Drawables = {
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
      Aura: require(Path.join(Filepath.FxDir(), 'aura.js')).Aura,
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
        ChangedPixels: require(Path.join(Filepath.ModComposeDir(), 'changedpixels.js')).ChangedPixels,
        Composite: require(Path.join(Filepath.ModComposeDir(), 'composite.js')).Composite,
        Difference: require(Path.join(Filepath.ModComposeDir(), 'difference.js')).Difference,
        Exclusion: require(Path.join(Filepath.ModComposeDir(), 'exclusion.js')).Exclusion,
        Intersection: require(Path.join(Filepath.ModComposeDir(), 'intersection.js')).Intersection,
        MultiplyBlackTransparency: require(Path.join(Filepath.ModComposeDir(), 'multiplyblacktransparency.js')).MultiplyBlackTransparency,
        MultiplyWhiteTransparency: require(Path.join(Filepath.ModComposeDir(), 'multiplywhitetransparency.js')).MultiplyWhiteTransparency,
        Subtract: require(Path.join(Filepath.ModComposeDir(), 'subtract.js')).Subtract,
        UnchangedPixels: require(Path.join(Filepath.ModComposeDir(), 'unchangedpixels.js')).UnchangedPixels
      },
      Cut: {
        CutIn: require(Path.join(Filepath.ModCutDir(), 'cutin.js')).CutIn,
        CutOut: require(Path.join(Filepath.ModCutDir(), 'cutout.js')).CutOut,
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
        RotateAroundPoint: require(Path.join(Filepath.TransformDisplaceDir(), 'rotatearoundcenter.js')).RotateAroundPoint
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
        ResizePercentage: require(Path.join(Filepath.TransformResizeDir(), 'resizepercentage.js')).ResizePercentage
      }
    }
  }
};


// Inputs

api.Inputs = {
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
  PointAndColor: require(Path.join(Filepath.InputsDir(), 'pointandcolor.js')).PointAndColor,
  Vector: require(Path.join(Filepath.InputsDir(), 'vector.js')).Vector
};

exports.Api = api;