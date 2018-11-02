const VALUES = ["Background", "None", "Previous", "Undefined"];

//----------------------------
// EXPORTS

exports.VALUES = VALUES;

exports.Name = 'Dispose';
exports.ComponentType = 'import specific';
exports.Specific = [
  { name: 'VALUES', obj: VALUES }
];