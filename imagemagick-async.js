var os = require('os');
var path = require('path');
var childProcess = require('child_process');
var filesystem = require('./filesystem.js');

//-----------------------------------
// EXECUTE

function execute(cmd)
{
  // Create script
  let tempDest = 'imagemagick_cmd.sh';
  filesystem.writeTextToFile(tempDest, cmd);
  filesystem.chmod(tempDest, '0700');

  // Run script
  let output = childProcess.spawnSync('sh', [tempDest]);

  // Delete script
  filesystem.deleteFile(tempDest);

  // Return outputs
  errorStr = null;
  if (output.error)
  {
    errorStr = output.error.toString().trim();
  }

  stdoutStr = null;
  if (output.stdout)
  {
    stdoutStr = output.stdout.toString().trim();
  }

  stderrStr = null;
  if (output.stderr)
  {
    stderrStr = output.stderr.toString().trim();
  }

  statusStr = null;
  if (output.status)
  {
    statusStr = output.status.toString().trim();
  }
  return {'error': errorStr, 'stdout': stdoutStr, 'stderr': stderrStr, 'status': statusStr};  
}

//----------------------------------
// FONTS

class IMFont
{
  constructor(name, family, style, stretch, weight, glyphs)
  {
    this.name = name;
    this.family = family;
    this.style = style;
    this.stretch = stretch;
    this.weight = weight;
    this.glyphs = glyphs;
  }
}

function getFonts()
{
  let cmd = 'identify -list font';
  let output = execute(cmd);

  if (output.error)
  {
    return null;
  }

  if (output.stderr && output.stderr.toString().trim() == '')
  {
    return null;
  }

  // Parse output
  let fonts = [];
  
  let lines = output.stdout.split(os.EOL);
  lines.forEach(line => {
    let prefix = 'Font:';
    let l = line.trim();
    if (l.startsWith(prefix))
    {
      let name = l.split(prefix)[1].trim();
      fonts.push(name);
    }
  });

  return fonts.sort();
}


//----------------------------------
// BLUR

function blur(src, radius, sigma, hasTransparency, dest)
{
  let cmd = 'convert ' + src;
  
  if (hasTransparency)
  {
      cmd += ' -channel RGBA';
  }
  cmd += ' -blur ' + radius + 'x' + sigma + ' ' + dest;
  return execute(cmd);
}

//---------------------------------------
// COLOR MANIPULATION

function negate(src, dest)
{
  let cmd = 'convert ' + src + ' -negate ' + dest;
  return execute(cmd);
}

function colorize(src, fillColor, percent, dest)  // fillColor is in hex #RRGGBB
{
  let cmd = 'convert ' + src + ' -fill "' + fillColor + '" -colorize ' + percent + '% ' + dest;
  return execute(cmd);
}

function toGrayScale(src, dest)
{
  let cmd = 'convert ' + src + ' -colorspace Gray ' + dest;
  return execute(cmd);
}

function toRGB(src, dest)
{
  let cmd = 'convert ' + src;
  if (src.endsWith('.png'))
  {
    cmd += ' -define png:color-type=2 ' + dest;
  }
  else
  {
    cmd += ' -colorspace RGB ' + dest;
  }
  return execute(cmd);
}

function makeImageTransparent(src, percent, dest) // percent refers to opacity. (i.e. percent = 25 --> image will be 75% transparent)
{
  let opacity = 100 - percent;
  if (opacity < 0)
  {
    opacity = 100;
  }
  let cmd = 'convert ' + src + ' -alpha on -channel a -evaluate set ' + percent + '% ' + dest;
  return execute(cmd);
}

function replaceColor(src, targetColor, desiredColor, fuzz, dest)
{
  let cmd = 'convert ' + src + ' -alpha on -channel rgba';
  if (fuzz > 0)
  {
    cmd += ' -fuzz ' + fuzz + '%';
  }
  cmd += ' -fill "' + desiredColor + '" -opaque "' + targetColor + '" ' + dest;
  console.log('REPLACE_COLOR:: CMD: ' + cmd);
  return execute(cmd);
}

//---------------------------------------
// COMPARE

function compare(src1, src2, highlightColor, lowlightColor, dest)
{
  let cmd = 'compare -metric AE -fuzz 5% ' + src1 + ' ' + src2 + ' -highlight-color ' + highlightColor + ' -lowlight-color ' + lowlightColor + ' ' + dest;
  return execute(cmd);
}

function difference(src1, src2, dest)
{
  let cmd = 'composite ' + src1 + ' ' + src2 + ' -compose difference ' + dest;
  return execute(cmd);
}

function autoLevelDiffImage(src, dest)
{
  let cmd = 'convert ' + src + ' -auto-level ' + dest;
  return execute(cmd);
}

//--------------------------------------
// COMPOSE

function compose(filepaths, gravity, dest)
{
  let cmd = ' convert -gravity ' + gravity + ' ' + filepaths[0] + ' ' + filepaths[1];
  if (filepaths.length > 2)
  {
    for (let i = 2; i < filepaths.length; ++i)
    {
      cmd += ' -composite ' + filepaths[i];
    }
  }
  cmd += ' -composite ' + dest;
  return execute(cmd);
}

//----------------------------------------
// CROP

function crop(src, width, height, x0, y0, gravity, removeVirtualCanvas, dest)
{
  let cmd = 'convert ' + src;
  cmd += ' -gravity ' + gravity;
  cmd += ' -crop ' + width + 'x' + height;
  
  if (x0 >= 0)
  {
    cmd += '+' + x0;
  }
  else
  {
    cmd += '-' + x0;
  }
  
  if (y0 >= 0)
  {
    cmd += '+' + y0;
  }
  else
  {
    cmd += '-' + y0;
  }
  
  if (removeVirtualCanvas)
  {
    cmd += ' +repage';
  }
  
  cmd += ' ' + dest;
  return execute(cmd);
}

//---------------------------------
// CUT

function cut(baseImgPath, cutoutImgPath, isSlot, dest)
{
  if (isSlot)
  {
    return cutMaskOut(baseImgPath, cutoutImgPath, dest);
  }
  return cutNonMaskOut(baseImgPath, cutoutImgPath, dest);
}

function cutMaskOut(baseImgPath, cutoutImgPath, dest)
{
  let cmd = 'composite -compose Dst_Out ' + cutoutImgPath + ' ' + baseImgPath + ' -alpha Set ' + dest;
  let output = execute(cmd);
  output = toRGB(dest, dest);
  return output;
}

function cutNonMaskOut(baseImgPath, cutoutImgPath, dest)
{
  parentDir = path.dirname(dest);
  
  // Create mask
  maskFilepath = path.join(parentDir, 'mask.png');
  
  let cmd = 'convert ' + cutoutImgPath + ' -alpha extract -threshold 0 -transparent white ' + maskFilepath;
  let output = execute(cmd);
  
  // Subtract cutout from base img
  cmd  = 'convert ' + baseImgPath + ' ' + maskFilepath + ' -compose Dst_Out -composite -transparent black ' + dest;
  output = execute(cmd);
  
  // Make sure image is stored as RGB  (NOTE: Result tends to turn into greyscale or indexed.)
  output = toRGB(dest, dest);
  
  // Delete mask file
  //filesystem.deleteFile(maskFilepath);

  return output;
}

//---------------------------------
// DRAW PRIMITIVES

class Canvas
{
  constructor(width, height, color)
  {
    this.width = width;
    this.height = height;
    this.color = color;  // HEX  #RRGGBB
  }

  string()
  {
    let canvasColor = 'none';
    if (this.color || this.color != 'none')
    {
      canvasColor = '"' + this.color + '"';
    }
    return '-size ' + this.width + 'x' + this.height + ' canvas:' + canvasColor;
  }
}

class Coordinates
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

class Point
{
  constructor(coordinates, color, scaleWidth, scaleHeight)
  {
    this.coordinates = coordinates;
    this.color = color;
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
  }
}

class Line
{
  constructor(start, end, color, width)
  {
    this.start = start; // Coordinates
    this.end = end;     // Coordinates
    this.color = color;
    this.width = width;
  }
}

class Polygon
{
  constructor(points, strokeColor, strokeWidth, fillColor, isClosed)
  {
    this.points = points;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
    this.isClosed = isClosed;
  }

  pointsToString()
  {
    pointsStr = [];
    this.points.forEach(p => pointsStr.push(p.x + ',' + p.y));
    return pointsStr.join(' ');
  }
}

class Circle
{
  constructor(center, edge, fillColor, strokeColor, strokeWidth)
  {
    this.center = center;
    this.edge = edge;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
}

class Ellipse
{
  constructor(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd)
  {
    this.center = center; // Coordinates
    this.width = width;
    this.height = height;
    this.strokeColor =strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
    this.angleStart = angleStart; //Starts at 3 o'clock position (on screen) and goes clockwise
    this.angleEnd = angleEnd;
  }
}

class Bezier
{
  constructor(points, strokeColor, strokeWidth, fillColor)
  {
    this.points = points;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
  }

  pointsToString()
  {
    pointsStr = [];
    this.points.forEach(p => pointsStr.push(p.x + ',' + p.y));
    return pointsStr.join(' ');
  }
}

class Text
{
  constructor(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor)
  {
    this.string = string;
    this.font = font;
    this.pointSize = pointSize;
    this.gravity = gravity;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
  }
}

function pointsToString(points)
{
  pointsStr = [];
  points.forEach(p => pointsStr.push(p.x + ',' + p.y));
  return pointsStr.join(' ');
}

function drawCanvas(canvas, dest)
{
  let cdm = 'convert ' + canvas.string() + ' ' + dest;
  return execute(cmd);
}

function drawPoint(canvas, point, dest)
{
  let cmd = 'convert ' + canvas.string() + ' -fill "' + point.fillColor + '" -draw point ' + point.x + ',' + point.y;
  cmd += ' -scale ' + point.scaleWidth + 'x' + point.scaleHeight + ' ' + dest;
  return execute(cmd);
}

function drawLine(canvas, line, dest)
{
  let cmd = 'convert ' + canvas.string() + ' -stroke "' + line.color + '" -strokewidth ' + line.width;
  cmd += ' -draw "line ' + line.start.x + ',' + line.start.y + ' ' + line.end.x + ',' + line.end.y + '" ' + dest;
  return execute(cmd);
}

function drawPolygon(canvas, polygon, dest)
{
  let pointsStr = 'M ' + polygon.pointsToString();
  if (polygon.isClosed)
  {
    pointsStr += ' Z';
  }

  let cmd = 'convert ' + canvas.string();
  cmd += ' -fill "' + polygon.fillColor + '"';
  cmd += ' -stroke "' + polygon.strokeColor + '"';
  cmd += ' -strokewidth ' + polygon.strokeWidth;
  cmd += ' -draw "path' + "'" + polygon.pointsToString() + "' " + dest;
  return execute(cmd);
}

function drawCircle(canvas, circle, dest)
{
  let cmd = 'convert ' + canvas.string();
  cmd += ' -fill "' + circle.fillColor + '"';
  cmd += ' -stroke "' + circle.strokeColor + '"';
  cmd += ' -strokewidth ' + circle.strokeWidth;
  cmd += ' -draw "circle ' + circle.center.x + ',' + circle.center.y + ' ' + circle.edge.x + ',' +  circle.edge.y + '" ' + dest;
  return execute(cmd);
}

function drawEllipse(canvas, ellipse, dest)
{
  let cmd = 'convert ' + canvas.string();
  cmd += ' -fill "' + ellipse.fillColor + '"';
  cmd += ' -stroke "' + ellipse.strokeColor + '"';
  cmd += ' -strokewidth ' + ellipse.strokeWidth ;
  cmd += ' -draw "ellipse ' + ellipse.center.x + ',' + ellipse.center.y;
  cmd += ' ' + (ellipse.width / 2) + ',' + (ellipse.height / 2);
  cmd += ' ' + ellipse.angleStart + ',' + ellipse.angleEnd + '" ' + dest;
  console.log('\nDRAW_ELLIPSE:\n' + cmd);
  return execute(cmd);
}

function drawBezier(canvas, bezier, dest)
{
  let cmd = 'convert ' + canvas.string();
  cmd += ' -fill "' + bezier.fillColor + '"';
  cmd += ' -stroke "' + bezier.strokeColor + '"';
  cmd += ' -strokewidth ' + bezier.strokeWidth;
  cmd += ' -draw "bezier ' + bezier.pointsToString() + '" ' + dest;
  return execute(cmd);
}

// NOTE: List of fonts found here: /etc/ImageMagick-6/type-ghostscript.xml
function drawText(canvas, text, dest)
{
  let cmd = 'convert ' + canvas.string();
  cmd += ' -fill "' + text.fillColor + '"';
  cmd += ' -stroke "' + text.strokeColor + '"';
  cmd += ' -strokewidth ' + text.strokeWidth + ' -font ' + text.font + ' -pointsize ' + text.pointSize + ' -gravity ' + text.gravity;
  cmd += ' -draw "text 0,0 ' + "'" + text.string + "'" + '" ' + dest;
  console.log('\nDRAW_TEXT:\n' + cmd);
  return execute(cmd);
}

//---------------------------------
// FX

function swirl(src, degrees, dest)
{
  let cmd = '';
  if (src == dest)
  {
    cmd = 'mogrify -swirl ' + degrees + ' ' + dest;
  }
  else
  {
    cmd = 'convert ' + src + ' -swirl ' + degrees + ' ' + dest;
  }
  return execute(cmd);
}

function implode(src, factor, dest) // implosion: 0 < factor < 1,  explosion:  0 > factor > -1
{
  let cmd = 'convert ' + src + ' -implode ' + factor + ' ' + dest;
  return execute(cmd);
}

function wave(src, amplitude, frequency, dest)
{
  // F(x) =  A * sin(Bx)
  // A = amplitude
  // B = frequency  *** Number of pixels in one cycle ***  (2x --> twice as fast (tighter wave), 1/2x --> twice as slow (wider wave)
  // NOTE: Both A & B are measured in pixels
  let cmd = 'convert ' + src + ' -background transparent -wave ' + amplitude + 'x' + frequency + ' ' + dest;
  return execute(cmd);
}

//-----------------------------------------
// GIF

/*
DELAY values...
measured in 1/100th's of a second

LOOP values...
loop = 0 --> infinite
*/

function gif(canvas, filepaths, loop, delay, dispose, canvas_width, canvas_height, canvas_color, dest)
{
  let cmd = 'convert ' + canvas.string() + ' -delay ' + delay + ' -dispose ' + dispose + ' -loop ' + loop + ' ' + filepaths.join(' ') + dest;
  return execute(cmd);
}

//-------------------------------------------
// GRADIENT

class Radii
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

class Vector
{
  constructor(x1, y1, x2, y2)
  {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

class BoundingBox
{
  constructor(width, height, center)
  {
    this.width = width;
    this.height = height;
    this.center = center;
  }

  string()
  {
    this.width + 'x' + this.height + '+' + this.center.x + '+' + this.center.y;
  }
}

class LinearGradient
{
  constructor(fromColor, toColor)
  {
    this.fromColor = fromColor;
    this.toColor = toColor;
    this.vector = null;
    this.angle = null;
    this.boundingBox = null;
    this.direction = null;
    this.extent = null;
  }

  string()
  {
    defineStr = '-define';
    if (this.angle)
    {
      defineStr += ' gradient:angle=' + this.angle;
    }

    if (this.boundingBox)
    {        
      defineStr += ' gradient:bounding-box=' + this.boundingBox.string();
    }

    if (this.direction)
    {
      defineStr += ' gradient:direction=' + this.direction;
    }

    if (this.extent)
    {
      defineStr += ' gradient:extent=' + self.extent;
    }
    return defineStr;
  }
}

class RadialGradient
{
  constructor(fromColor, toColor)
  {
    this.fromColor = fromColor;
    this.toColor = toColor;
    this.center = Coordinates(0, 0);
    this.radii = null;
    this.angle = null;
    this.boundingBox = null;
    this.extent = null;
  }

  toString()
  {
    defineStr = '-define';
    if (this.center)
    {
      defineStr += ' gradient:center=' + this.center.x + ',' + this.center.y;
    }

    if (this.radii)
    {
      defineStr += ' gradient:radii=' + this.radii.x + ',' + this.radii.y;
    }

    if (this.angle)
    {
      defineStr += ' gradient:angle=' + this.angle;
    }

    if (this.boundingBox)
    {        
      defineStr += ' gradient:bounding-box=' + this.boundingBox.string();
    }

    if (this.extent)
    {
      defineStr += ' gradient:extent=' + self.extent;
    }
    return defineStr;
  }
}

function drawLinearGradient(canvas, linearGradient, dest)
{
  let cmd = 'convert ' + canvas.string() + ' ' + linearGradient.string() + ' ' + dest;
  return execute(cmd);
}

function drawRadialGradient(canvas, radialGradient, dest)
{
  let cmd = 'convert ' + canvas.string() + ' ' + linearGradient.string() + ' ' + dest;
  return execute(cmd);
}

//-----------------------------------------------
// MIRROR

function mirrorHorizontal(src, dest)
{
  let cmd = 'convert ' + src + ' -flop ' + dest;
  return execute(cmd);
}

function mirrorVertical(src, dest)
{
  let cmd = 'convert ' + src + ' -flip ' + dest;
  return execute(cmd);
}

function mirrorTranspose(src, dest)  // Top-Left To Bottom-Right
{
  let cmd = 'convert ' + src + ' -tranpose ' + dest;
  return execute(cmd);
}

function mirrorTransverse(src, dest)  // Bottom-Left To Top-Right
{
  let cmd = 'convert ' + src + ' -transverse ' + dest;
  return execute(cmd);
}

//-----------------------------------------------
// OFFSET

function offset(src, x0, y0, x1, y1, dest)
{
  let cmd = 'convert ' + src + ' -virtual-pixel transparent -distort Affine "';
  cmd += x0 + ',' + y0 + ' ' + x1 + ',' + y1 + '" ' + dest;
  return execute(cmd);
}

//----------------------------------------------
// PAINT

function oilPainting(src, paintValue, dest)
{
  let cmd = 'convert ' + src + ' -paint ' + paintValue + ' ' + dest;
  return execute(cmd);
}

//--------------------------------------
// RESIZE

function percentResize(src, percent, dest)
{
  let cmd = 'convert ' + src + ' -resize ' + percent + '% ' + dest;
  return execute(cmd);
}

function dimensionsResize(src, width, height, dest)
{
  let cmd = 'convert ' + src + ' -resize ' + width + 'x' + height + '\! ' + dest;
  return execute(cmd);
}

//------------------------------------
// ROLL

function horizontalRoll(src, pixels, dest)
{
  let hStr = '';
  if (pixels >= 0)
  {
      hStr = '+' + pixels;
  }
  else
  {
      hStr = '-' + pixels;
  }
  let cmd = 'convert ' + src + ' -roll ' + hStr + '+0 ' + dest;
  return execute(cmd);
}

function verticalRoll(src, pixels, dest)
{
  let vStr = '';
  if (pixels >= 0)
  {
    vStr = '+' + pixels;
  }
  else
  {
    vStr = '-' + pixels;
  }
  let cmd = 'convert ' + src + ' -roll +0' + vStr + ' ' + dest;
  return execute(cmd);
}

function biDirectionalRoll(src, hpixels, vpixels, dest)
{
  let hStr = '';
  if (hpixels >= 0)
  {
    hStr = '+' + hpixels;
  }
  else
  {
    hStr = '-' + hpixels;
  }

  let vStr = '';
  if (vpixels >= 0)
  {
    vStr = '+' + vpixels;
  }
  else
  {
    vStr = '-' + vpixels;
  }
  let cmd = 'convert ' + src + ' -roll ' + vStr + hStr + ' ' + dest;
  return execute(cmd);
}

//------------------------------------
// ROTATE

function rotateAroundCenter(src, degrees, dest)
{
  let adjustedDegrees = degrees % 360;
  let cmd = '';
  if (src == dest)
  {
    cmd = 'mogrify -distort SRT "' + adjustedDegrees + '" ' + src;
  }
  else
  {
    cmd = 'convert -distort SRT "' + adjustedDegrees + '" ' + src + ' ' + dest;
  }
  return execute(cmd);
}

function rotateAroundPoint()
{
  let adjustedDegrees = degrees % 360;
  let cmd = ''
  if (src == dest)
  {
      cmd = 'mogrify'
  }
  else
  {
      cmd = 'convert'
  }
  cmd += ' -distort SRT "' + x + ',' + y + ' ' + adjustedDegrees + '" ' + src + ' ' + dest;
  return execute(cmd);
}

//-------------------------------------
// SKETCH

function charcoalSketch(src, charcoalValue, dest)
{
  let cmd = 'convert ' + src + ' -charcoal ' + charcoalValue + ' ' + dest;
  return execute(cmd);
}

function coloringBookSketch(src, isHeavilyShaded, dest)
{
  let cmd = 'convert ' + src;
  if (isHeavilyShaded)
  {
    cmd += ' -segment 1x1 +dither -colors 2';
  }
  cmd += ' -edge 1 -negate -normalize -colorspace Gray -blur 0x.5 -contrast-stretch 0x50% ' + dest;
  return execute(cmd);
}

function pencilSketch(src, radius, sigma, angle, dest)
{
  let cmd = 'convert ' + src + ' -colorspace gray';
  cmd += ' -sketch ' + radius + 'x' + sigma  + '+' + angle + ' ' + dest;
  return execute(cmd);
}

//---------------------------------------

exports.blur = blur;
exports.negate = negate;
exports.colorize = colorize;
exports.toGrayScale = toGrayScale;
exports.toRGB = toRGB;
exports.makeImageTransparent = makeImageTransparent;
exports. replaceColor = replaceColor;
exports.compare = compare;
exports.difference = difference;
exports. autoLevelDiffImage = autoLevelDiffImage;
exports.compose = compose;
exports.crop = crop;
exports.cut = cut;
exports.cutMaskOut = cutMaskOut;
exports.cutNonMaskOut = cutNonMaskOut;
exports.Canvas = Canvas;
exports.Coordinates = Coordinates;
exports.Point = Point;
exports.Line = Line;
exports.Polygon = Polygon;
exports.Circle = Circle;
exports.Ellipse = Ellipse;
exports.Bezier = Bezier;
exports.Text = Text;
exports.pointsToString = pointsToString;
exports.drawCanvas = drawCanvas;
exports.drawPoint = drawPoint;
exports.drawLine = drawLine;
exports.drawPolygon = drawPolygon;
exports.drawCircle = drawCircle;
exports.drawEllipse = drawEllipse;
exports.drawBezier = drawBezier;
exports.drawText = drawText;
exports.swirl = swirl;
exports.implode = implode;
exports.wave = wave;
exports.gif = gif;
exports.Radii = Radii;
exports.Vector = Vector;
exports.BoundingBox = BoundingBox;
exports.LinearGradient = LinearGradient;
exports.RadialGradient = RadialGradient;
exports.drawLinearGradient = drawLinearGradient;
exports.drawRadialGradient = drawRadialGradient;
exports.mirrorHorizontal = mirrorHorizontal;
exports.mirrorVertical = mirrorVertical;
exports.mirrorTranspose = mirrorTranspose;
exports.mirrorTransverse = mirrorTransverse;
exports.offset = offset;
exports.oilPainting = oilPainting;
exports.percentResize = percentResize;
exports.dimensionsResize = dimensionsResize;
exports.horizontalRoll = horizontalRoll;
exports.verticalRoll = verticalRoll;
exports.biDirectionalRoll = biDirectionalRoll;
exports.rotateAroundCenter = rotateAroundCenter;
exports.rotateAroundPoint = rotateAroundPoint;
exports.charcoalSketch = charcoalSketch;
exports.coloringBookSketch = coloringBookSketch;
exports.pencilSketch = pencilSketch;