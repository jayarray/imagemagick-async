let Validate = require('./validate.js');

//------------------------------

class StringCondition {
  constructor(builder) {
    this.conditionType_ = builder.conditionType_;
    this.value_ = builder.value_;
    this.isEmpty_ = builder.isEmpty_;
    this.isWhitespace_ = builder.isWhitespace_;
    this.isAlpha_ = builder.isAlpha_;
    this.isNumeric_ = builder.isNumeric_;
    this.isAlphaNumeric_ = builder.isAlphaNumeric_;
    this.length_ = builder.length_;
    this.minLength_ = builder.minLength_;
    this.maxLength_ = builder.maxLength_;
    this.startsWith_ = builder.startsWith_;
    this.endsWith_ = builder.endsWith_;
    this.contains_ = builder.contains_;
    this.include_ = builder.include_;
    this.exclude_ = builder.exclude_;
  }

  static get Builder() {
    class Builder {
      constructor(str) {
        this.conditionType_ = 'string';
        this.value_ = str;
      }

      length(n) {
        this.length_ = n;
        return this;
      }

      minLength(n) {
        this.minLength_ = n;
        return this;
      }

      maxLength(n) {
        this.maxLength_ = n;
        return this;
      }

      startsWith(str) {
        this.startsWith_ = str;
        return this;
      }

      endsWith(str) {
        this.endsWith_ = str;
        return this;
      }

      /**
       * @param {string} str Specify what substring can be found in the string.
       */
      contains(str) {
        this.contains_ = str;
        return this;
      }

      /**
       * @param {Array<string>} arr Specify which strings to include as valid inputs. 
       */
      include(arr) {
        this.include_ = arr;
        return this;
      }

      /**
       * @param {Array<string>} arr Specify which strings exclude as valid inputs. 
       */
      exclude(arr) {
        this.exclude_ = arr;
        return this;
      }

      /**
       * Specify if the string is expected to be empty.
       * @param {boolean} bool 
       */
      isEmpty(bool) {
        this.isEmpty_ = bool;
        return this;
      }

      isWhitespace(bool) {
        this.isWhitespace_ = bool;
        return this;
      }

      /**
       * Specify if the string only contains letters.
       * @param {boolean} bool 
       */
      isAlpha(bool) {
        this.isAlpha_ = bool;
        return this;
      }

      /**
       * Specify if the string only contains numbers.
       * @param {boolean} bool 
       */
      isNumeric(bool) {
        this.isNumeric_ = bool;
        return this;
      }

      /**
       * Specify if the string contains any number of letters and numbers.
       * @param {boolean} bool 
       */
      isAlphaNumeric(bool) {
        this.isAlphaNumeric_ = bool;
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
    this.conditionType_ = builder.conditionType_;
    this.isTrue_ = builder.isTrue_;
    this.isFalse_ = builder.isFalse_;
    this.value_ = builder.value_;
  }

  static get Builder() {
    class Builder {
      constructor(bool) {
        this.conditionType_ = 'boolean';
        this.value_ = bool;
      }

      /**
       * Specify if the boolean is expected to be true.
       * @param {boolean} bool 
       */
      isTrue(bool) {
        this.isTrue_ = bool;
        return this;
      }

      /**
       * Specify if the boolean is expected to be false.
       * @param {boolean} bool 
       */
      isFalse(bool) {
        this.isFalse_ = bool;
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
    this.conditionType_ = builder.conditionType_;
    this.value_ = builder.conditionType_;
    this.include_ = builder.include_;
    this.exclude_ = builder.exclude_;
    this.contains_ = builder.contains_;
    this.doesNotContain_ = builder.doesNotContain_;
    this.operation_ = builder.operations_;
    this.validType_ = builder.validType_;
    this.operations_ = builder.operations_;
    this.minLength_ = builder.minLength_;
    this.maxLength_ = builder.maxLength_;
  }

  static get Builder() {
    class Builder {
      constructor(arr) {
        this.conditionType_ = 'array';
        this.value_ = arr;
        this.operations_ = [];
        this.contains_ = [];
        this.doesNotContain_ = [];
      }

      /**
       * Specify which objects can be included as valid inputs.
       * @param {Array} arr 
       */
      include(arr) {
        this.include_ = arr;
        return this;
      }

      /**
       * Specify which objects to exclude as valid inputs.
       * @param {Array} arr 
       */
      exclude(arr) {
        this.exclude_ = arr;
        return this;
      }

      contains(item) {
        this.contains_.push(item);
        return this;
      }

      doesNotContain(item) {
        this.doesNotContain_.push(item);
        return this;
      }

      /**
       * Specify the type of object the array should hold. 
       * @param {string} type 
       */
      validType(type) {
        this.validType_ = type;
        return this;
      }

      minLength(n) {
        this.minLength_ = n;
        return this;
      }

      maxLength(n) {
        this.maxLength_ = n;
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
    this.conditionType_ = builder.conditionType_;
    this.value_ = builder.value_;
    this.include_ = builder.include_;
    this.exclude_ = builder.exclude_;
    this.typeName_ = builder.typeName_;
  }

  static get Builder() {
    class Builder {
      constructor(obj) {
        this.type_ = 'object';
        this.value_ = obj;
      }

      /**
       * Specify what properties are expected to be fond in the object.
       * @param {Array<string>} arr List of property names.
       */
      include(arr) {
        this.include_ = arr;
        return this;
      }

      /**
       * Specify what properties are to be excluded in the object.
       * @param {Array<string>} arr List of property names.
       */
      exclude(arr) {
        this.exclude_ = arr;
        return this;
      }

      /**
       * Specify the type name of the object. (Use with user-defined objects that have a property called 'type').
       * @param {string} name 
       */
      typeName(name) {
        this.type_ = name;
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
    this.conditionType_ = builder.conditionType_;
    this.value_ = builder.value_;
    this.include_ = builder.include_;
    this.exclude_ = builder.exclude_;
    this.min_ = builder.min_;
    this.max_ = builder.max_;
    this.isInteger_ = builder.isInteger_;
    this.isFloat_ = builder.isFloat_;
    this.operations_ = builder.operations_;
  }

  static get Builder() {
    class Builder {
      constructor(number) {
        this.conditionType_ = 'number';
        this.value_ = number;
        this.operations_ = [];
      }

      /**
       * Specify what values are acceptable as input.
       * @param {Array<number>} arr 
       */
      include(arr) {
        this.include_ = arr;
        return this;
      }

      /**
       * Specify what values are excluded as input.
       * @param {Array<number>} arr 
       */
      exclude(arr) {
        this.exclude_ = arr;
        return this;
      }

      min(n) {
        this.min_ = n;
        return this;
      }

      max(n) {
        this.max_ = n;
        return this;
      }

      /**
       * Specify is the number is expected to be an integer.
       * @param {boolean} bool 
       */
      isInteger(bool) {
        this.isInteger_ = bool;
        return this;
      }

      /**
       * Specify is the number is expected to be an float.
       * @param {boolean} bool 
       */
      isFloat(bool) {
        this.isFloat_ = bool;
        return this;
      }

      lessThan(value) {
        this.operations_.push({
          name: 'lt',
          value: value,
          ok: this.value_ < value
        });

        return this;
      }

      lessThanEqualTo(value) {
        this.operations_.push({
          name: 'lte',
          value: value,
          ok: this.value_ <= value
        });

        return this;
      }

      greaterThan(value) {
        this.operations_.push({
          name: 'gt',
          value: value,
          ok: this.value_ > value
        });

        return this;
      }

      greaterThanEqualTo(value) {
        this.operations_.push({
          name: 'gte',
          value: value,
          ok: this.value_ >= value
        });

        return this;
      }

      equalTo(value) {
        this.operations_.push({
          name: 'eq',
          value: value,
          ok: this.value_ == value
        });

        return this;
      }

      notEqualTo(value) {
        this.operations_.push({
          name: 'notEq',
          value: value,
          ok: this.value_ != value
        });

        return this;
      }

      build() {
        return new NumberCondition(this);
      }
    }
    return Builder;
  }
}

//---------------------------

class ErrorMessage {
  constructor(builder) {
    this.prefix_ = builder.prefix_;
    this.varName_ = builder.varName_;
    this.conditions_ = builder.conditions_;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.prefix_ = null;
        this.varName_ = null;
        this.conditions_ = [];
      }

      /**
       * Specify the string that begins your error message.
       * @param {string} str 
       */
      prefix(str) {
        this.prefix_ = str;
        return this;
      }

      /**
       * Specify the name of the variable you are checking.
       * @param {string} str 
       */
      varName(str) {
        this.varName_ = str;
        return this;
      }

      /**
       * Specify a condition to be met.
       * @param {Condition} c 
       */
      condition(c) {
        this.conditions_.push(c);
        return this;
      }

      build() {
        return new ErrorMessage(this);
      }
    }
    return Builder;
  }

  StringError(strCond) {
    let s1 = this.prefix_ ? `${this.prefix_}: ` : '';
    let s2 = this.varName_ ? this.varName_ : 'String';

    if (!Validate.IsDefined(strCond.value_)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsString(strCond.value_)) {
      s2 += ' is not a string.';
      return s1 + s2;
    }

    if (Validate.IsDefined(strCond.isEmpty_)) {
      if (strCond.isEmpty_) {
        if (!Validate.IsEmptyString(strCond.value_)) {
          s2 += ' is non-empty. Must be empty string.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsEmptyString(strCond.value_)) {
          s2 += ' is empty. Cannot be empty string.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.isWhitespace_)) {
      if (strCond.isWhitespace_) {
        if (!Validate.IsWhitespace(strCond.value_)) {
          s2 += ' is not whitespace. Must be whitespace string.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsWhitespace(strCond.value_)) {
          s2 += ' is whitespace. Cannot be whitespace string.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.isAlphaNumeric_)) {
      if (strCond.isAlphaNumeric_) {
        if (!Validate.IsAlphaNumeric(strCond.value_)) {
          s2 += ' is non-alphanumeric. Must be alphanumeric.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsAlphaNumeric(strCond.value_)) {
          s2 += ' is alphanumeric. Cannot be alphanumeric.';
        }
      }
    }

    if (Validate.IsDefined(strCond.isAlpha_)) {
      if (strCond.isAlpha_) {
        if (!Validate.IsAlphaString(strCond.value_)) {
          s2 += ' is not alpha. Must be alpha.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsAlphaString(strCond.value_)) {
          s2 += ' is alpha. Cannot be alpha.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.isNumeric_)) {
      if (strCond.isNumeric_) {
        if (!Validate.IsNumericString(strCond.value_)) {
          s2 += ' is not numeric. Must be numeric.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsAlphaString(strCond.value_)) {
          s2 += ' is numeric. Cannot be numeric.';
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.length_)) {
      if (strCond.length_) {
        if (strCond.value_.length != strCond.length_) {
          s2 += ` is invalid length. Current length is: ${strCond.value_.length}. Length must be equal to ${strCond.length_}.`;
        }
      }
    }

    if (Validate.IsDefined(strCond.minLength_) || Validate.IsDefined(strCond.maxLength_)) {
      if (strCond.minLength_ || strCond.maxLength_) {
        if (strCond.minLength_ && strCond.maxLength_) {
          if (strCond.value_.length < strCond.minLength_ || strCond.value_.length > strCond.maxLength_) {
            s2 += ` is invalid length. Length must be between ${strCond.minLength_} to ${strCond.maxLength_}.`;
            return s1 + s2;
          }
        }
        else if (strCond.minLength_) {
          if (strCond.value_.length < strCond.minLength_) {
            s2 += ` is invalid length. Current length is: ${strCond.value_.length}. Length must be greater than or equal to ${strCond.minLength_}.`;
            return s1 + s2;
          }
        }
        else if (strCond.maxLength_) {
          if (strCond.value_.length < strCond.maxLength_) {
            s2 += ` is invalid length. Current length is: ${strCond.value_.length}. Length must equal to or less than ${strCond.maxLength_}.`;
            return s1 + s2;
          }
        }
      }
    }

    if (Validate.IsDefined(strCond.startsWith_) || Validate.IsDefined(strCond.endsWith_)) {
      if (strCond.startsWith_ || strCond.endsWith_) {
        if (strCond.startsWith_ && strCond.endsWith_) {
          if (!strCond.value_.startsWith(strCond.startsWith_) || !strCond.value_.endsWith(strCond.endsWith_)) {
            s2 += ` is invalid. String must start with: ${strCond.startsWith_}, and end with: ${strCond.endsWith_}.`;
            return s1 + s2;
          }
        }
        else if (strCond.startsWith_) {
          if (strCond.value_.startsWith(strcond.startsWith_)) {
            s2 += ` is invalid. String must start with: ${strCond.startsWith_}.`;
            return s1 + s2;
          }
        }
        else if (strCond.endsWith_) {
          if (strCond.value_.endsWith(strcond.endsWith_)) {
            s2 += ` is invalid. String must end with: ${strCond.endsWith_}.`;
            return s1 + s2;
          }
        }
      }
    }

    if (Validate.IsDefined(strCond.contains_)) {
      if (!strCond.value_.includes(strCond.contains_)) {
        s2 += ` is invalid. String does not contain the following substring: ${strCond.contains}.`;
        return s1 + s2;
      }
    }

    if (Validate.IsDefined(strCond.include_)) {
      if (strCond.include_.length > 0) {
        if (!strCond.include_.includes(strCond.value_)) {
          s2 += ` is invalid. Must be assigned one of the following values: ${strCond.include_.join(', ')}.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(strCond.exclude_)) {
      if (strCond.exclude_.length > 0) {
        if (strCond.exclude_.includes(strCond.value_)) {
          s2 += ` is invalid. Cannot be assigned any of the following values: ${strCond.exclude_.join(', ')}.`;
          return s1 + s2;
        }
      }
    }

    return null;
  }

  NumberError(numCond) {
    let s1 = this.prefix_ ? `${this.prefix_}: ` : '';
    let s2 = this.varName_ ? this.varName_ : 'Value';

    if (!Validate.IsDefined(numCond.value_)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsNumber(numCond.value_)) {
      s2 += ' is not a number.';
      return s1 + s2;
    }

    if (Validate.IsDefined(numCond.isInteger_)) {
      if (numCond.isInteger_) {
        if (!Validate.IsInteger(numCond.value_)) {
          s2 += ' is not an integer. Must be an integer.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsInteger(numCond.value_)) {
          s2 += ` is an integer. Cannot be an integer.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(numCond.isFloat_)) {
      if (numCond.isFloat_) {
        if (!Validate.IsFloat(numCond.value_)) {
          s2 += ' is not a float. Must be a float.';
          return s1 + s2;
        }
      }
      else {
        if (Validate.IsInteger(numCond.value_)) {
          s2 += ` is a float. Cannot be a float.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(numCond.min_) || Validate.IsDefined(numCond.max_)) {
      s2 += ` is out of bounds. Assigned value is: ${numCond.value}.`;

      if (numCond.min_ && numCond.max_) {
        if (numCond.value_ < numCond.min_ || numCond.value_ > numCond.max_) {
          s2 += ` Value must be between ${numCond.min_} and ${numCond.max_}.`;
          return s1 + s2;
        }
      }
      else if (numCond.min_) {
        if (numCond.value_ < numCond.min_) {
          s2 += ` Value must be greater than or equal to ${numCond.min_}.`;
          return s1 + s2;
        }
      }
      else if (numCond.max_) {
        if (numCond.value_ > numCond.max_) {
          s2 += ` Value must be less than or equal to ${numCond.max}.`;
          return s1 + s2;
        }
      }
    }

    if (Validate.IsDefined(numCond.include_) || Validate.IsDefined(numCond.exclude_)) {
      if (!numCond.include_.includes(numCond.value_)) {
        s2 += ` is invalid. Must be assigned one of the following values: ${numCond.include_.join(', ')}.`;
        return s1 + s2;
      }

      if (numCond.exclude_.includes(numCond.value_)) {
        s2 += ` is invalid. Cannot be assigned the following values: ${numCond.exclude_.join(', ')}.`;
        return s1 + s2;
      }
    }

    if (Validate.IsDefined(numCond.operations_)) {
      if (numCond.operations_.length > 0) {
        s2 += ` is out of bounds. Value`;

        for (let i = 0; i < numCond.operations_.length; ++i) {
          let currOp = numCond.operations_[i];

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
    let s1 = this.prefix_ ? `${this.prefix_}: ` : '';
    let s2 = this.varName_ ? this.varName_ : 'Value';

    if (Validate.IsDefined(boolCond.value_)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsBoolean(boolCond.value_)) {
      s2 += ' is not a boolean.';
      return s1 + s2;
    }

    return null;
  }

  ArrayError(arrCond) {
    let s1 = this.prefix_ ? `${this.prefix_}: ` : '';
    let s2 = this.varName_ ? this.varName_ : 'Value';

    if (!Validate.IsDefined(arrCond.value_)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (Validate.IsArray(arrCond.value_)) {
      s2 += ' is not an array.';
      return s1 + s2;
    }

    s2 = this.varName_ ? this.varName_ : 'Array';

    if (Validate.ArrayHasInvalidTypes(arrCond.value_, arrCond.validType_)) {
      s2 += ` contains items that are not ${arrCond.validType_} type .`;
      return s1 + s2;
    }

    // Check length (if applicable)
    let minLenIsValid = Validate.IsNumber(arrCond.minLength_);
    let maxLenIsValid = Validate.IsNumber(arrCond.maxLength_);

    if (minLenIsValid || maxLenIsValid) {
      s2 += ` has an invalid number of items. Current number of items is: ${arrCond.value_.length}.`;

      if (minLenIsValid && maxLenIsValid) {
        if (arrCond.value_.length < arrCond.minLength_ || arrCond.value_.length > arrCond.maxLength_) {
          s2 += ` Must have ${arrCond.minLength_} to ${arrCond.maxLength_} items.`;
          return s1 + s2;
        }
      }
      else {
        if (minLenIsValid) {
          if (arrCond.value_.length < arrCond.minLength_) {
            s2 += ` Must have ${arrCond.minLength_} or more items.`;
            return s1 + s2;
          }
        }
        else if (maxLenIsValid) {
          if (arrCond.value_.length < arrCond.maxLenIsValid_) {
            s2 += ` Must have no more than ${arrCond.maxLenIsValid_} items.`;
            return s1 + s2;
          }
        }
      }
    }
    else {
      if (objCond.include_ || objCond.contains_) {
        let include = arrCond.include_ ? arrCond.include_ : [];
        let contains = arrCond.contains_ ? arrCond.contains_ : [];
        let allIncludedItems = include.concat(contains);

        if (allIncludedItems.length > 0) {
          let notIncluded = arrCond.value_.filter(x => !allIncludedItems.includes(x));

          if (notIncluded.length > 0) {
            s2 += ` contains ${notIncluded.length} item(s) that should not be included.`;
            return s1 + s2;
          }
        }
      }

      if (objCond.exclude_ || objCond.doesNotContain_) {
        let exclude = arrCond.exclude_ ? arrCond.exclude_ : [];
        let doesNotContain = arrCond.doesNotContain_ ? arrCond.doesNotContain_ : [];
        let allExcludedItems = exclude.concat(doesNotContain);

        if (allExcludedItems.length > 0) {
          let notExcluded = arrCond.value_.filter(x => allExcludedItems.includes(x));

          if (notExcluded.length > 0) {
            s2 = this.varName_ ? this.varName_ : 'Array';
            s2 += ` contains ${notExcluded.length} item(s) that should be excluded.`;
            return s1 + s2;
          }
        }
      }
    }

    return null;
  }

  ObjectError(objCond) {
    let s1 = this.prefix_ ? `${this.prefix_}: ` : '';
    let s2 = this.varName_ ? this.varName_ : 'Value';

    if (!Validate.IsDefined(objCond.value_)) {
      s2 += ' is undefined.';
      return s1 + s2;
    }

    if (!Validate.IsObject(objCond.value_)) {
      s2 = ' is not a user-defined object.';
      return s1 + s2;
    }

    if (Validate.IsDefined(objCond.typeName_)) {
      if (objCond.value_.type != objCond.typeName_) {
        s2 += ` is not a ${objCond.typeName_} object.`;
        return s1 + s2;
      }
    }

    let propertyNames = objCond.value_ ? Object.keys(objCond.value_) : [];
    s2 = this.varName_ ? this.varName_ : 'Object';

    if (objCond.include_) {
      let include = objCond.include_ ? objCond.include_ : [];
      let notIncluded = propertyNames.filter(x => !include.includes(x));

      if (notIncluded.length > 0) {
        s2 += ` is missing the following properties: ${notIncluded.join(', ')}.`;
        return s1 + s2;
      }
    }

    if (objCond.exclude_) {
      let exclude = objCond.exclude_ ? objCond.exclude_ : [];
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
    if (this.conditions_.length > 0) {
      for (let i = 0; i < this.conditions_.length; ++i) {
        let currCond = this.conditions_[i];

        let error = null;

        if (currCond.conditionType_ == 'string')
          error = this.StringError(currCond);
        else if (currCond.conditionType_ == 'number')
          error = this.NumberError(currCond);
        else if (currCond.conditionType_ == 'boolean')
          error = this.BooleanError(currCond);
        else if (currCond.conditionType_ == 'array')
          error = this.ArrayError(currCond);
        else if (currCond.conditionType_ == 'object')
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
exports.ErrorMessage = ErrorMessage;