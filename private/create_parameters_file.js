let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Api = require(Path.join(RootDir, 'api.js')).Api;
let ObjectBuilder = require(Path.join(RootDir, 'api.js')).ObjectBuilder;

//-----------------------------------------

/**
 * Create a file that stores all functions and their parameters.
 * 
 * Example:
 *          Implode: {
 *            
 *          }
 */

//-----------------------------------------
// HELPER FUNCTIONS

/**
 * @param {string} c 
 * @returns {boolean} Returns true if character is upper case. False otherwise.
 */
function IsUpperCase(c) {
  return c == c.toUpperCase();
}

/**
 * @param {string} c 
 * @returns {boolean} Returns true if character is lower case. False otherwise.
 */
function IsLowerCase(c) {
  return c == c.toLowerCase();
}

/**
 * @param {string} str 
 * @returns {Array<string>} Returns an array of chars.
 */
function ToCharArray(str) {
  return str.split('');
}

/**
 * @param {string} str 
 * @returns {boolean} Returns true if all characters are lower case. False otherwise.
 */
function IsAllLowerCase(str) {
  let chars = ToCharArray(str);

  for (let i = 0; i < chars.length; ++i) {
    let currChar = chars[i];
    if (!IsLowerCase(currChar))
      return false;
  }
  return true;
}

/**
 * @param {string} str 
 * @returns {boolean} Returns true if all characters are upper case. False otherwise.
 */
function IsAllUpperCase(str) {
  let chars = ToCharArray(str);

  for (let i = 0; i < chars.length; ++i) {
    let currChar = chars[i];
    if (!IsUpperCase(currChar))
      return false;
  }
  return true;
}


/**
 * @param {string} str 
 * @returns {number} Returns the index of the first occuring capital letter (not including the first char in the string).
 */
function NextUpperCaseIndex(str) {
  let chars = ToCharArray(str);

  for (let i = 1; i < chars.length; ++i) {
    let currChar = chars[i];
    if (IsUpperCase(currChar))
      return i;
  }

  return null;
}

/**
 * @param {string} str 
 * @returns {Array<string>} Returns an array of words.
 */
function CamelCaseToMultiWord(str) {
  let wordStr = '';

  if (IsAllLowerCase(str) || IsAllUpperCase(str))
    wordStr = str;
  else {
    let prevIndex = 0;
    let currIndex = NextUpperCaseIndex(str);

    if (currIndex) {
      let words = [];

      while (currIndex && currIndex < str.length) {
        let currWord = str.substring(prevIndex, currIndex);
        words.push(currWord);

        prevIndex = currIndex;
        currIndex = NextUpperCaseIndex(str.substring(currIndex));

        // Check for last word
        if (!currIndex) {
          let lastWord = str.substring(prevIndex);
          words.push(lastWord);
        }
      }

      wordStr = words.join(' ');
    }
    else
      wordStr = str;
  }

  // Make sure first letter is capitalized
  if (IsLowerCase(multiWordStr.charAt(0))) {
    let chars = ToCharArray(multiWordStr);
    chars[0] = chars[0].toUpperCase();
    multiWordStr = chars.join('');
  }

  return multiWordStr;
}


// CONT

//-------------------------------------
// MAIN

console.log('\nCreating parameters file...');


