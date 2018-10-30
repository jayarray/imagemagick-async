//------------------------------
// COLOR

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

let Color = {
  RGB_CHARS: RGB_CHARS,
  RGB1_LENGTH: RGB1_LENGTH,
  RGB2_LENGTH: RGB2_LENGTH,
  RGBA2_LENGTH: RGBA2_LENGTH,
  RGB4_LENGTH: RGB4_LENGTH,
  RGBA4_LENGTH: RGBA4_LENGTH,
  RGB_MIN: RGB_MIN,
  RGB_8_BIT_MAX: RGB_8_BIT_MAX,
  RGB_16_BIT_MAX: RGB_16_BIT_MAX,
  PERCENT_MIN: PERCENT_MIN,
  PERCENT_MAX: PERCENT_MAX
};

exports.Color = Color;

//-----------------------------------
// DISPOSE

let Dispose = ["Background", "None", "Previous", "Undefined"];
exports.Dispose = Dispose;

//-------------------------------------
// GRAVITY

let Gravity = ["Center", "East", "North", "NorthEast", "NorthWest", "South", "SouthEast", "SouthWest", "West"];
exports.Gravity = Gravity;

//----------------------------

exports.Name = 'Constants';
exports.ComponentType = 'multi'
exports.Multi = [
  { name: 'Color', obj: Color },
  { name: 'Dispose', obj: Dispose },
  { name: 'Gravity', obj: Gravity }
];
