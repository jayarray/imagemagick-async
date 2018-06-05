const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;

const DISPOSE_VALUES = [
  'Background',
  'None',
  'Previous',
  'Undefined'
];

const GRAVITY_VALUES = [
  'East',
  'North',
  'Northeast',
  'Northwest',
  'South',
  'Southeast',
  'Southwest',
  'West'
];

const CONSOLIDATED_EFFECTS =
  [
    'AutoLevel',
    'Blur',
    'CharcoalSketch',
    'Colorize',
    'GrayscaleFormat',
    'Implode',
    'MirrorHorizontal',
    'MirrorVertical',
    'Negate',
    'Offset',
    'OilPainting',
    'Replace',
    'ResizeFillGivenArea',
    'ResizeIgnoreAspectRatio',
    'ResizeOnlyShrinkLarger',
    'ResizeOnlyEnlargeSmaller',
    'ResizePixelCountLimit',
    'ResizePercentage',
    'RgbFormat',
    'Roll',
    'RotateAroundCenter',
    'RotateAroundPoint',
    'Swirl',
    'Transpose',
    'Transverse',
    'Wave'
  ];

//------------------------------
// EXPORTS

exports.MIN_WIDTH = MIN_WIDTH;
exports.MIN_HEIGHT = MIN_HEIGHT;
exports.DISPOSE_VALUES = DISPOSE_VALUES;
exports.GRAVITY_VALUES = GRAVITY_VALUES;
exports.CONSOLIDATED_EFFECTS = CONSOLIDATED_EFFECTS;
