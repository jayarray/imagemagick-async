let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');
let projectDir = PATH.dirname(require.main.filename);
let rootDir = PATH.join(projectDir, 'im_modules');

//--------------------------------
// API

class API {
  constructor() {
    this.api_ = {};
    this.drawables_ = [];
  }

  /**
   * Load a drawable module.
   * @param {string} filepath 
   * @returns {{Create: object, Name: string, Layer: boolean, Consolidate: boolean, Dependencies: Array<string>}}
   */
  LoadDrawable_(filepath) {
    let myModule = require(filepath);

    return {
      Create: myModule.Create,
      Name: myModule.Name,
      Layer: myModule.Layer,
      Consolidate: myModule.Consolidate,
      Dependencies: myModule.Dependencies,
      Filepath: filepath
    };
  }

  /**
   * Load an import module.
   * @param {string} filepath 
   * @returns {{Name: string, Import: object}} 
   */
  LoadImport_(filepath) {
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
  LoadFunction_(filepath) {
    let myFunction = require(filepath);

    return {
      Name: myFunction.Name,
      Func: myFunction.Func
    };
  }

  /**
   * Load an input module.
   * @param {string} filepath 
   * @returns {{Create: object, Name: string}} 
   */
  LoadInput_(filepath) {
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
  LoadMultiExport_(filepath) {
    let myMulti = require(filepath);

    let o = {};
    myMulti.Multi.forEach(x => o[x.name] = x.obj);

    return {
      Name: myModule.Name,
      Object: o
    };
  }

  /**
   * Turn the filepath into a list of strings. (delimiter is OS path separator)
   * @param {string} path 
   * @returns {Array<string>}
   */
  FilepathToParts_(path) {
    return path.replace(rootDir, '').split(PATH.sep).filter(x => x && x != '' && x.trim() != '');
  }

  /**
   * @param {string} filepath 
   * @param {object} obj 
   */
  UpdateAPI_(filepath, obj) {
    let parts = this.FilepathToParts_(filepath);
    let moduleDir = parts[0];

    // Check if module dir exists
    let ref = this.api_[moduleDir];
    if (ref === undefined) {
      this.api_[moduleDir] = null;  // Make it exist
      ref = this.api_[moduleDir];   // Update ref
    }
    else {
      ref = this.api_[moduleDir];   // Update ref
    }

    parts = parts.slice(1);
    parts[-1] = parts[-1].replace('.js', ''); // Remove extension from filename

    for (let i = 0; i < parts.length; ++i) {
      let key = parts[i];
      let value = this.api_[key];

      if (value === undefined) {
        ref[key] = null;   // Make it exist
        ref = ref[key];    // Update ref
      }
      else {
        ref = ref[key];    // Update ref
      }
    }
    ref = obj;
  }

  /**
   * @param {string} name 
   * @param {object} obj 
   * @param {object} thisModule
   */
  UpdateDrawables_(name, obj, thisModule) {
    this.drawables_.push({
      name: name,
      obj: obj,
      thisModule: thisModule
    });
  }

  /**
   * Load module by path.
   * @param {string} filepath 
   * @returns {{obj: object, loaded: object}}
   */
  Load(filepath) {
    let thisModule = require(filepath);
    let loaded = null;
    let obj = null;

    switch (thisModule.ComponentType) {
      case 'drawable':
        loaded = LoadDrawable_(currFilepath);
        obj = loaded.Create;
        break;
      case 'import':
        loaded = LoadImport_(currFilepath);
        obj = loaded.Import;
        break;
      case 'input':
        loaded = LoadInput_(currFilepath);
        obj = loaded.Create
        break;
      case 'function':
        loaded = LoadFunction_(currFilepath);
        obj = loaded.Func;
        break;
      case 'multi':
        loaded = LoadMultiExport_(currFilepath);
        obj = loaded.Object;
        break;
      default:
        break;
    }

    this.UpdateAPI_(filepath, obj);

    if (thisModule.ComponentType == 'drawable')
      this.UpdateDrawables_(thisModule.Name, obj, thisModule);
  }

  GetAPI() {
    return this.api_;
  }

  GetDrawables() {
    return this.drawables_;
  }
}

//--------------------------------
// HELPER functions

/**
 * Load a module directory
 * @param {string} dirpath 
 * @returns {Promise} Returns a promise with the API object attached to it if successful. Else returns an error.
 */
function Load(dirpath) {
  return new Promise((resolve, reject) => {
    // Get all files
    LINUX_COMMANDS.Find.FilesByName(dirpath, '*', null, LINUX_COMMANDS.Command.LOCAL).then(results => {
      let filepaths = results.paths;

      let api = new API();
      filepaths.forEach(x => api.Load(x));

      resolve(api);
    }).catch(error => reject(`Failed to load modules: ${error}`));
  });
}

/**
 * Create a file holding a list of the consolidated effects. (Used by optimizer).
 * @param {Array<object>} drawables 
 * @param {string} outputPath
 */
function CreateConsolidatedEffectsJSON(drawables, outputPath) {
  return new Promise((resolve, reject) => {
    let consolidatedEffects = [];

    let filtered = drawables.filter(x => x.thisModule.Consolidate);
    filtered.forEach(x => {
      let e = {
        name: x.thisModule.Name,
        layer: x.thisModule.Layer,
        dependencies: x.thisModule.Dependencies,
        filepath: x.thisModule.Filepath
      };

      consolidatedEffects.push(e);
    });

    // Create JSON file
    let jsonObj = { effects: consolidatedEffects };
    let jsonStr = JSON.stringify(jsonObj);

    LINUX_COMMANDS.File.Create(outputPath, jsonStr, LINUX_COMMANDS.Command.LOCAL).then(success => {
      resolve();
    }).catch(error => reject(`Failed to create Consolidated Effects JSON file: ${error}`));
  });
}

//--------------------------------
// LOAD MODULES

let projectDir = PATH.dirname(require.main.filename);
let imModulesDir = PATH.join(projectDir, 'im_modules');
let layerDir = PATH.join(imModulesDir, 'layer');

Load(imModulesDir).then(api => {
  let jsonOutputPath = PATH.join(layerDir, 'consolidatedeffects.json');

  CreateConsolidatedEffectsJSON(api.GetDrawables(), jsonOutputPath).then(success => {
    console.log(`\nSuccessfully loaded modules.`);
  }).catch(error => {
    console.log(`\nERROR: ${error}`);
  });
}).catch(error => {
  console.log(`\nERROR: ${error}`);
});