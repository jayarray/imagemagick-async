//---------------------------------
// DIRECTION FIELD

class DirectionField {
  constructor(equation) {
    this.equation = equation;
  }

  Evaluate(x, y) {
    // Substitute x variables
    let substitutionStr = '';
    substitutionStr = this.Substitute_(this.equation, 'x', x);
    substitutionStr = this.Substitute_(substitutionStr, 'y', y);
    return eval(substitutionStr);
  }

  Substitute_(string, subStr, replacementStr) {
    // Count occurences
    let count = 0;
    let index = string.indexOf(subStr);
    while (index >= 0) {
      count += 1;
      index = string.indexOf(subStr, index + 1);
    }

    // Substitute occurences
    let substituteStr = string;
    for (let i = 0; i < count; ++i) {
      substituteStr = substituteStr.replace(subStr, replacementStr);
    }

    return substituteStr;
  }

  static Create(equation) {
    if (!equation)
      return null;
    return new DirectionField(equation);
  }
}

//---------------------------------
// EXPORTS

exports.CreateDirectionField = DirectionField.Create;