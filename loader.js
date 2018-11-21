let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');
let imModulesDir = PATH.join(__dirname, 'im_modules');

//---------------------------------
// CONSTANTS

const CONSOLIDATED_EFFECTS_FILEPATH = PATH.join(imModulesDir, 'Layer', 'consolidatedeffects.json');
const SINGLE_COMMAND_EFFECTS_FILEPATH = PATH.join(imModulesDir, 'Layer', 'singlecommandeffects.json');

//--------------------------------
// API

class ApiBuilder {
  constructor() {
    this.api_ = {};
    this.resolveDict_ = {};
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
   * Load an import specific items from module.
   * @param {string} filepath 
   * @returns {{Name: string, Import: object}} 
   */
  LoadImportSpecific_(filepath) {
    let myImport = require(filepath);

    let o = {};
    myImport.Specific.forEach(x => o[x.name] = x.obj);

    return {
      Name: myImport.Name,
      Specific: o
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
      Name: myMulti.Name,
      Object: o
    };
  }

  /**
   * Turn the filepath into a list of strings. (delimiter is OS path separator)
   * @param {string} path 
   * @returns {Array<string>}
   */
  FilepathToParts_(path) {
    let parts = path.replace(imModulesDir, '');
    parts = parts.split(PATH.sep).filter(x => x && x != '' && x.trim() != '');
    return parts;
  }

  /**
   * @param {string} name 
   * @param {object} obj 
   * @param {object} thisModule
   * @param {string} filepath
   */
  UpdateDrawables_(name, obj, thisModule, filepath) {
    this.drawables_.push({
      name: name,
      obj: obj,
      thisModule: thisModule,
      filepath: filepath
    });
  }

  /**
   * @param {string} filepath 
   * @param {string} name
   * @param {object} obj 
   */
  UpdateResolveDict_(filepath, name, obj) {
    let existingValue = this.resolveDict_[name];
    let o = { obj: obj, filepath: filepath };

    if (!existingValue) {
      this.resolveDict_[name] = [o];  // Create entry
    }
    else {
      let arr = this.resolveDict_[name];
      arr.push(o);
      this.resolveDict_[name] = arr;  // Update entry
    }
  }

  /**
   * @param {string} filepath 
   * @param {string} name
   * @param {object} obj 
   */
  UpdateAPI_(filepath, name, obj) {
    let parts = this.FilepathToParts_(filepath);
    let moduleDir = parts[0];

    // Check if module dir exists
    let ref = this.api_[moduleDir];

    if (ref === undefined) {
      this.api_[moduleDir] = {};  // Make it exist
      ref = this.api_[moduleDir]; // Update ref
    }

    parts = parts.slice(1, -1);

    for (let i = 0; i < parts.length; ++i) {
      let key = parts[i];
      let value = ref[key];

      if (!value) {
        ref[key] = {};
        ref = ref[key];
      }
      else {
        ref = value;
      }
    }

    ref[name] = obj;
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
    let componentType = thisModule.ComponentType;

    switch (componentType) {
      case 'drawable':
        loaded = this.LoadDrawable_(filepath);
        obj = loaded.Create;
        break;
      case 'import':
        loaded = this.LoadImport_(filepath);
        obj = loaded.Import;
        break;
      case 'import specific':
        loaded = this.LoadImportSpecific_(filepath);
        obj = loaded.Specific;
        break;
      case 'input':
        loaded = this.LoadInput_(filepath);
        obj = loaded.Create
        break;
      case 'function':
        loaded = this.LoadFunction_(filepath);
        obj = loaded.Func;
        break;
      case 'multi':
        loaded = this.LoadMultiExport_(filepath);
        obj = loaded.Object;
        break;
      default:
        return;
        break;
    }

    this.UpdateAPI_(filepath, thisModule.Name, obj);

    if (componentType == 'multi') {
      let arr = thisModule.Multi;
      arr.forEach(o => this.UpdateResolveDict_(filepath, o.name, o.obj));
    }
    else if (componentType == 'import specific') {
      let arr = thisModule.Specific;
      arr.forEach(o => this.UpdateResolveDict_(filepath, o.name, o.obj));
    }
    else {
      this.UpdateResolveDict_(filepath, thisModule.Name, obj);
    }

    if (thisModule.ComponentType == 'drawable')
      this.UpdateDrawables_(thisModule.Name, obj, thisModule, filepath);
  }

  GetAPI() {
    return this.api_;
  }

  GetDrawables() {
    return this.drawables_;
  }

  GetResolveDict() {
    return this.resolveDict_;
  }
}

class ImageMagickAPI {
  constructor(api, resolveDict) {
    this.api_ = api;
    this.resolveDict_ = resolveDict;
  }

  GetAPI() {
    return this.api_;
  }

  GetResolveDict() {
    return this.resolveDict_;
  }

  /**
   * Get the function object that matches the name specified. Providing the module name is optional.
   * @param {string} name Name of the function object.
   * @param {string} moduleName Name of the module this function is in.
   * @returns {Array<{obj: object, filepath: string}>} Returns an array of objects. The size of the array tells you how many entries there are with the specified name.
   */
  Resolve(name, moduleName) {
    let existingValue = this.resolveDict_[name];

    if (existingValue) {
      if (moduleName)
        return existingValue.filter(x => x.filepath.split(PATH.sep).includes(moduleName)).map(x => x.obj);
      return existingValue.map(x => x.obj);
    }
    return null;
  }
}

//--------------------------------
// HELPER functions

/**
 * Get drawable module properties.
 * @param {string} filepath 
 * @returns {Promise<{name: string, layer: boolean, consolidate: boolean, filepath: string}>}
 */
function GetDrawableProperties(filepath) {
  return new Promise((resolve, reject) => {
    LINUX_COMMANDS.File.ReadLines(filepath, LINUX_COMMANDS.Command.LOCAL).then(lines => {
      // Filter for all export lines
      lines = lines.filter(x => x && x != '' && x.includes("exports.")).map(x => x.trim());

      // Check if component is drawable
      let componentType = lines.filter(x => x.includes('exports.ComponentType'))[0];
      componentType = componentType.split('exports.ComponentType =')[1].trim();
      componentType = componentType.split(`'`).join('');
      componentType = componentType.replace(`;`, '');

      if (componentType != 'drawable') {
        resolve(null);
        return;
      }

      // Get other properties
      let name = lines.filter(x => x.includes("exports.Name"))[0];
      name = name.split('exports.Name =')[1].trim();
      name = name.split(`'`).join('');
      name = name.replace(`;`, '');

      let layer = lines.filter(x => x.includes("exports.Layer"))[0];
      layer = layer.split('exports.Layer =')[1].trim();
      layer = layer.split(`'`).join('');
      layer = layer.replace(`;`, '');
      layer = layer == 'true';

      let consolidate = lines.filter(x => x.includes("exports.Consolidate"))[0];
      consolidate = consolidate.split('exports.Consolidate =')[1].trim();
      consolidate = consolidate.split(`'`).join('');
      consolidate = consolidate.replace(`;`, '');
      consolidate = consolidate == 'true';

      let singlecommand = lines.filter(x => x.includes("exports.SingleCommand"));
      if (singlecommand.length == 0) {
        singlecommand = false;
      }
      else {
        singlecommand = singlecommand[0];
        singlecommand = singlecommand.split('exports.SingleCommand =')[1].trim();
        singlecommand = singlecommand.split(`'`).join('');
        singlecommand = singlecommand.replace(`;`, '');
        singlecommand = singlecommand == 'true';
      }


      resolve({
        name: name,
        layer: layer,
        consolidate: consolidate,
        filepath: filepath,
        singlecommand: singlecommand
      });
    }).catch(error => reject(error));
  });
}

function StoreConsolidatedEffects(fxArr) {
  return new Promise((resolve, reject) => {
    let remappedFx = fxArr.map(x => {
      return {
        name: x.name,
        layer: x.layer,
        consolidate: x.consolidate,
        filepath: x.filepath,
      };
    });

    let obj = { effects: remappedFx };
    let str = JSON.stringify(obj);
    let outputPath = CONSOLIDATED_EFFECTS_FILEPATH;

    LINUX_COMMANDS.File.Create(outputPath, str, LINUX_COMMANDS.Command.LOCAL).then(success => {
      resolve();
    }).catch(error => reject(error));
  });
}

function StoreSingleCommandEffects(fxArr) {
  return new Promise((resolve, reject) => {
    let remappedFx = fxArr.map(x => {
      return {
        name: x.name,
        layer: x.layer,
        consolidate: x.consolidate,
        filepath: x.filepath,
      };
    });

    let obj = { effects: remappedFx };
    let str = JSON.stringify(obj);
    let outputPath = SINGLE_COMMAND_EFFECTS_FILEPATH;

    LINUX_COMMANDS.File.Create(outputPath, str, LINUX_COMMANDS.Command.LOCAL).then(success => {
      resolve();
    }).catch(error => reject(error));
  });
}

function GetAllJsFilepaths(dirpath) {
  return new Promise((resolve, reject) => {
    LINUX_COMMANDS.Find.FilesByName(dirpath, '*', null, LINUX_COMMANDS.Command.LOCAL).then(results => {
      let filepaths = results.paths.filter(x => x.endsWith('.js'));
      filepaths.sort();

      resolve(filepaths);
    }).catch(error => reject(error));
  });
}

function GetDrawableComponents(filepaths) {
  return new Promise((resolve, reject) => {
    let componentChecks = filepaths.map(x => GetDrawableProperties(x));

    Promise.all(componentChecks).then(results => {
      results = results.filter(x => x != null);
      resolve(results);
    }).catch(error => reject(error));
  });
}

function CreateApi(filepaths) {
  let apiBuilder = new ApiBuilder();
  filepaths.forEach(x => apiBuilder.Load(x));

  return {
    api: new ImageMagickAPI(apiBuilder.GetAPI(), apiBuilder.GetResolveDict()),
    drawables: apiBuilder.GetDrawables()
  }
}

/**
 * Build API and generate essential JSON files.
 * @param {string} dirpath Path to im_modules dir
 * @returns {Promise<{api: object, drawables: Array<>}>} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function BuildApi(dirpath) {
  return new Promise((resolve, reject) => {
    GetAllJsFilepaths(dirpath).then(filepaths => {
      GetDrawableComponents(filepaths).then(objArr => {
        let consolidatedEffects = objArr.filter(x => x.consolidate);

        StoreConsolidatedEffects(consolidatedEffects).then(success => {
          let singleCommandEffects = objArr.filter(x => x.singlecommand);

          StoreSingleCommandEffects(singleCommandEffects).then(success => {
            let o = CreateApi(filepaths);

            resolve({
              api: o.api,
              drawables: o.drawables
            });
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

/**
 * Load API with existing essential JSON files.
 * @returns {Promise<{api: object, drawables: Array<>}>}
 */
function LoadApi(dirpath) {
  return new Promise((resolve, reject) => {
    GetAllJsFilepaths(dirpath).then(filepaths => {
      let o = CreateApi(filepaths);

      resolve({
        api: o.api,
        drawables: o.drawables
      });
    }).catch(error => reject(error));
  });
}

/**
 * Load the module directory.
 * @param {string} dirpath 
 * @returns {Promise<{api: object, drawables: Array<>>} Returns a promise with the API object attached to it if successful. Else returns an error.
 */
function Load(dirpath) {
  return new Promise((resolve, reject) => {
    // Check if json files exist
    LINUX_COMMANDS.Path.Exists(CONSOLIDATED_EFFECTS_FILEPATH, LINUX_COMMANDS.Command.LOCAL).then(cExists => {
      LINUX_COMMANDS.Path.Exists(SINGLE_COMMAND_EFFECTS_FILEPATH, LINUX_COMMANDS.Command.LOCAL).then(sExists => {
        if (!cExists || !sExists) {
          BuildApi(dirpath).then(o => {
            resolve(o);
          }).catch(error => reject(error));
        }
        else {
          LoadApi(dirpath).then(o => {
            resolve(o);
          }).catch(error => reject(error));
        }
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

//--------------------------------
// LOAD MODULES

let Loaded = new Promise((resolve, reject) => {
  Load(imModulesDir).then(o => {
    resolve({
      API: o.api,
      Drawables: o.drawables,
      ModulesDir: imModulesDir
    });
  }).catch(error => reject(`Failed to load Image Magick modules: ${error}`));
});

exports.Loaded = Loaded;