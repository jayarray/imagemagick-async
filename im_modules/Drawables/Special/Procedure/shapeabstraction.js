let Path = require('path');
let LinuxCommands = require('linux-commands-async');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Guid = require(Path.join(Filepath.LayerDir(), 'guid.js'));
let Color = require(Path.join(Filepath.InputsDir(), 'color.js')).Color;
let Spot = require(Path.join(Filepath.InputsDir(), 'spot.js')).Spot;
let Shapes = require(Path.join(Filepath.InputsDir(), 'spot.js')).SHAPES;
let ProcedureBaseClass = require(Path.join(Filepath.SpecialProcedureDir(), 'procedurebaseclass.js')).ProcedureBaseClass;

//-------------------------------
// HELPER FUNCTIONS

let data = {};

function Spotify(imgSource, allArgs, dest) {
  return new Promise((resolve, reject) => {

    // Get parent dir for dest
    let parentDir = LinuxCommands.Path.ParentDir(dest);

    // Create source temp file

    let a1Guid = Guid.Create(16);
    let tmpA1 = Path.join(parentDir, `spots_1_${a1Guid}.mpc`);
    let briConArgs = allArgs.brightness == 0 && allArgs.contrast == 0 ? null : ['-brightness-contrast', `${allArgs.brightness},${allArgs.contrast}`];

    let tmpA1Args = ['-quiet', imgSource];
    if (briConArgs)
      tmpA1Args = tmpA1Args.concat(briConArgs);
    tmpA1Args.push('-clamp', '+repage', tmpA1);

    LinuxCommands.Command.LOCAL.Execute('convert', tmpA1Args).then(a1output => {
      if (a1output.stderr) {
        reject(`Error creating tmpA1 file: ${a1output.stderr}`);
        return;
      }

      // Get ww
      LinuxCommands.Command.LOCAL.Execute('convert', [tmpA1, '-ping', '-format', '%w', 'info:']).then(wwOutput => {
        data.ww = Number(wwOutput.stdout.trim());

        // Get hh
        LinuxCommands.Command.LOCAL.Execute('convert', [tmpA1, '-ping', '-format', '%h', 'info:']).then(hhOutput => {
          data.hh = Number(hhOutput.stdout.trim());

          // Get sw
          LinuxCommands.Command.LOCAL.Execute(`echo ${allArgs.spot.SizeString()} | cut -dx -f1`, []).then(swOutput => {
            data.sw = Number(swOutput.stdout.trim());

            // Get sh
            LinuxCommands.Command.LOCAL.Execute(`echo ${allArgs.spot.SizeString()} | cut -dx -f2`, []).then(shOutput => {
              data.sh = Number(shOutput.stdout.trim());

              // Get scx
              LinuxCommands.Command.LOCAL.Execute('convert', ['xc:', '-format', `%[fx:(${data.sw}-1)/2]`, 'info:']).then(scxOutput => {
                data.scx = Number(scxOutput.stdout.trim());

                // Get scy
                LinuxCommands.Command.LOCAL.Execute('convert', ['xc:', '-format', `%[fx:(${data.sh}-1)/2]`, 'info:']).then(scyOutput => {
                  data.scy = Number(scyOutput.stdout.trim());

                  // Get lx, ly
                  data.lx = data.sw - 1;
                  data.ly = data.sh - 1;

                  // Get pw, ph
                  data.pw = data.sw + 2 * allArgs.spot.args.padding;
                  data.ph = data.sh + 2 * allArgs.spot.args.padding;

                  // Get padding string 
                  let paddingArgs = null;
                  if (allArgs.spot.args.padding > 0)
                    paddingArgs = ['-bordercolor', 'black', '-border', allArgs.spot.args.padding];


                  // Create spot template

                  let a2Guid = Guid.Create(16);
                  let tmpA2 = Path.join(parentDir, `spots_2_${a2Guid}.mpc`);
                  let args = ['-size', `${data.sw}x${data.sh}`, 'canvas:black', '+antialias', '-fill', 'white', '-draw'];

                  if (allArgs.spot.args.shape == Shapes.circle)
                    args.push(`ellipse ${data.scx}, ${data.scy} ${data.scx}, ${data.scy} 0, 360`);
                  else if (allArgs.spot.args.shape == Shapes.diamond)
                    args.push(`polygon ${data.scx}, 0 ${data.lx}, ${data.scy} ${data.scx}, ${data.ly} 0, ${data.scy}`);
                  else if (allArgs.spot.args.shape == Shapes.square)
                    args.push(`rectangle 0, 0 ${data.lx}, ${data.ly}`);

                  args.push('-alpha', 'off');

                  if (paddingArgs)
                    args = args.concat(paddingArgs);

                  args.push(tmpA2);

                  LinuxCommands.Command.LOCAL.Execute('convert', args).then(spotOutput => {
                    if (spotOutput.stderr) {
                      reject(`Error creating spot file: ${spotOutput.stderr}`);
                      return;
                    }

                    // Create B1 temp cache

                    let tmpB1 = Path.join(parentDir, `spots_1_${a1Guid}.cache`);
                    LinuxCommands.Command.LOCAL.Execute('touch', [tmpB1]).then(b1Success => {

                      // Create B2 temp cache

                      let tmpB2 = Path.join(parentDir, `spots_2_${a2Guid}.cache`);
                      LinuxCommands.Command.LOCAL.Execute('touch', [tmpB2]).then(b2Success => {

                        // Get xmin
                        LinuxCommands.Command.LOCAL.Execute('convert', ['xc:', '-format', `%[fx:ceil(${data.ww}/${data.pw})]`, 'info:']).then(xminOutput => {
                          data.xmin = Number(xminOutput.stdout.trim());

                          // Get ymin
                          LinuxCommands.Command.LOCAL.Execute('convert', ['xc:', '-format', `%[fx:ceil(${data.hh}/${data.ph})]`, 'info:']).then(yminOutput => {
                            data.ymin = Number(yminOutput.stdout.trim());

                            // Get www                      
                            LinuxCommands.Command.LOCAL.Execute('convert', ['xc:', '-format', `%[fx:${data.xmin}*${data.pw}]`, 'info:']).then(wwwOutput => {
                              data.www = Number(wwwOutput.stdout.trim());

                              // Get hhh                      
                              LinuxCommands.Command.LOCAL.Execute('convert', ['xc:', '-format', `%[fx:${data.ymin}*${data.ph}]`, 'info:']).then(hhhOutput => {
                                data.hhh = Number(hhhOutput.stdout.trim());

                                // Process image

                                let cmd = 'convert';
                                cmd += ` \\( ${tmpA1} -define distort:viewport=${data.www}x${data.hhh}+0+0 -virtual-pixel mirror -distort SRT 0`;
                                cmd += ` -scale ${data.xmin}x${data.ymin}! -scale ${data.www}x${data.hhh}! -crop ${data.ww}x${data.hh}+0+0 +repage \\)`;
                                cmd += ` \\( ${tmpA2} -write mpr:tile +delete -size ${data.ww}x${data.hh}! tile:mpr:tile \\)`;

                                if (allArgs.edge == 0) {
                                  cmd += ' -alpha off -compose copy_opacity -composite -compose over';
                                  cmd += ` -background '${allArgs.backgroundColor.String()}' -flatten ${dest}`;
                                }
                                else {
                                  cmd += ` \\( -clone 1 -threshold 0 -edge ${allArgs.edge} -clamp -fill '${allArgs.edgeColor.String()}' -opaque white -transparent black \\)`;
                                  cmd += ' \\( -clone 0 -clone 1 -alpha off -compose copy_opacity -composite -compose over';
                                  cmd += ` -background '${allArgs.backgroundColor.String()}' -flatten \\)`;
                                  cmd += ` -delete 0,1 +swap -compose over -composite ${dest}`;
                                }

                                LinuxCommands.Command.LOCAL.Execute(cmd, []).then(imgProcOutput => {
                                  if (imgProcOutput.stderr) {
                                    reject(`Error processing image: ${imgProcOutput.stderr}`);
                                    return;
                                  }

                                  // Clean up temp files
                                  LinuxCommands.Remove.Files([tmpA1, tmpB1, tmpA2, tmpB2], LinuxCommands.Command.LOCAL).then(cleanUpSuccess => {

                                    // Clean up data
                                    data = {};

                                    // Finish
                                    resolve();
                                  }).catch(error => reject(`Failed to clean up temp files: ${error}`));
                                }).catch(error => reject(`Failed to process image: ${error}`));
                              }).catch(error => reject(`Failed to get hhh value: ${error}`));
                            }).catch(error => reject(`Failed to get www value: ${error}`));
                          }).catch(error => reject(`Failed to get ymin value: ${error}`));
                        }).catch(error => reject(`Failed to get xmin value: ${error}`));
                      }).catch(error => reject(`Failed to create tmpB2 file: ${error}`));
                    }).catch(error => reject(`Failed to create tmpB1 file: ${error}`));
                  }).catch(error => reject(`Failed to create spot file: ${error}`));
                }).catch(error => reject(`Failed to get scy value: ${error}`));
              }).catch(error => reject(`Failed to get scx value: ${error}`));
            }).catch(error => reject(`Failed to get sh value: ${error}`));
          }).catch(error => reject(`Failed to get sw value: ${error}`));
        }).catch(error => reject(`Failed to get hh value: ${error}`));
      }).catch(error => reject(`Failed to get ww value: ${error}`));
    }).catch(error => reject(`Failed to create tmpA1 file: ${error}`));
  });
}

//------------------------------

class ShapeAbstraction extends ProcedureBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ShapeAbstraction';

        this.args = {
          edge: 0,
          edgeColor: Color.Builder.format('string').hexString('#808080').build(),
          backgroundColor: Color.Builder.format('string').hexString('#000000').build(),
          spot: Spot.Builder.build(),
          brightness: 0,
          contrast: 0
        };
      }

      /**
       * @param {string} str 
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {object} o A Spot input object
       */
      spot(o) {
        this.args.spot = o;
        return this;
      }

      /**
       * @param {number} n 
       */
      brightness(n) {
        this.args.brightness = n;
        return this;
      }

      /**
       * @param {number} n 
       */
      contrast(n) {
        this.args.contrast = n;
        return this;
      }

      /**
       * @param {Color} color A Color input obect. 
       */
      backgroundColor(color) {
        this.args.backgroundColor = color;
        return this;
      }

      /**
       * @param {number} n 
       */
      egde(n) {
        this.args.edge = n;
        return this;
      }

      /**
       * @param {Color} color A Color input obect. 
       */
      edgeColor(color) {
        this.args.edgeColor = color;
        return this;
      }

      /**
       * @param {string} str The output location.
       */
      dest(str) {
        this.args.dest = str;
        return this;
      }

      build() {
        return new ShapeAbstraction(this);
      }
    }

    return new Builder();
  }

  /**
   * 
   * @param {string} dest 
   */
  Render() {
    return new Promise((resolve, reject) => {
      Spotify(this.args.source, this.args, this.args.dest).then(success => {
        resolve();
      }).catch(error => reject(`Failed to render shape abstraction: ${error}`));
    });
  }


  /**
   * @override
   */
  Errors() {
    let params = ShapeAbstraction.Parameters();
    let errors = [];
    let prefix = 'SHAPE_ABSTRACTION_FX_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);


    if (this.args.spot) {
      let spotErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Spot')
        .condition(
          new Err.ObjectCondition.Builder(this.args.color)
            .typeName('Spot')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (spotErr)
        errors.push(spotErr);
    }


    if (this.args.brightness) {
      let brightnessErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Brightness')
        .condition()
        .build(
          new Err.NumberCondition.Builder(this.args.brightness)
            .min(params.brightness.min)
            .build()
        )
        .String();

      if (brightnessErr)
        errors.push(brightnessErr);
    }


    if (this.args.contrast) {
      let contrastErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Contrast')
        .condition(
          new Err.NumberCondition.Builder(this.args.contrast)
            .isInteger(true)
            .min(params.contrast.min)
            .build()
        )
        .build()
        .String();

      if (contrastErr)
        errors.push(contrastErr);
    }


    if (this.args.backgroundColor) {
      let backgroundColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Background Color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.backgroundColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (backgroundColorErr)
        errors.push(backgroundColorErr);
    }


    if (this.args.edge) {
      let edgeErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Edge')
        .condition(
          new Err.NumberCondition.Builder(this.args.edge)
            .isInteger(true)
            .min(params.edge.min)
            .build()
        )
        .build()
        .String();

      if (edgeErr)
        errors.push(edgeErr);
    }


    if (this.args.edgeColor) {
      let edgeColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Edge Color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.edgeColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (edgeColorErr)
        errors.push(edgeColorErr);
    }

    let destErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Dest')
      .condition(
        new Err.StringCondition.Builder(this.args.dest)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (destErr)
      errors.push(destErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string',
        required: true
      },
      spot: {
        type: 'Inputs.Spot',
        required: false
      },
      brightness: {
        type: 'number',
        min: 0,
        required: false
      },
      contrast: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        required: false
      },
      backgroundColor: {
        type: 'Inputs.Color',
        required: false
      },
      edge: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        required: false
      },
      edgeColor: {
        type: 'Inputs.Color',
        required: false
      },
      dest: {
        type: 'string',
        required: true
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.ShapeAbstraction = ShapeAbstraction;