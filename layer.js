let CANVAS = require('./canvas.js');
let COLOR = require('./color.js');
let COMPARE = require('./compare.js');
let COMPOSE = require('./compose.js');
let CUT = require('./cut.js');
let FX = require('./fx.js');
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
function FromColor(width, height, color) {
  return CANVAS.CreateColorCanvas(width, height, color);
}

/**
 * Create a gradient canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {Gradient} gradient 
 * @returns {Layer} Returns a Layer object.
 */
function FromGradient(width, height, gradient) {
  return CANVAS.CreateGradientCanvas(width, height, gradient);
}

/**
 * Create an image canvas layer.
 * @param {string} path Image location
 * @returns {Layer} Returns a Layer object.
 */
function FromPath(path) {
  return CANVAS.CreateImageCanvas(path);
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
function FromLabel(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
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

//-------------------------------
// EXPORTS

exports.FromColor = FromColor;
exports.FromGradient = FromGradient;
exports.FromPath = FromPath;
exports.FromLabel = FromLabel;

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