(function () {
  'use strict';

  var pathToKey = function (path, alt) {
    if (path.length === 0) {
      return '';
    }
    var s = '';
    for (var i = 0, l = path.length; i < l; i++) {
      if (isString(path[i]) && path[i]) {
        s += (s ? '.' : '') + escapeKey(path[i]);
      } else if (isNumber(path[i])) {
        if (!alt) {
          s += (s ? '.' : '') + '[' + path[i] + ']';
        }
      } else {
        return false;
      }
    }
    return s ? s : false;
  };

  var genErrMsg = function (path, msg) {
    return (pathToKey(path) || '<root>') + ': ' + msg;
  };

  var typeOf = function (obj) {
    return Object.prototype.toString.call(obj);
  };
  typeOf.Boolean = typeOf(false);
  typeOf.String = typeOf('');
  typeOf.Number = typeOf(0);
  typeOf.Array = typeOf([]);
  typeOf.Date = typeOf(new Date(0));

  var isBoolean = function (obj) {
    return obj === true || obj === false;
  };
  var isString = function (obj) {
    return typeof obj === 'string';
  };
  var isNumber = function (obj) {
    return typeof obj === 'number';
  };
  var isArray = Array.isArray || function (obj) {
    return typeOf(obj) === typeOf.Array;
  };
  var isDate = function (obj) {
    return typeOf(obj) === typeOf.Date;
  };
  var isTable = function (obj) {
    return obj !== null && typeof obj === 'object' &&
        !(isArray(obj) || isDate(obj));
  };

  var isMixedTypeArray = function (arr) {
    if (arr.length < 2) {
      return false;
    }
    var type = typeOf(arr[0]);
    for (var i = 1, l = arr.length; i < l; i++) {
      if (arr[i] != null && typeOf(arr[i]) !== type) {
        return true;
      }
    }
    return false;
  };

  var containArrays = function (arr) {
    if (arr.length < 1) {
      return false;
    }
    for (var i = 0, l = arr.length; i < l; i++) {
      if (isArray(arr[i])) {
        return true;
      }
    }
    return false;
  };

  var containTables = function (arr) {
    if (arr.length < 1) {
      return false;
    }
    for (var i = 0, l = arr.length; i < l; i++) {
      if (isTable(arr[i])) {
        return true;
      }
    }
    return false;
  };

  var hasOwnProperty = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var isCircular = function (obj) {
    var isCircular_ = function (obj, stack) {
      if (!(isArray(obj) || isTable(obj))) {
        return false;
      }
      if (stack.indexOf(obj) !== -1) {
        return true;
      }
      stack.push(obj);
      for (var k in obj) {
        if (hasOwnProperty(obj, k)) {
          var size = stack.length;
          var ret = isCircular_(obj[k], stack);
          if (ret) {
            return true;
          }
          stack.splice(size);
        }
      }
      return false;
    };
    return isCircular_(obj, []);
  };

  var escapeBoolean = function (context, key, obj) {
    return obj ? 'true' : 'false';
  };
  var escapeString = function (context, key, obj) {
    if (typeof JSON === 'object' && JSON) {
      return JSON.stringify(obj);
    }
    return '"' + String(obj).replace(/[\x00-\x1F"\\]/g, function (c) {
      switch (c) {
        case '"': case '\\': return '\\' + c;
        case '\t': return '\\t';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\b': return '\\b';
        case '\f': return '\\f';
        default:
          var hex = c.charCodeAt(0).toString(16);
          return '\\u' + '0000'.substr(hex.length) + hex;
      }
    }) + '"';
  };
  var escapeNumber = function (context, key, obj) {
    if (!isFinite(obj)) {
      throw new Error(genErrMsg(context.path, 'Number must be finite.'));
    }
    // Cast everything to floats due to [0, 0.0]!  Even 9223372036854775807.3
    // is an integer, and 9223372036854775807 is equal to 9223372036854776832.
    // We should use strings to store big integers.
    var s;
    if (Number.isInteger ? Number.isInteger(obj) : Math.floor(obj) === obj) {
      s = obj.toFixed(1);
    } else {
      s = String(obj);
    }
    s = s.replace(/([eE])(\d)/, '$1+$2');
    return /[.eE]/.test(s) ? s : s + '.0';
  };
  var escapeArray = function (context, key, obj) {
    if (isMixedTypeArray(obj)) {
      throw new Error(genErrMsg(context.path,
            'Array cannot contain values of different types.'));
    }
    var table = context.table;
    context.table = obj;
    var lines = [];
    var inPair = context.inPair;
    if (containTables(obj)) {
      context.inPair = true;
    }
    for (var i = 0, l = obj.length; i < l; i++) {
      context.path.push(i);
      var valueText = escapeValue_(context, i, obj[i]);
      if (isString(valueText)) {
        lines.push(valueText);
      }
      context.path.pop();
    }
    context.inPair = inPair;
    context.table = table;
    if (!context.inPair && lines.length > 0 && context.space) {
      return '[\n' + indent(lines.join(',\n'), 1, context.space) + '\n]';
    }
    return '[' + lines.join(', ') + ']';
  };
  var escapeDate = function (context, key, obj) {
    if (!isFinite(obj.getTime())) {
      throw new Error(genErrMsg(context.path, 'Invalid Date'));
    }
    return obj.toISOString();
  };
  var escapeInlineTable = function (context, key, obj) {
    var table = context.table;
    context.table = obj;
    var inPair = context.inPair;
    context.inPair = true;
    var lines = [];
    var keys = Object.keys(obj);
    if (context.sort) {
      keys.sort(context.sort);
    }
    for (var i = 0, l = keys.length; i < l; i++) {
      var k = keys[i];
      if (hasOwnProperty(obj, k) && obj[k] != null) {
        if (!k) {
          throw new Error(
              genErrMsg(context.path, 'Key cannot be an empty string.'));
        }
        context.path.push(k);
        var valueText = escapeValue_(context, k, obj[k]);
        if (isString(valueText)) {
          lines.push(escapeKey(k) + ' = ' + valueText);
        }
        context.path.pop();
      }
    }
    context.inPair = inPair;
    context.table = table;
    return '{' + lines.join(', ') + '}';
  };

  var escapeValue_ = function (context, key, obj) {
    if (context.replace) {
      var valueText = context.replace.call(wrapContext(context), key, obj);
      if (isString(valueText)) {
        return valueText;
      } else if (valueText == null) {
        return null;
      } else if (valueText !== false) {
        throw new Error(genErrMsg(context.path,
              'Replacer must return a string, false, null or undefined.'));
      }
    }
    switch (typeOf(obj)) {
      case typeOf.Boolean:
        return escapeBoolean(context, key, obj);
      case typeOf.String:
        return escapeString(context, key, obj);
      case typeOf.Number:
        return escapeNumber(context, key, obj);
      case typeOf.Array:
        return escapeArray(context, key, obj);
      case typeOf.Date:
        return escapeDate(context, key, obj);
      default:
        if (obj == null) {
          return null;
        }
        return escapeInlineTable(context, key, obj);
    }
  };
  var escapeValue = function (obj, opts) {
    return escapeValue_({
      path: [],
      table: {'': obj},
      inPair: false,
      inTableArray: false,
      sort: opts.sort,
      replace: opts.replace,
      level: 0,
      space: toSpace(opts.space)
    }, '', obj);
  };

  var escapeKey = function (key) {
    if (!key) {
      return false;
    }
    return /^[a-zA-Z0-9\-_]+$/.test(key) ? key : escapeString(null, null, key);
  };
  var escapeKeyValue = function (context, key, obj) {
    var tKey = escapeKey(key);
    if (!tKey) {
      throw new Error(
          genErrMsg(context.path, 'Key cannot be an empty string.'));
    }
    var tValue = escapeValue_(context, key, obj);
    if (isString(tValue)) {
      return tKey + ' = ' + tValue;
    }
    return null;
  };

  var wrapContext = function (context) {
    return {
      path: context.path.slice(0),
      table: context.table
    };
  };

  var getReplacement = function (context, key, obj) {
    if (context.replace) {
      var valueText = context.replace.call(wrapContext(context), key, obj);
      if (isString(valueText)) {
        return escapeKey(key) + ' = ' + valueText;
      } else if (valueText == null) {
        return null;
      } else if (valueText !== false) {
        throw new Error(genErrMsg(context.path,
              'Replacer must return a string, false, null or undefined.'));
      }
    }
    return false;
  };

  var traverse = function (context, key, obj, callback) {
    var line;
    if (context.replace && context.path.length === 0) {
      line = getReplacement(context, key, obj);
      if (isString(line)) {
        context.lines.push(line);
      }
      if (line !== false) {
        return;
      }
    }
    if (callback(context, key, obj)) {
      return;
    }
    var table = context.table;
    context.table = obj;
    if (isArray(obj)) {
      var inTableArray = context.inTableArray;
      context.inTableArray = containTables(obj);
      for (var i = 0, l = obj.length; i < l; i++) {
        context.path.push(i);
        traverse(context, i, obj[i], callback);
        context.path.pop();
      }
      context.inTableArray = inTableArray;
    } else if (isTable(obj)) {
      var inTableArray = context.inTableArray;
      context.inTableArray = false;
      var tables = [];
      var keys = Object.keys(obj);
      if (context.sort) {
        keys.sort(context.sort);
      }
      for (var i = 0, l = keys.length; i < l; i++) {
        var k = keys[i];
        if (hasOwnProperty(obj, k)) {
          var v = obj[k];
          var toIndent = context.path.length > 0 &&
              (isArray(v) ? containTables(v) : isTable(v));
          if (isArray(v) && containTables(v)) {
            tables.push([true, k, v, toIndent]);
          } else if (isTable(v)) {
            tables.push([false, k, v, toIndent]);
          } else {
            context.path.push(k);
            traverse(context, k, v, callback);
            context.path.pop();
          }
        }
      }
      keys = null;
      if (context.replace) {
        for (var i = 0, l = tables.length; i < l; i ++) {
          var table = tables[i];
          if (!table[0]) {
            context.path.push(table[1]);
            line = getReplacement(context, table[1], table[2]);
            if (line !== false) {
              if (isString(line)) {
                context.lines.push(indent(line, context.level, context.space));
              }
              table[2] = null;
            }
            context.path.pop();
          } else {
            context.path.push(table[1]);
            line = getReplacement(context, table[1], table[2]);
            if (line !== false) {
              if (isString(line)) {
                context.lines.push(indent(line, context.level, context.space));
              }
              table[2] = null;
              context.path.pop();
              continue;
            }
            var subTables = table[2];
            for (var j = 0, k = subTables.length; j < k; j++) {
              var subTable = subTables[j];
              context.path.push(j);
              line = getReplacement(context, j, subTable);
              context.path.pop();
              if (line !== false) {
                if (line == null) {
                  subTables[j] = null;
                  continue;
                }
                line = escapeKeyValue(context, table[1], table[2]);
                if (isString(line)) {
                  context.lines.push(indent(line, context.level, context.space));
                }
                table[2] = null;
                break;
              }
            }
            context.path.pop();
          }
        }
      }
      for (var i = 0, l = tables.length; i < l; i++) {
        var table = tables[i];
        if (table[2] == null) {
          continue;
        }
        context.path.push(table[1]);
        if (table[3]) {
          context.level++;
        }
        traverse(context, table[1], table[2], callback);
        if (table[3]) {
          context.level--;
        }
        context.path.pop();
      }
      context.inTableArray = inTableArray;
    }
    context.table = table;
  };

  var repeatString = function (str, n) {
    if (str.repeat) {
      return str.repeat(n);
    }
    var s = '';
    var c = '';
    while (n > 0) {
      c += c || str;
      if (n & 1) {
        s += c;
      }
      n >>>= 1;
    }
    return s;
  };

  var indent = function (str, level, space) {
    var padding = repeatString(space, level);
    return str.replace(/^(?!$)/mg, padding);
  };

  var toSpace = function (space) {
    if (isString(space)) {
      return space;
    } else if (isNumber(space) && space >= 0 && isFinite(space) &&
        Math.floor(space) === space) {
      return repeatString(' ', space);
    }
    return '';
  };

  var check = function (obj, opts) {
    if (obj == null) {
      throw new Error('Undefined or null cannot be stringified.');
    }
    if (isCircular(obj)) {
      throw new Error('Converting circular structure to TOML.');
    }
    if (opts != null && typeof opts !== 'object') {
      throw new Error('Options must be an object.');
    }
    // @type {function(this: Context, key: String|Number, value: Mixed): Mixed}
    if (opts.replace != null && typeof opts.replace !== 'function') {
      throw new Error('Replacer must be a function.');
    }
    // @type {function(a: String, b: String): Number}
    if (opts.sort != null && typeof opts.sort !== 'function') {
      throw new Error('Compare function for sorting must be a function.');
    }
  };

  var escapeTable = function (table, opts) {
    var lines = [];
    var callback = function (context, key, obj) {
      var line = null;
      if (isTable(obj)) {
        if (key !== '') {
          if (lines.length > 0) {
            lines.push('');
          }
          if (!context.inTableArray) {
            line = '[' + pathToKey(context.path, true) + ']';
          } else {
            line = '[[' + pathToKey(context.path, true) + ']]';
          }
          lines.push(indent(line, context.level, context.space));
        }
      } else if (isArray(obj)) {
        if (isString(key)) {
          if (!containTables(obj)) {
            line = escapeKeyValue(context, key, obj);
            if (isString(line)) {
              lines.push(indent(line, context.level, context.space));
            }
          }
        } else {
          return true;
        }
      } else {
        if (isString(key)) {
          line = escapeKeyValue(context, key, obj);
          if (isString(line)) {
            lines.push(indent(line, context.level, context.space));
          }
        }
        return true;  // Always return true.
      }
    };
    traverse({
      path: [],
      table: {'': table},
      inPair: false,
      inTableArray: false,
      replace: opts.replace,
      sort: opts.sort,
      level: 0,
      space: toSpace(opts.space),
      lines: lines  // So special...
    }, '', table, callback);
    return lines.join('\n');
  };

  var tomlify = {};

  tomlify.toToml = function (table, opts) {
    if (!isTable(table)) {
      throw new Error('An object other than Array or Date is expected.');
    }
    opts = opts != null ? opts : {};
    check(table, opts);
    return escapeTable(table, opts);
  };

  tomlify.toKey = function (path, alt) {
    if (isString(path)) {
      var key = escapeKey(path);
      if (!key) {
        throw new Error('Key cannot be an empty string.');
      }
      return key;
    } else if (isArray(path)) {
      var key = pathToKey(path, alt);
      if (key === false) {
        throw new Error('Key path must consist of non-empty string(s).');
      }
      return key;
    }
    throw new Error('Invalid Arguments for tomlify.toKey({String | Array})');
  };

  tomlify.toValue = function (obj, opts) {
    opts = opts != null ? opts : {};
    check(obj, opts);
    return escapeValue(obj, opts);
  };

  if ((typeof module !== 'undefined' && module !== null ? module.exports : void 0) != null) {
    module.exports = tomlify;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return tomlify;
    });
  } else {
    this.tomlify = tomlify;
  }
}).call(this);
