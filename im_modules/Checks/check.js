/**
 * @param {object} o 
 * @returns {boolean} Returns true if object is defined. False otherwise.
 */
function IsDefined(o) {
  return o != null && o !== undefined;
}

/**
 * @param {object} o 
 * @returns {boolean} Returns true if object is a string. False otherwise.
 */
function IsString(o) {
  return typeof o == 'string' || o instanceof String;
}

/**
 * @param {string} s
 * @returns {boolean} Returns true if string is empty. False otherwise. 
 */
function IsEmptyString(s) {
  return s == '';
}

/**
 * @param {string} s
 * @returns {boolean} Returns true if string is all whitespace. False otherwise. 
 */
function IsWhitespace(s) {
  return s.trim() == '';
}

/**
 * @param {string} s 
 * @returns {boolean} Returns true if string contains letters only. False otherwise.
 */
function IsAlphaString(s) {
  if (!s || !IsString(s) || s.length < 1)
    return false;

  let regExp = /^[A-Za-z]+$/;
  return s.value.match(regExp) != null;
}

/**
 * @param {string} s 
 * @returns {boolean} Returns true if string contains numbers only. False otherwise.
 */
function IsNumericString(s) {
  if (!s || !IsString(s) || s.length < 1)
    return false;

  let regExp = /^[0-9]+$/;
  return s.value.match(regExp) != null;
}

/**
 * @param {string} s 
 * @returns {boolean} Returns true if string contains at least one letter and one number. False otherwise.
 */
function IsAlphaNumeric(s) {
  if (!s || !IsString(s) || s.length < 2)
    return false;

  let regExp = /^[0-9a-zA-Z]+$/;
  return !IsAlphaString(s) && !IsNumericString(s) && s.value.match(regExp) != null;
}

/**
 * @param {object} o 
 * @returns {boolean} Returns true if object is a number. False otherwise.
 */
function IsNumber(o) {
  return typeof o == 'number';
}

/**
 * @param {number} n 
 * @returns {boolean} Returns true if number is an integer. False otherwise.
 */
function IsInteger(n) {
  return IsNumber(n) && n % 1 == 0;
}

/**
 * @param {number} n
 * @returns {boolean} Returns true if number is a float. False otherwise. 
 */
function IsFloat(n) {
  return IsNumber(n) && n % 1 != 0;
}

/**
 * @param {object} o 
 * @returns {boolean} Returns true if object is an array. False otherwise.
 */
function IsArray(o) {
  return Array.isArray(o);
}

//-------------------------------
// EXPORTS

exports.IsDefined = IsDefined;
exports.IsString = IsString;
exports.IsEmptyString = IsEmptyString;
exports.IsWhitespace = IsWhitespace;
exports.IsAlphaString = IsAlphaString;
exports.IsNumericString = IsNumericString;
exports.IsAlphaNumeric = IsAlphaNumeric;
exports.IsNumber = IsNumber;
exports.IsInteger = IsInteger;
exports.IsFloat = IsFloat;
exports.IsArray = IsArray;

exports.LoaderInfo = {
  ComponentType: 'private'
}