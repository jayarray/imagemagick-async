const VALUES = ["Center", "East", "North", "NorthEast", "NorthWest", "South", "SouthEast", "SouthWest", "West"];

//--------------------------
// EXPORTS

exports.VALUES = VALUES;

exports.Name = 'Gravity';
exports.ComponentType = 'import specific';
exports.Specific = [
  { name: 'VALUES', obj: VALUES }
];