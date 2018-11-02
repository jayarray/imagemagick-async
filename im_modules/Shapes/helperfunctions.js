let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let COORDINATES = require(PATH.join(rootDir, 'im_modules', 'Inputs', 'coordinates.js')).Create;

//---------------------------------

/**
 * Rotate a point about the specified center.
 * @param {Coordinates} center 
 * @param {Coordinates} point 
 * @returns {Coordinates} Returns a Coordinates object.
 */
function GetRotatedPoint(center, point, degrees) {
  let theta = degrees * (Math.PI / 180); // theta is in radians
  let rotatedPoint = null;

  if (center.x_ == 0 && center.y_ == 0) {
    let newX = (point.x_ * Math.cos(theta)) - (point.y_ * Math.sin(theta));
    newX = parseInt(newX);

    let newY = (point.y_ * Math.cos(theta)) + (point.x_ * Math.sin(theta));
    newY = parseInt(newY);

    rotatedPoint = COORDINATES(newX, newY);
  }
  else {
    // Translate point so that center is at origin
    let translatedPoint = COORDINATES(point.x_ - center.x_, point.y_ - center.y_);

    // Perform rotation
    let newX = (translatedPoint.x_ * Math.cos(theta)) - (translatedPoint.y_ * Math.sin(theta));
    newX = parseInt(newX);

    let newY = (translatedPoint.x_ * Math.sin(theta)) + (translatedPoint.y_ * Math.cos(theta));
    newY = parseInt(newY);

    // Undo the translation
    rotatedPoint = COORDINATES(newX + center.x_, newY + center.y_);
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
  return (a.y_ - b.y_) / (a.x_ - b.x_);
}

//------------------------------
// EXPORTS

exports.GetRotatedPoint = GetRotatedPoint;
exports.GetSlope = GetSlope;

exports.ComponentType = 'private';