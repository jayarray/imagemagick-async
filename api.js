let ANIMATION = require('./animation.js');
let CANVAS = require('./canvas.js');
let COLOR = require('./color.js');
let COMPARE = require('./compare.js');
let COMPOSE = require('./compose.js');
let COORDINATES = require('./coordinates.js');
let CUT = require('./cut.js');
let DIRECTION_FIELD = require('./directionfield.js');
let FX = require('./fx.js');
let GRADIENT = require('./gradient.js');
let IDENTIFY = require('./identify.js');
let LINE_SEGMENTS = require('./linesegments.js');
let MASK = require('./mask.js');
let SHAPES = require('./shapes.js');
let TRANSFORM = require('./transform.js');
let PRIMITIVES = require('./primitives.js');
let LIST = require('./list.js');

//-------------------------------
// EXPORTS

exports.ColorCanvas = CANVAS.CreateColorCanvas;
exports.GradientCanvas = CANVAS.CreateGradientCanvas;
exports.ImageCanvas = CANVAS.CreateImageCanvas;
exports.LabelCanvas = CANVAS.CreateLabelCanvas;

exports.Bezier = PRIMITIVES.CreateBezier;
exports.Circle = PRIMITIVES.CreateCircle;
exports.Ellipse = PRIMITIVES.CreateEllipse;
exports.Line = PRIMITIVES.CreateLine;
exports.Path = PRIMITIVES.CreatePath;
exports.PathComposite = PRIMITIVES.CreatePathComposite;
exports.Point = PRIMITIVES.CreatePoint;
exports.Text = PRIMITIVES.CreateText;

exports.EllipticalArcSegment = LINE_SEGMENTS.CreateEllipticalArcSegment;
exports.LineSegment = LINE_SEGMENTS.CreateLineSegment;
exports.CubicBezierSegment = LINE_SEGMENTS.CreateCubicBezierSegment;
exports.SmoothSegment = LINE_SEGMENTS.CreateSmoothSegment;
exports.QuadraticBezier = LINE_SEGMENTS.CreateQuadraticBezierSegment;

exports.Polygon = SHAPES.CreatePolygon;
exports.Star = SHAPES.CreateStar;
exports.Annulus = SHAPES.CreateAnnulus;

exports.Compare = COMPARE.CreateCompareMod;
exports.Difference = COMPARE.CreateDifferenceMod;

exports.Negate = COLOR.CreateNegateMod;
exports.Colorize = COLOR.CreateColorizeMod;
exports.GrayscaleFormat = COLOR.CreateGrayscaleFormatMod;
exports.RgbFormat = COLOR.CreateRgbFormatMod;
exports.Replace = COLOR.CreateReplaceMod;
exports.Transparency = COLOR.CreateTransparencyMod;
exports.ChannelAdjust = COLOR.CreateChannelAdjustMod;
exports.AutoLevel = COLOR.CreateAutoLevelMod;
exports.Brightness = COLOR.CreateBrightnessMod;
exports.Saturation = COLOR.CreateSaturationMod;
exports.Hue = COLOR.CreateHueMod;
exports.Channels = COLOR.Channels;
exports.ColorFromRgbaInts = COLOR.Color.CreateUsingRGBIntgers;
exports.ColorFromRgbaHexString = COLOR.Color.CreateUsingRGBHexString;
exports.ColorFromRgbaPercents = COLOR.Color.CreateUsingPercents;

exports.Composite = COMPOSE.CreateCompositeMod;
exports.MultiplyWhiteTransparency = COMPOSE.CreateMultiplyWhiteTransparencyMod;
exports.MultiplyBlackTransparency = COMPOSE.CreateMultiplyBlackTransparencyMod;
exports.Add = COMPOSE.CreateAddMod;
exports.Subtract = COMPOSE.CreateSubtractMod;
exports.Union = COMPOSE.CreateUnionMod;
exports.Intersection = COMPOSE.CreateIntersectionMod;
exports.Difference = COMPOSE.CreateDifferenceMod;
exports.Exclusion = COMPOSE.CreateExclusionMod;
exports.ChangedPixels = COMPOSE.CreateChangedPixelsMod;
exports.UnchangedPixels = COMPOSE.CreateUnchangedPixelsMod;

exports.CutIn = CUT.CreateCutInMod;
exports.CutOut = CUT.CreateCutOutMod;

exports.Swirl = FX.CreateSwirlFx;
exports.Implode = FX.CreateImplodeFx;
exports.Wave = FX.CreateWaveFx;
exports.Blur = FX.CreateBlurFx;
exports.CharcoalSketch = FX.CreateCharcoalSketchFx;
exports.ColoringBookSketch = FX.CreateColoringBookSketchFx;
exports.OilPainting = FX.CreateOilPaintingFx;
exports.PencilSketch = FX.CreatePencilSketchFx;
exports.Pixelate = FX.CreatePixelateFx;

exports.Roll = TRANSFORM.CreateRollMod;
exports.MirrorHorizontal = TRANSFORM.CreateMirrorHorizontalMod;
exports.MirrorVertical = TRANSFORM.CreateMirrorVerticalMod;
exports.Transpose = TRANSFORM.CreateTransposeMod;
exports.Transverse = TRANSFORM.CreateTransverseMod;
exports.Offset = TRANSFORM.CreateOffsetMod;
exports.RotateAroundCenter = TRANSFORM.CreateRotateAroundCenterMod;
exports.RotateAroundPoint = TRANSFORM.CreateRotateAroundPointMod;
exports.ResizeIgnoreAspectRatio = TRANSFORM.CreateResizeIgnoreAspectRatioMod;
exports.ResizeOnlyShrinkLarger = TRANSFORM.CreateResizeOnlyShrinkLargerMod;
exports.ResizeOnlyEnlargeSmaller = TRANSFORM.CreateResizeOnlyEnlargeSmallerMod;
exports.ResizeFillGivenArea = TRANSFORM.CreateResizeFillGivenAreaMod;
exports.ResizePercentage = TRANSFORM.CreateResizePercentageMod;
exports.ResizePixelCountLimit = TRANSFORM.CreateResizePixelCountLimitMod;
exports.Crop = TRANSFORM.CreateCropMod;
exports.RotateImage = TRANSFORM.CreateRotateImageMod;
exports.Trim = TRANSFORM.CreateTrimMod;

exports.Mask = MASK.CreateMaskMod;
exports.WhiteMask = MASK.CreateWhiteMaskMod;
exports.BlackMask = MASK.CreateBlackMaskMod;
exports.ColorMask = MASK.CreateColorMaskMod;
exports.FillMask = MASK.CreateFillMaskMod;

exports.CreateGif = ANIMATION.CreateGif;

exports.ImageInfo = IDENTIFY.ImageInfo;

exports.Fonts = LIST.Fonts;

exports.DirectionField = DIRECTION_FIELD.CreateDirectionField;

exports.Coordinates = COORDINATES.Create;

exports.LinearGradient = GRADIENT.CreateLinearGradient;
exports.RadialGradient = GRADIENT.CreateRadialGradient;
exports.Vector = GRADIENT.CreateVector;
exports.BoundingBox = GRADIENT.CreateBoundingBox;