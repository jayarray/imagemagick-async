let PATH = require('path');
let projectDir = PATH.dirname(require.main.filename);
let rootDir = PATH.join(rootDir, 'im_modules');

//--------------------------------
// HELPERS

/**
 * Load ac drawable module.
 * @param {string} filepath 
 * @returns {{Create: object, Name: string, Layer: boolean, Consolidate: boolean, Dependencies: Array<string>}}
 */
function LoadDrawable(filepath) {
  let myModule = require(filepath);

  return {
    Create: myModule.Create,
    Name: myModule.Name,
    Layer: myModule.Layer,
    Consolidate: myModule.Consolidate,
    Dependencies: myModule.Dependencies,
  };
}

/**
 * Load an import module.
 * @param {string} filepath 
 * @returns {{Name: string, Import: object}} 
 */
function LoadImport(filepath) {
  let myImport = require(filepath);

  return {
    Name: myImport.Name,
    Import: myImport
  };
}

/**
 * Load a function module.
 * @param {string} filepath 
 * @returns {{Name: string, Func: object}} 
 */
function Loadfunction(filepath) {
  let myFunction = require(filepath);

  return {
    Name: myModule.Name,
    Func: myModule.Func
  };
}

/**
 * Load an import module.
 * @param {string} filepath 
 * @returns {{Create: object, Name: string}} 
 */
function LoadInput(filepath) {
  let myInput = require(filepath);

  return {
    Create: myInput.Create,
    Name: myInput.Name
  };
}

/**
 * Load a multi export module.
 * @param {string} filepath 
 * @returns {{Name: string, Object: object}} 
 */
function LoadMultiExport(filepath) {
  let myMulti = require(filepath);

  let o = {};
  myMulti.Multi.forEach(x => o[x.name] = x.obj);

  return {
    Name: myModule.Name,
    Object: o
  };
}

//--------------------------------

