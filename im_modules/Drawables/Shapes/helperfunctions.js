let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;

//---------------------------------

/**
 * Rotate a point about the specified center.
 * @param {Coordinates} center 
 * @param {Coordinates} point 
 * @returns {Coordinates} Returns a new instance of a Coordinates object.
 */
function GetRotatedPoint(center, point, degrees) {
  let theta = degrees * (Math.PI / 180); // theta is in radians
  let rotatedPoint = null;

  if (center.args.x == 0 && center.args.y == 0) {
    // Perform rotation
    let newX = (point.args.x * Math.cos(theta)) - (point.args.y * Math.sin(theta));
    newX = parseInt(newX);

    let newY = (point.args.y * Math.cos(theta)) + (point.args.x * Math.sin(theta));
    newY = parseInt(newY);

    rotatedPoint = Coordinates.Builder
      .x(newX)
      .y(newY)
      .build();
  }
  else {
    // Translate point so that center is at origin
    let translatedPoint = Coordinates.Builder
      .x(point.args.x - center.args.x)
      .y(point.args.y - center.args.y)
      .build();

    // Perform rotation
    let newX = (translatedPoint.args.x * Math.cos(theta)) - (translatedPoint.args.y * Math.sin(theta));
    newX = parseInt(newX);

    let newY = (translatedPoint.args.x * Math.sin(theta)) + (translatedPoint.args.y * Math.cos(theta));
    newY = parseInt(newY);

    // Undo the translation
    rotatedPoint = Coordinates.Builder
      .x(newX + center.args.x)
      .y(newY + center.args.y)
      .build();
  }

  return rotatedPoint;
}

/**
 * Get the slope formed by points a and b.
 * @param {Coordinates} a 
 * @param {Coordinates} b 
 * @returns {number} Return a number representing the slope.
 */
function GetSlope(a, b) {
  return (a.args.y - b.args.y) / (a.args.x - b.args.x);
}

//------------------------------
// EXPORTS

exports.GetRotatedPoint = GetRotatedPoint;
exports.GetSlope = GetSlope;