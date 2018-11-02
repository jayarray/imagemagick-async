const RGB_CHARS = ['r', 'g', 'b'];
const RGB1_LENGTH = RGB_CHARS.length;     // #rgb               (reduced, simplified notation)
const RGB2_LENGTH = RGB_CHARS.length * 2; // #rrggbb            (8-bit per channel)
const RGBA2_LENGTH = RGB2_LENGTH + 2;     // #rrggbbaa          (8-bit per channel)
const RGB4_LENGTH = RGB_CHARS.length * 4; // #rrrrggggbbbb      (16-bit per channel)
const RGBA4_LENGTH = RGB4_LENGTH + 4;     // #rrrrggggbbbbaaaa  (16-bit per channel)
const RGB_MIN = 0;
const RGB_8_BIT_MAX = 255;
const RGB_16_BIT_MAX = Math.pow(RGB_8_BIT_MAX, 2);
const PERCENT_MIN = 0;
const PERCENT_MAX = 100;

//----------------------------
// EXPORTS

exports.RGB_CHARS = RGB_CHARS;
exports.RGB1_LENGTH = RGB1_LENGTH;
exports.RGB2_LENGTH = RGB2_LENGTH;
exports.RGBA2_LENGTH = RGBA2_LENGTH;
exports.RGB4_LENGTH = RGB4_LENGTH;
exports.RGBA4_LENGTH = RGBA4_LENGTH;
exports.RGB_MIN = RGB_MIN;
exports.RGB_8_BIT_MAX = RGB_8_BIT_MAX;
exports.RGB_16_BIT_MAX = RGB_16_BIT_MAX;
exports.PERCENT_MIN = PERCENT_MIN;
exports.PERCENT_MAX = PERCENT_MAX;

//----------------------------

exports.Name = 'Color';
exports.ComponentType = 'import specific';
exports.Specific = [
  { name: 'RGB_CHARS', obj: RGB_CHARS },
  { name: 'RGB1_LENGTH', obj: RGB1_LENGTH },
  { name: 'RGB2_LENGTH', obj: RGB2_LENGTH },
  { name: 'RGBA2_LENGTH', obj: RGBA2_LENGTH },
  { name: 'RGB4_LENGTH', obj: RGB4_LENGTH },
  { name: 'RGBA4_LENGTH', obj: RGBA4_LENGTH },
  { name: 'RGB_MIN', obj: RGB_MIN },
  { name: 'RGB_8_BIT_MAX', obj: RGB_8_BIT_MAX },
  { name: 'RGB_16_BIT_MAX', obj: RGB_16_BIT_MAX },
  { name: 'PERCENT_MIN', obj: PERCENT_MIN },
  { name: 'PERCENT_MAX', obj: PERCENT_MAX }
];