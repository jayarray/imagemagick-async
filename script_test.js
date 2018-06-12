let SCRIPT = require('./script.js');
let PATH = require('path');

//----------------------------

let dir = '/home/isa/Downloads';

let filepath = PATH.join(dir, 'drawtest.txt');

SCRIPT.Execute(filepath).then(success => {
  console.log('Success :-)');
}).catch(error => {
  console.log(`ERROR: ${error}`);
});