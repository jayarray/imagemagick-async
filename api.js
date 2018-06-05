let ANIMATION = require('./animation.js');
let CANVAS = require('./canvas.js');
let COLOR = require('./color.js');
let COMPARE = require('./compare.js');
let COMPOSE = require('./compose.js');
let CUT = require('./cut.js');
let FX = require('./fx.js');
let IDENTIFY = require('./identify.js');
let TRANSFORM = require('./transform.js');
let PRIMITIVES = require('./primitives.js');

//------------------------------------------
// CANVAS

/**
 * Create a color canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {string} color Hex string
 * @returns {Layer} Returns a Layer object.
 */
function ColorCanvas(width, height, color) {
  return CANVAS.CreateColorCanvas(width, height, color);
}

/**
 * Create a gradient canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {Gradient} gradient 
 * @returns {Layer} Returns a Layer object.
 */
function GradientCanvas(width, height, gradient) {
  return CANVAS.CreateGradientCanvas(width, height, gradient);
}

/**
 * Create an image canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {string} src
 * @returns {Layer} Returns a Layer object.
 */
function ImageCanvas(width, height, src) {
  return CANVAS.CreateImageCanvas(width, height, src);
}

/**
 * Create a label canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {string} text 
 * @param {string} font 
 * @param {number} strokeWidth 
 * @param {string} strokeColor 
 * @param {string} fillColor 
 * @param {string} underColor 
 * @param {string} backgroundColor 
 * @param {string} gravity
 * @returns {Layer} Returns a Layer object.
 */
function LabelCanvas(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
  return CANVAS.CreateLabelCanvas(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity);
}

//--------------------------------------
// PRIMITIVES

/**
 * Create a bezier curve primitive.
 * @param {Array<Coordinates>} points 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 */
function Bezier(points, strokeColor, strokeWidth, fillColor) {
  return PRIMITIVES.CreateBezier(points, strokeColor, strokeWidth, fillColor);
}

/**
 * Create a circle primitive.
 * @param {Coordinates} center 
 * @param {Coordinates} edge 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 */
function Circle(center, edge, strokeColor, strokeWidth, fillColor) {
  return PRIMITIVES.CreateCircle(center, edge, strokeColor, strokeWidth, fillColor);
}

/**
 * Create an ellipse primitive.
 * @param {Coordinates} center 
 * @param {number} width 
 * @param {number} height 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 * @param {number} angleStart 
 * @param {number} angleEnd 
 */
function Ellipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
  return PRIMITIVES.CreateEllipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd);
}

/**
 * Create a line primitive.
 * @param {Coordinates} start 
 * @param {Coordinates} end 
 * @param {string} color Hex string
 * @param {number} width 
 * @returns {Layer} Returns a Layer object.
 */
function Line(start, end, color, width) {
  return PRIMITIVES.CreateLine(start, end, color, width);
}

/**
 * Create a path primitive.
 * @param {Array<Coordinates>} points 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 * @param {boolean} isClosed 
 */
function Path(points, strokeColor, strokeWidth, fillColor, isClosed) {
  return PRIMITIVES.CreatePath(points, strokeColor, strokeWidth, fillColor, isClosed);
}

/**
 * Create a point primitive.
 * @param {number} x 
 * @param {number} y 
 * @param {string} color 
 */
function Point(x, y, color) {
  return PRIMITIVES.CreatePoint(x, y, color);
}

/**
 * Create a text primitive.
 * @param {string} string 
 * @param {string} font 
 * @param {number} pointSize 
 * @param {string} gravity 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 */
function Text(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
  return PRIMITIVES.CreatePoint(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor);
}

//--------------------------------
// MODS

// COMPARISON

/**
 * Create a Compare mod.
 * @param {string} src1 
 * @param {string} src2 
 * @param {string} highlightColor 
 * @param {string} lowlightColor 
 */
function Compare(src1, src2, highlightColor, lowlightColor) {
  return COMPARE.CreateCompareMod(src1, src2, highlightColor, lowlightColor);
}

/**
 * Create a Difference mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Difference(src1, src2) {
  return COMPARE.CreateDifferenceMod(src1, src2, highlightColor, lowlightColor);
}

// COLOR

/**
 * Create a Negate mod.
 * @param {string} src 
 */
function Negate(src) {
  return COLOR.CreateNegateMod(src);
}

/**
 * Create a Colorize mod.
 * @param {string} src 
 * @param {string} fillColor 
 * @param {number} percent 
 */
function Colorize(src, fillColor, percent) {
  return COLOR.CreateColorizeMod(src, fillColor, percent);
}

/**
 * Create a GrayscaleFormat mod.
 * @param {string} src 
 */
function GrayscaleFormat(src) {
  return COLOR.CreateGrayscaleFormatMod(src);
}

/**
 * Create a RgbFormat mod.
 * @param {string} src 
 */
function RgbFormat(src) {
  return COLOR.CreateRgbFormatMod(src);
}

/**
 * Create a Replace mod.
 * @param {string} src 
 * @param {string} targetColor 
 * @param {string} desiredColor 
 * @param {number} fuzz 
 */
function Replace(src, targetColor, desiredColor, fuzz) {
  return COLOR.CreateReplaceMod(src, targetColor, desiredColor, fuzz);
}

/**
 * Create a Transparency mod.
 * @param {string} src 
 * @param {number} percent 
 */
function Transparency(src, percent) {
  return COLOR.CreateTransparencyMod(src, percent);
}

/**
 * Create a ChannelAdjust mod.
 * @param {string} src 
 * @param {string} channel 
 * @param {string|number} value 
 */
function ChannelAdjust(src, channel, value) {
  return COLOR.CreateChannelAdjustMod(src, channel, value);
}

/**
 * Create an AutoLevel mod.
 * @param {string} src 
 */
function AutoLevel(src) {
  return COLOR.CreateAutoLevelMod(src);
}

// COMPOSE

/**
 * Create a Composite mod.
 * @param {Array<string>} filepaths 
 * @param {string} gravity 
 */
function Composite(filepaths, gravity) {
  return COMPOSE.CreateCompositeMod(filepaths, gravity);
}

/**
 * Create a MultiplyWhiteTransparency mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function MultiplyWhiteTransparency(src1, src2) {
  return COMPOSE.CreateMultiplyWhiteTransparencyMod(src1, src2);
}

/**
 * Create a MultiplyBlackTransparency mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function MultiplyBlackTransparency(src1, src2) {
  return COMPOSE.CreateMultiplyBlackTransparencyMod(src1, src2);
}

/**
 * Create an Add mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Add(src1, src2) {
  return COMPOSE.CreateAddMod(src1, src2);
}

/**
 * Create a Subtract mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Subtract(src1, src2) {
  return COMPOSE.CreateSubtractMod(src1, src2);
}

/**
 * Create a Union mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Union(src1, src2) {
  return COMPOSE.CreateUnionMod(src1, src2);
}

/**
 * Create a Intersection mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Intersection(src1, src2) {
  return COMPOSE.CreateIntersectionMod(src1, src2);
}

/**
 * Create a Difference mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Difference(src1, src2) {
  return COMPOSE.CreateDifferenceMod(src1, src2);
}

/**
 * Create a Exclusion mod.
 * @param {string} src1 
 * @param {string} src2 
 */
function Exclusion(src1, src2) {
  return COMPOSE.CreateExclusionMod(src1, src2);
}

// CUT

/**
 * Create a CutIn mod.
 * @param {string} baseImagePath 
 * @param {string} cutoutImagePath 
 */
function CutIn(baseImagePath, cutoutImagePath) {
  return CUT.CreateCutInMod(baseImagePath, cutoutImagePath);
}

/**
 * Create a CutOut mod.
 * @param {string} baseImagePath 
 * @param {string} cutoutImagePath 
 */
function CutOut(baseImagePath, cutoutImagePath) {
  return CUT.CreateCutOutMod(baseImagePath, cutoutImagePath);
}

// FX

/**
 * Create Swirl fx.
 * @param {string} src 
 * @param {number} degrees 
 */
function Swirl(src, degrees) {
  return FX.CreateSwirlFx(src, degrees);
}

/**
 * Create Implode fx.
 * @param {string} src 
 * @param {number} factor 
 */
function Implode(src, factor) {
  return FX.CreateImplodeFx(src, factor);
}

/**
 * Create Wave fx.
 * @param {string} src 
 * @param {number} amplitude 
 * @param {number} frequency 
 */
function Wave(src, amplitude, frequency) {
  return FX.CreateWaveFx(src, amplitude, frequency);
}

/**
 * Create Blur fx.
 * @param {string} src 
 * @param {number} radius 
 * @param {number} sigma 
 * @param {boolean} hasTransparency 
 */
function Blur(src, radius, sigma, hasTransparency) {
  return FX.CreateBlurFx(src, radius, sigma, hasTransparency)
}

/**
 * Create Oil Painting fx.
 * @param {string} src 
 * @param {number} paintValue 
 */
function OilPainting(src, paintValue) {
  return FX.CreateOilPaintingFx(src, paintValue);
}

/**
 * Create Charcoal Sketch
 * @param {string} src 
 * @param {number} charcoalValue 
 */
function CharcoalSketch(src, charcoalValue) {
  return FX.CreateCharcoalSketchFx(src, charcoalValue);
}

/**
 * Create Coloring Book Sketch.
 * @param {string} src 
 * @param {boolean} isHeavilyShaded 
 */
function ColoringBookSketch(src, isHeavilyShaded) {
  return FX.CreateColoringBookSketchFx(src, isHeavilyShaded);
}

/**
 * Create Pencil Sketch fx.
 * @param {string} src 
 * @param {number} radius 
 * @param {number} sigma 
 * @param {number} angle 
 */
function PencilSketch(src, radius, sigma, angle) {
  return FX.CreatePencilSketchFx(src, radius, sigma, angle);
}

// TRANSFORMS

/**
 * Create a Roll mod.
 * @param {number} horizontal 
 * @param {number} vertical 
 */
function Roll(horizontal, vertical) {
  return TRANSFORM.CreateRollMod(horizontal, vertical);
}

/**
 * Create a Mirror Horizontal object.
 * @param {string} src 
 */
function MirrorHorizontal(src) {
  return TRANSFORM.CreateMirrorHorizontalMod(src);
}

/**
 * Create a Mirror Vertical object.
 * @param {string} src 
 */
function MirrorVertical(src) {
  return TRANSFORM.CreateMirrorVerticalMod(src);
}

/**
 * Create a Transpose object.
 * @param {string} src 
 */
function Transpose(src) {
  return TRANSFORM.CreateTransposeMod(src);
}

/**
 * Create a Transverse object.
 * @param {string} src 
 */
function Transverse(src) {
  return TRANSFORM.CreateTransverseMod(src);
}

/**
 * Create an Offset object.
 * @param {string} src 
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} x1 
 * @param {number} y1 
 */
function Offset(src, x0, y0, x1, y1) {
  return TRANSFORM.CreateOffsetMod(src, x0, y0, x1, y1);
}

/**
 * Create a Rotate Around Center object.
 * @param {string} src 
 * @param {number} degrees 
 */
function RotateAroundCenter(src, degrees) {
  return TRANSFORM.CreateRotateAroundCenterMod(src, degrees);
}

/**
 * Create a Rotate Around Point object.
 * @param {string} src 
 * @param {number} x 
 * @param {number} y 
 * @param {number} degrees 
 */
function RotateAroundPoint(src, x, y, degrees) {
  return TRANSFORM.CreateRotateAroundPointMod(src, x, y, degrees);
}

/**
 * Create a Resize Ignore Aspect Ratio object.
 * @param {string} src 
 * @param {number} width 
 * @param {number} height 
 */
function ResizeIgnoreAspectRatio(src, width, height) {
  return TRANSFORM.CreateResizeIgnoreAspectRatioMod(src, width, height);
}

/**
 * Create a Resize Only Shrink Larger object.
 * @param {string} src 
 * @param {number} width 
 * @param {number} height 
 */
function ResizeOnlyShrinkLarger(src, width, height) {
  return TRANSFORM.CreateResizeOnlyShrinkLargerMod(src, width, height);
}

/**
 * Create a Resize Only Enlarge Smaller object.
 * @param {string} src 
 * @param {number} width 
 * @param {number} height 
 */
function ResizeOnlyEnlargeSmaller(src, width, height) {
  return TRANSFORM.CreateResizeOnlyEnlargeSmallerMod(src, width, height);
}

/**
 * Create a Resize Fill Given Area object.
 * @param {string} src 
 * @param {number} width 
 * @param {number} height 
 */
function ResizeFillGivenArea(src, width, height) {
  return TRANSFORM.CreateResizeFillGivenAreaMod(src, width, height);
}

/**
 * Create Resize Percentage object.
 * @param {string} src 
 * @param {number} percent 
 */
function ResizePercentage(src, percent) {
  return TRANSFORM.CreateResizePercentageMod(src, percent);
}

/**
 * Create Resize Pixel Count Limit object.
 * @param {string} src 
 * @param {number} pixels 
 */
function ResizePixelCountLimit(src, pixels) {
  return TRANSFORM.CreateResizePixelCountLimitMod(src, pixels);
}

/**
 * Create Crop object.
 * @param {string} src 
 * @param {number} width 
 * @param {number} height 
 * @param {number} x 
 * @param {number} y 
 * @param {boolean} removeVirtualCanvas 
 */
function Crop(src, width, height, x, y, removeVirtualCanvas) {
  return TRANSFORM.CreateCropMod(src, width, height, x, y, removeVirtualCanvas);
}

/**
 * Rotate an image.
 * @param {string} src 
 * @param {number} degrees 
 * @param {string} outputPath 
 */
function RotateImage(src, degrees, outputPath) {
  return TRANSFORM.CreateRotateImageMod(src, degrees, outputPath);
}

//------------------------------
// ANIMATION

/**
 * Create a GIF from the provided filepath list (in ther order provided).
 * @param {Canvas} canvas Canvas object
 * @param {Array<string>} filepaths List of filepaths
 * @param {number} loop (Optional) The number of times the GIF animation is to cycle before stopping. The default value is 0 (infinite loop). Valid loop values are from 0 to infinity.
 * @param {number} delay The delay time measured in 1/100th of a seconds at a time.
 * @param {string} dispose (Optional) Determines what the following images should do with the previous results of the GIF animation. Default is 'Undefined'.
 * @param {string} outputPath The path where the GIF will be rendered.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function CreateGif(canvas, filepaths, loop, delay, dispose, outputPath) {
  return ANIMATION.CreateGif(canvas, filepaths, loop, delay, dispose, outputPath);
}

//-------------------------------
// IDENTIFY

/**
 * Get information about an image.
 * @param {string} src 
 */
function Identify(src) {
  return IDENTIFY.CreateImageInfo(src);
}

//-------------------------------
// EXPORTS

exports.ColorCanvas = ColorCanvas;
exports.GradientCanvas = GradientCanvas;
exports.ImageCanvas = ImageCanvas;
exports.LabelCanvas = LabelCanvas;

exports.Bezier = Bezier;
exports.Circle = Circle;
exports.Ellipse = Ellipse;
exports.Line = Line;
exports.Path = Path;
exports.Point = Point;
exports.Text = Text;

exports.Compare = Compare;
exports.Difference = Difference;

exports.Negate = Negate;
exports.Colorize = Colorize;
exports.GrayscaleFormat = GrayscaleFormat;
exports.RgbFormat = RgbFormat;
exports.Replace = Replace;
exports.Transparency = Transparency;
exports.ChannelAdjust = ChannelAdjust;
exports.AutoLevel = AutoLevel;

exports.Composite = Composite;
exports.MultiplyWhiteTransparency = MultiplyWhiteTransparency;
exports.MultiplyBlackTransparency = MultiplyBlackTransparency;
exports.Add = Add;
exports.Subtract = Subtract;
exports.Union = Union;
exports.Intersection = Intersection;
exports.Difference = Difference;

exports.CutIn = CutIn;
exports.CutOut = CutOut;

exports.Swirl = Swirl;
exports.Implode = Implode;
exports.Wave = Wave;
exports.Blur = Blur;
exports.CharcoalSketch = CharcoalSketch;
exports.ColoringBookSketch = ColoringBookSketch;
exports.OilPainting = OilPainting;
exports.PencilSketch = PencilSketch;

exports.Roll = Roll;
exports.MirrorHorizontal = MirrorHorizontal;
exports.MirrorVertical = MirrorVertical;
exports.Transpose = Transpose;
exports.Transverse = Transverse;
exports.Offset = Offset;
exports.RotateAroundCenter = RotateAroundCenter;
exports.RotateAroundPoint = RotateAroundPoint;
exports.ResizeIgnoreAspectRatio = ResizeIgnoreAspectRatio;
exports.ResizeOnlyShrinkLarger = ResizeOnlyShrinkLarger;
exports.ResizeOnlyEnlargeSmaller = ResizeOnlyEnlargeSmaller;
exports.ResizeFillGivenArea = ResizeFillGivenArea;
exports.ResizePercentage = ResizePercentage;
exports.ResizePixelCountLimit = ResizePixelCountLimit;
exports.Crop = Crop;
exports.RotateImage = RotateImage;

exports.CreateGif = CreateGif;

exports.Identify = Identify;