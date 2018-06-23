/*
 * @copyright 2016- commenthol
 * @license MIT
 */

'use strict'

// dependencies
var util = require('./internal/utils')
var Ref = require('./internal/reference')

/**
 * serializes an object to javascript
 *
 * @example <caption>serializing regex, date, buffer, ...</caption>
 * var serialize = require('serialize-to-js').serialize;
 * var obj = {
 *   str: '<script>var a = 0 > 1</script>',
 *   num: 3.1415,
 *   bool: true,
 *   nil: null,
 *   undef: undefined,
 *   obj: { foo: 'bar' },
 *   arr: [1, '2'],
 *   regexp: /^test?$/,
 *   date: new Date(),
 *   buffer: new Buffer('data'),
 * }
 * console.log(serialize(obj))
 * // > {str: "\u003Cscript\u003Evar a = 0 \u003E 1\u003C\u002Fscript\u003E", num: 3.1415, bool: true, nil: null, undef: undefined, obj: {foo: "bar"}, arr: [1, "2"], regexp: /^test?$/, date: new Date("2016-04-15T16:22:52.009Z"), buffer: new Buffer('ZGF0YQ==', 'base64')}
 *
 * @example <caption>serializing while respecting references</caption>
 * var serialize = require('serialize-to-js').serialize;
 * var obj = { object: { regexp: /^test?$/ } };
 * obj.reference = obj.object;
 * var opts = { reference: true };
 * console.log(serialize(obj, opts));
 * //> {object: {regexp: /^test?$/}}
 * console.log(opts.references);
 * //> [ [ '.reference', '.object' ] ]
 *
 * @param {Object|Array|Function|Any} source - source to serialize
 * @param {Object} [opts] - options
 * @param {Boolean} opts.ignoreCircular - ignore circular objects
 * @param {Boolean} opts.reference - reference instead of a copy (requires post-processing of opts.references)
 * @param {Boolean} opts.unsafe - do not escape chars `<>/`
 * @return {String} serialized representation of `source`
 */
function serialize (source, opts) {
  var out = ''
  var key
  var tmp
  var type
  var i

  opts = opts || {}
  if (!opts._visited) {
    opts._visited = []
  }
  if (!opts._refs) {
    opts.references = []
    opts._refs = new Ref(opts.references)
  }

  if (util.isNull(source)) {
    out += 'null'
  } else if (util.isArray(source)) {
    tmp = source.map(function (item) {
      return serialize(item, opts)
    })
    out += '[' + tmp.join(', ') + ']'
  } else if (util.isFunction(source)) {
    out += source.toString()
  } else if (util.isObject(source)) {
    if (util.isRegExp(source)) {
      out += source.toString()
    } else if (util.isDate(source)) {
      out += 'new Date("' + source.toJSON() + '")'
    } else if (util.isError(source)) {
      out += 'new Error(' + (source.message ? '"' + source.message + '"' : '') + ')'
    } else if (util.isBuffer(source)) {
      // check for buffer first otherwise tests fail on node@4.4
      // looks like buffers are accidentially detected as typed arrays
      out += "Buffer.from('" + source.toString('base64') + "', 'base64')"
    } else if ((type = util.isTypedArray(source))) {
      tmp = []
      for (i = 0; i < source.length; i++) {
        tmp.push(source[i])
      }
      out += 'new ' + type + '(' +
        '[' + tmp.join(', ') + ']' +
        ')'
    } else {
      tmp = []
      // copy properties if not circular
      if (!~opts._visited.indexOf(source)) {
        opts._visited.push(source)
        for (key in source) {
          if (source.hasOwnProperty(key)) {
            if (opts.reference && util.isObject(source[key])) {
              opts._refs.push(key)
              if (!opts._refs.hasReference(source[key])) {
                tmp.push(Ref.wrapkey(key) + ': ' + serialize(source[key], opts))
              }
              opts._refs.pop()
            } else {
              tmp.push(Ref.wrapkey(key) + ': ' + serialize(source[key], opts))
            }
          }
        }
        out += '{' + tmp.join(', ') + '}'
        opts._visited.pop()
      } else {
        if (opts.ignoreCircular) {
          out += '{/*[Circular]*/}'
        } else {
          throw new Error('can not convert circular structures.')
        }
      }
    }
  } else if (util.isString(source)) {
    out += '"' + (opts.unsafe ? util.unsafeString(source) : util.safeString(source)) + '"'
  } else {
    out += '' + source
  }
  return out
}
module.exports = serialize
