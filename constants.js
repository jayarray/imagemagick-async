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

const CANVAS_NAMES = [
  'ColorCanvas',
  'GradientCanvas',
  'ImageCanvas'
];

const FX_NAMES = [
  'Swirl',
  'Implode',
  'Wave',
  'Blur',
  'OilPainting',
  'CharcoalSketch',
  'ColoringBookSketch',
  'PencilSketch'
];

const MOD_NAMES = [
  'Add',
  'AutoLevel',
  'ChangedPixels',
  'ChannelAdjust',
  'Colorize',
  'Compare',
  'Composite',
  'Crop',
  'CutOut',
  'CutIn',
  'Difference',
  'Exclusion',
  'GrayscaleFormat',
  'Intersection',
  'MirrorHorizontal',
  'MirrorVertical',
  'MultiplyBlackTransparency',
  'MultiplyWhiteTransparency',
  'Negate',
  'Offset',
  'Replace',
  'ResizeFillGivenArea',
  'ResizeIgnoreAspectRatio',
  'ResizeOnlyEnlargeSmaller',
  'ResizeOnlyShrinkLarger',
  'ResizePercentage',
  'ResizePixelCountLimit',
  'RgbFormat',
  'Roll',
  'RotateAroundCenter',
  'RotateAroundPoint',
  'RotateImage',
  'Subtract',
  'Transparency',
  'Transpose',
  'Transverse',
  'UnchangedPixels',
  'Union'
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

exports.CANVAS_NAMES = CANVAS_NAMES;
exports.FX_NAMES = FX_NAMES;
exports.MOD_NAMES = MOD_NAMES;
exports.MIN_WIDTH = MIN_WIDTH;
exports.MIN_HEIGHT = MIN_HEIGHT;
exports.DISPOSE_VALUES = DISPOSE_VALUES;
exports.GRAVITY_VALUES = GRAVITY_VALUES;
exports.CONSOLIDATED_EFFECTS = CONSOLIDATED_EFFECTS;
