let PATH = require('path');

//--------------------------------

class Filepath {
  constructor(builder) {
    this.infos = builder.infos;
  }

  String() {
    let str = builder.infos.map(x => x.name).join(PATH.sep);
    return str;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.infos = [];
      }

      /**
       * @param {string} name 
       */
      dir(name) {
        this.infos.push({
          name: name,
          type: 'dir'
        });

        return this;
      }

      /**
       * @param {string} name 
       */
      file(name) {
        this.infos.push({
          name: name,
          type: 'file'
        });

        return this;
      }

      /**
       * @param {string} path
       */
      partialPath(path) {
        let parts = path.split(PATH.sep);

        parts.forEach(x => {
          this.infos.push({
            name: x,
            type: 'dir'
          });
        });
      }

      build() {
        return new Filepath(this);
      }
    }
    return Builder;
  }

  static RootDir() {
    return __dirname;
  }
}

//-------------------------------
// EXPORTS

exports.Filepath = Filepath;