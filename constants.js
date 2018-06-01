const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;

const DISPOSE_VALUES = [
  'Undefined',
  'None',
  'Previous',
  'Background'
];

const GRAVITY_VALUES = [
  'Northwest',
  'Northeast',
  'North',
  'Southwest',
  'Southeast',
  'South',
  'West',
  'East'
];

const CONSOLIDATED_EFFECTS =
  [
    'Negate',
    'Colorize',
    'GrayscaleFormat',
    'RgbFormat',
    'Replace',
    'AutoLevel',
    'Swirl',
    'Implode',
    'Wave',
    'Blur',
    'OilPainting',
    'CharcoalSketch',
    'Roll',
    'MirrorHorizontal',
    'MirrorVertical',
    'Transpose',
    'Transverse',
    'Offset',
    'RotateAroundCenter',
    'RotateAroundPoint',
    'ResizeIgnoreAspectRatio',
    'ResizeOnlyShrinkLarger',
    'ResizeOnlyEnlargeSmaller',
    'ResizeFillGivenArea',
    'ResizePercentage',
    'ResizePixelCountLimit'
  ];

//------------------------------
// EXPORTS

exports.MIN_WIDTH = MIN_WIDTH;
exports.MIN_HEIGHT = MIN_HEIGHT;
exports.DISPOSE_VALUES = DISPOSE_VALUES;
exports.GRAVITY_VALUES = GRAVITY_VALUES;
exports.CONSOLIDATED_EFFECTS = CONSOLIDATED_EFFECTS;
