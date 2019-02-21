let Validate = require('./validate.js');

//------------------------------

class StringCondition {
  constructor(builder) {
    this.conditionType = builder.conditionType;
    this.value = builder.value;
    this.isEmpty = builder.isEmpty;
    this.isWhitespace = builder.isWhitespace;
    this.isAlpha = builder.isAlpha;
    this.isNumeric = builder.isNumeric;
    this.isAlphaNumeric = builder.isAlphaNumeric;
    this.length = builder.length;
    this.minLength = builder.minLength;
    this.maxLength = builder.maxLength;
    this.startsWith = builder.startsWith;
    this.endsWith = builder.endsWith;
    this.contains = builder.contains;
    this.include = builder.include;
    this.exclude = builder.exclude;
  }

  static get Builder() {
    class Builder {
      constructor(str) {
        this.conditionType = 'string';
        this.value = str;
      }

      length(n) {
        this.length = n;
        return this;
      }

      minLength(n) {
        this.minLength = n;
        return this;
      }

      maxLength(n) {
        this.maxLength = n;
        return this;
      }

      startsWith(str) {
        this.startsWith = str;
        return this;
      }

      endsWith(str) {
        this.endsWith = str;
        return this;
      }

      /**
       * @param {string} str Specify what substring can be found in the string.
       */
      contains(str) {
        this.contains = str;
        return this;
      }

      /**
       * @param {Array<string>} arr Specify which strings to include as valid inputs. 
       */
      include(arr) {
        this.include = arr;
        return this;
      }

      /**
       * @param {Array<string>} arr Specify which strings exclude as valid inputs. 
       */
      exclude(arr) {
        this.exclude = arr;
        return this;
      }

      /**
       * Specify if the string is expected to be empty.
       * @param {boolean} bool 
       */
      isEmpty(bool) {
        this.isEmpty = bool;
        return this;
      }

      isWhitespace(bool) {
        this.isWhitespace = bool;
        return this;
      }

      /**
       * Specify if the string only contains letters.
       * @param {boolean} bool 
       */
      isAlpha(bool) {
        this.isAlpha = bool;
        return this;
      }

      /**
       * Specify if the string only contains numbers.
       * @param {boolean} bool 
       */
      isNumeric(bool) {
        this.isNumeric = bool;
        return this;
      }

      /**
       * Specify if the string contains any number of letters and numbers.
       * @param {boolean} bool 
       */
      isAlphaNumeric(bool) {
        this.isAlphaNumeric = bool;
        return this;
      }

      build() {
        return new StringCondition(this);
      }
    }
    return Builder;
  }
}

//-------------------------------

class BooleanCondition {
  constructor(builder) {
    this.conditionType = builder.conditionType;
    this.isTrue = builder.isTrue;
    this.isFalse = builder.isFalse;
    this.value = builder.value;
  }

  static get Builder() {
    class Builder {
      constructor(bool) {
        this.conditionType = 'boolean';
        this.value = bool;
      }

      /**
       * Specify if the boolean is expected to be true.
       * @param {boolean} bool 
       */
      isTrue(bool) {
        this.isTrue = bool;
        return this;
      }

      /**
       * Specify if the boolean is expected to be false.
       * @param {boolean} bool 
       */
      isFalse(bool) {
        this.isFalse = bool;
        return this;
      }

      build() {
        return new BooleanCondition(this);
      }
    }
    return Builder;
  }
}

//--------------------------------

class ArrayCondition {
  constructor(builder) {
    this.conditionType = builder.conditionType;
    this.value = builder.conditionType;
    this.include = builder.include;
    this.exclude = builder.exclude;
    this.contains = builder.contains;
    this.doesNotContain = builder.doesNotContain;
    this.operation = builder.operations;
    this.validType = builder.validType;
    this.operations = builder.operations;
    this.minLength = builder.minLength;
    this.maxLength = builder.maxLength;
  }

  static get Builder() {
    class Builder {
      constructor(arr) {
        this.conditionType = 'array';
        this.value = arr;
        this.operations = [];
        this.contains = [];
        this.doesNotContain = [];
      }

      /**
       * Specify which objects can be included as valid inputs.
       * @param {Array} arr 
       */
      include(arr) {
        this.include = arr;
        return this;
      }

      /**
       * Specify which objects to exclude as valid inputs.
       * @param {Array} arr 
       */
      exclude(arr) {
        this.exclude = arr;
        return this;
      }

      contains(item) {
        this.contains.push(item);
        return this;
      }

      doesNotContain(item) {
        this.doesNotContain.push(item);
        return this;
      }

      /**
       * Specify the type of object the array should hold. 
       * @param {string} type 
       */
      validType(type) {
        this.validType = type;
        return this;
      }

      minLength(n) {
        this.minLength = n;
        return this;
      }

      maxLength(n) {
        this.maxLength = n;
        return this;
      }

      build() {
        return new ArrayCondition(this);
      }
    }
    return Builder;
  }
}

//-------------------------------

class ObjectCondition {
  constructor(builder) {
    this.conditionType = builder.conditionType;
    this.value = builder.value;
    this.include = builder.include;
    this.exclude = builder.exclude;
  }

  static get Builder() {
    class Builder {
      constructor(obj) {
        this.type = 'object';
        this.value = obj;
      }

      /**
       * Specify what properties are expected to be fond in the object.
       * @param {Array<string>} arr List of property names.
       */
      include(arr) {
        this.include = arr;
        return this;
      }

      /**
       * Specify what properties are to be excluded in the object.
       * @param {Array<string>} arr List of property names.
       */
      exclude(arr) {
        this.exclude = arr;
        return this;
      }

      build() {
        return new ObjectCondition(this);
      }
    }
    return Builder;
  }
}

//--------------------------------

class NumberCondition {
  constructor(builder) {
    this.conditionType = builder.conditionType;
    this.value = builder.value;
    this.include = builder.include;
    this.exclude = builder.exclude;
    this.min = builder.min;
    this.max = builder.max;
    this.isInteger = builder.isInteger;
    this.isFloat = builder.isFloat;
    this.operations = builder.operations;
  }

  static get Builder() {
    class Builder {
      constructor(number) {
        this.conditionType = 'number';
        this.value = number;
        this.operations = [];
      }

      /**
       * Specify what values are acceptable as input.
       * @param {Array<number>} arr 
       */
      include(arr) {
        this.include = arr;
        return this;
      }

      /**
       * Specify what values are excluded as input.
       * @param {Array<number>} arr 
       */
      exclude(arr) {
        this.exclude = arr;
        return this;
      }

      min(n) {
        this.min = n;
        return this;
      }

      max(n) {
        this.max = n;
        return this;
      }

      /**
       * Specify is the number is expected to be an integer.
       * @param {boolean} bool 
       */
      isInteger(bool) {
        this.isInteger = bool;
        return this;
      }

      /**
       * Specify is the number is expected to be an float.
       * @param {boolean} bool 
       */
      isFloat(bool) {
        this.isFloat = bool;
        return this;
      }

      lessThan(value) {
        this.operations.push({
          name: 'lt',
          value: value,
          ok: this.value < value
        });

        return this;
      }

      lessThanEqualTo(value) {
        this.operations.push({
          name: 'lte',
          value: value,
          ok: this.value <= value
        });

        return this;
      }

      greaterThan(value) {
        this.operations.push({
          name: 'gt',
          value: value,
          ok: this.value > value
        });

        return this;
      }

      greaterThanEqualTo(value) {
        this.operations.push({
          name: 'gte',
          value: value,
          ok: this.value >= value
        });

        return this;
      }

      equalTo(value) {
        this.operations.push({
          name: 'eq',
          value: value,
          ok: this.value == value
        });

        return this;
      }

      notEqualTo(value) {
        this.operations.push({
          name: 'notEq',
          value: value,
          ok: this.value != value
        });

        return this;
      }
    }
    return Builder;
  }
}

//---------------------------

class Error {
  constructor(builder) {
    this.conditions = builder.conditions;
  }

  static get Builder() {
    class Builder {
      constructor(properties) {
        this.prefix = properties.prefix;
        this.varName = properties.varName;
        this.conditions = [];
      }

      prefix(prefix) {
        this.prefix = prefix;
        return this;
      }

      varName(varName) {
        this.varName = varName;
        return this;
      }

      condition(condition) {
        this.conditions.push(condition);
      }

      build() {
        return new Error(this);
      }
    }
    return Builder;
  }

  StringError(strCond) {
    let s1 = this.prefix ? `${this.prefix}: ` : '';
    let s2 = this.varName ? this.varName : 'String';

    if (!Validate.IsDefined(strCond.value)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsString(strCond.value)) {
      s2 += ' is not a string.';
      return s1 + s2;
    }

    if (Validate.IsDefined(strCond.isEmpty)) {
      if (strCond.isEmpty) {
        if (!Validate.IsEmptyString(strCond.value)) {
          s2 += ' is non-empty. Must be empty string.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsEmptyString(strCond.value)) {
          s2 += ' is empty. Cannot be empty string.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.isWhitespace)) {
      if (strCond.isWhitespace) {
        if (!Validate.IsWhitespace(strCond.value)) {
          s2 += ' is not whitespace. Must be whitespace string.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsWhitespace(strCond.value)) {
          s2 += ' is whitespace. Cannot be whitespace string.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.isAlphaNumeric)) {
      if (strCond.isAlphaNumeric) {
        if (!Validate.IsAlphaNumeric(strCond.value)) {
          s2 += ' is non-alphanumeric. Must be alphanumeric.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsAlphaNumeric(strCond.value)) {
          s2 += ' is alphanumeric. Cannot be alphanumeric.';
        }
      }
    }

    if (Validate.IsDefined(strCond.isAlpha)) {
      if (strCond.isAlpha) {
        if (!Validate.IsAlphaString(strCond.value)) {
          s2 += ' is not alpha. Must be alpha.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsAlphaString(strCond.value)) {
          s2 += ' is alpha. Cannot be alpha.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.isNumeric)) {
      if (strCond.isNumeric) {
        if (!Validate.IsNumericString(strCond.value)) {
          s2 += ' is not numeric. Must be numeric.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsAlphaString(strCond.value)) {
          s2 += ' is numeric. Cannot be numeric.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.length)) {
      if (strCond.length) {
        if (strCond.value.length != strCond.length) {
          s2 += ` is invalid length. Current length is: ${strCond.value.length}. Length must be equal to ${strCond.length}.`;
        }
      }
    }

    if (Validate.IsDefined(strCond.minLength) || Validate.IsDefined(strCond.maxLength)) {
      if (strCond.minLength || strCond.maxLength) {
        if (strCond.minLength && strCond.maxLength) {
          if (strCond.value.length < strCond.minLength || strCond.value.length > strCond.maxLength) {
            s2 += ` is invalid length. Length must be between ${strCond.minLength} to ${strCond.maxLength}.`;
            return s1 + s2;
          }
        }
        else if (strCond.minLength) {
          if (strCond.value.length < strCond.minLength) {
            s2 += ` is invalid length. Current length is: ${strCond.value.length}. Length must be greater than or equal to ${strCond.minLength}.`;
            return s1 + s2;
          }
        }
        else if (strCond.maxLength) {
          if (strCond.value.length < strCond.maxLength) {
            s2 += ` is invalid length. Current length is: ${strCond.value.length}. Length must equal to or less than ${strCond.maxLength}.`;
            return s1 + s2;
          }
        }
      }
    }

    if (Validate.IsDefined(strCond.startsWith) || Validate.IsDefined(strCond.endsWith)) {
      if (strCond.startsWith || strCond.endsWith) {
        if (strCond.startsWith && strCond.endsWith) {
          if (!strCond.value.startsWith(strCond.startsWith) || !strCond.value.endsWith(strCond.endsWith)) {
            s2 += ` is invalid. String must start with: ${strCond.startsWith}, and end with: ${strCond.endsWith}.`;
            return s1 + s2;
          }
        }
        else if (strCond.startsWith) {
          if (strCond.value.startsWith(strcond.startsWith)) {
            s2 += ` is invalid. String must start with: ${strCond.startsWith}.`;
            return s1 + s2;
          }
        }
        else if (strCond.endsWith) {
          if (strCond.value.endsWith(strcond.endsWith)) {
            s2 += ` is invalid. String must end with: ${strCond.endsWith}.`;
            return s1 + s2;
          }
        }
      }
    }

    if (Validate.IsDefined(strCond.contains)) {
      if (!strCond.value.includes(strCond.contains)) {
        s2 += ` is invalid. String does not contain the following substring: ${strCond.contains}.`;
        return s1 + s2;
      }
    }

    if (Validate.IsDefined(strCond.include)) {
      if (strCond.include.length > 0) {
        if (!strCond.include.includes(strCond.value)) {
          s2 += ` is invalid. Must be assigned one of the following values: ${strCond.include.join(', ')}.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.exclude)) {
      if (strCond.exclude.length > 0) {
        if (strCond.exclude.includes(strCond.value)) {
          s2 += ` is invalid. Cannot be assigned any of the following values: ${strCond.exclude.join(', ')}.`;
          return s1 + s2;
        }
      }
    }

    return null;
  }

  NumberError(numCond) {
    let s1 = this.prefix ? `${this.prefix}: ` : '';
    let s2 = this.varName ? this.varName : 'Value';

    if (!Validate.IsDefined(numCond.value)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsNumber(numCond.value)) {
      s2 += ' is not a number.';
      return s1 + s2;
    }

    if (Validate.IsDefined(numCond.isInteger)) {
      if (numCond.isInteger) {
        if (!Validate.IsInteger(numCond.value)) {
          s2 += ' is not an integer. Must be an integer.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsInteger(numCond.value)) {
          s2 += ` is an integer. Cannot be an integer.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(numCond.isFloat)) {
      if (numCond.isFloat) {
        if (!Validate.IsFloat(numCond.value)) {
          s2 += ' is not a float. Must be a float.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsInteger(numCond.value)) {
          s2 += ` is a float. Cannot be a float.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(numCond.min) || Validate.IsDefined(numCond.max)) {
      s2 += ` is out of bounds. Assigned value is: ${numCond.value}.`;

      if (numCond.min && numCond.max) {
        if (numCond.value < numCond.min || numCond.value > numCond.max) {
          s2 += ` Value must be between ${numCond.min} and ${numCond.max}.`;
          return s1 + s2;
        }
      }
      else if (numCond.min) {
        if (numCond.value < numCond.min) {
          s2 += ` Value must be greater than or equal to ${numCond.min}.`;
          return s1 + s2;
        }
      }
      else if (numCond.max) {
        if (numCond.value > numCond.max) {
          s2 += ` Value must be less than or equal to ${numCond.max}.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(numCond.include) || Validate.IsDefined(numCond.exclude)) {
      if (!numCond.include.includes(numCond.value)) {
        s2 += ` is invalid. Must be assigned one of the following values: ${numCond.include.join(', ')}.`;
        return s1 + s2;
      }

      if (numCond.exclude.includes(numCond.value)) {
        s2 += ` is invalid. Cannot be assigned the following values: ${numCond.exclude.join(', ')}.`;
        return s1 + s2;
      }
    }

    if (Validate.IsDefined(numCond.operations)) {
      if (numCond.operations.length > 0) {
        s2 += ` is out of bounds. Value `;

        for (let i = 0; i < numCond.operations.length; ++i) {
          let currOp = numCond.operations[i];

          if (!currOp.ok) {
            if (currOp.name == 'lt') {
              s2 += ` must be less than ${currOp.value}.`;
              return s1 + s2;
            }
            else if (currOp.name == 'lte') {
              s2 += ` must be less than or equal to ${currOp.value}.`;
              return s1 + s2;
            }
            else if (currOp.name == 'gt') {
              s2 += ` must be greater than ${currOp.value}.`;
              return s1 + s2;
            }
            else if (currOp.name == 'gte') {
              s2 += ` must be greater than or equal to ${currOp.value}.`;
              return s1 + s2;
            }
            else if (currOp.name == 'eq') {
              s2 += ` must be equal to ${currOp.value}.`;
              return s1 + s2;
            }
            else if (currOp.name == 'notEq') {
              s2 += ` cannot equal ${currOp.value}.`;
              return s1 + s2;
            }
          }
        }
      }
    }

    return null;
  }

  BooleanError(boolCond) {
    let s1 = this.prefix ? `${this.prefix}: ` : '';
    let s2 = this.varName ? this.varName : 'Value';

    if (Validate.IsDefined(boolCond.value)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsBoolean(boolCond.value)) {
      s2 += ' is not a boolean.';
      return s1 + s2;
    }

    return null;
  }

  ArrayError(arrCond) {
    let s1 = this.prefix ? `${this.prefix}: ` : '';
    let s2 = this.varName ? this.varName : 'Value';

    if (!Validate.IsDefined(arrCond.value)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (Validate.IsArray(arrCond.value)) {
      s2 += ' is not an array.';
      return s1 + s2;
    }

    s2 = this.varName ? this.varName : 'Array';

    if (Validate.ArrayHasInvalidTypes(arrCond.value, arrCond.validType)) {
      s2 += ` contains items that are not ${arrCond.validType} type .`;
      return s1 + s2;
    }

    // Check length (if applicable)
    let minLenIsValid = Validate.IsNumber(arrCond.minLength);
    let maxLenIsValid = Validate.IsNumber(arrCond.maxLength);

    if (minLenIsValid || maxLenIsValid) {
      s2 += ` has an invalid number of items. Current number of items is: ${arrCond.value.length}.`;

      if (minLenIsValid && maxLenIsValid) {
        if (arrCond.value.length < arrCond.minLength || arrCond.value.length > arrCond.maxLength) {
          s2 += ` Must have ${arrCond.minLength} to ${arrCond.maxLength} items.`;
          return s1 + s2;
        }
      }
      else {
        if (minLenIsValid) {
          if (arrCond.value.length < arrCond.minLength) {
            s2 += ` Must have ${arrCond.minLength} or more items.`;
            return s1 + s2;
          }
        }
        else if (maxLenIsValid) {
          if (arrCond.value.length < arrCond.maxLenIsValid) {
            s2 += ` Must have no more than ${arrCond.maxLenIsValid} items.`;
            return s1 + s2;
          }
        }
      }
    }
    else {
      if (objCond.include || objCond.contains) {
        let include = arrCond.include ? arrCond.include : [];
        let contains = arrCond.contains ? arrCond.contains : [];
        let allIncludedItems = include.concat(contains);

        if (allIncludedItems.length > 0) {
          let notIncluded = arrCond.value.filter(x => !allIncludedItems.includes(x));

          if (notIncluded.length > 0) {
            s2 += ` contains ${notIncluded.length} item(s) that should not be included.`;
            return s1 + s2;
          }
        }
      }

      if (objCond.exclude || objCond.doesNotContain) {
        let exclude = arrCond.exclude ? arrCond.exclude : [];
        let doesNotContain = arrCond.doesNotContain ? arrCond.doesNotContain : [];
        let allExcludedItems = exclude.concat(doesNotContain);

        if (allExcludedItems.length > 0) {
          let notExcluded = arrCond.value.filter(x => allExcludedItems.includes(x));

          if (notExcluded.length > 0) {
            s2 = this.varName ? this.varName : 'Array';
            s2 += ` contains ${notExcluded.length} item(s) that should be excluded.`;
            return s1 + s2;
          }
        }
      }
    }

    return null;
  }

  ObjectError(objCond) {
    let s1 = this.prefix ? `${this.prefix}: ` : '';
    let s2 = this.varName ? this.varName : 'Value';

    if (!Validate.IsDefined(objCond.value)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsObject(objCond.value)) {
      s2 = ' is not a user-made object.';
      return s1 + s2;
    }

    let propertyNames = objCond.value ? Object.keys(objCond.value) : [];
    s2 = this.varName ? this.varName : 'Object';

    if (objCond.include) {
      let include = objCond.include ? objCond.include : [];
      let notIncluded = propertyNames.filter(x => !include.includes(x));

      if (notIncluded.length > 0) {
        s2 += ` is missing the following properties: ${notIncluded.join(', ')}.`;
        return s1 + s2;
      }
    }

    if (objCond.exclude) {
      let exclude = objCond.exclude ? objCond.exclude : [];
      let notExcluded = propertyNames.filter(x => exclude.includes(x));

      if (notExcluded.length > 0) {
        s2 += ` should not have the following properties: ${notExcluded.join(', ')}.`;
        return s1 + s2;
      }
    }

    return null;
  }

  /**
   * @returns {string} Returns a string containing an error message or null if there are no errors.
   */
  String() {
    if (this.conditions.length > 0) {
      for (let i = 0; i < this.conditions.length; ++i) {
        let currCond = this.conditions[i];

        let error = null;

        if (currCond.conditionType == 'string')
          error = this.StringError(currCond);
        else if (currCond.conditionType == 'number')
          error = this.NumberError(currCond);
        else if (currCond.conditionType == 'boolean')
          error = this.BooleanError(currCond);
        else if (currCond.conditionType == 'array')
          error = this.ArrayError(currCond);
        else if (currCond.conditionType == 'object')
          error = this.ObjectError(currCond);

        if (error)
          return error;
      }
    }

    return null;
  }

}

//--------------------------
// EXPORTS

exports.StringCondition = StringCondition;
exports.NumberCondition = NumberCondition;
exports.BooleanCondition = BooleanCondition;
exports.ArrayCondition = ArrayCondition;
exports.ObjectCondition = ObjectCondition;
exports.Error = Error;