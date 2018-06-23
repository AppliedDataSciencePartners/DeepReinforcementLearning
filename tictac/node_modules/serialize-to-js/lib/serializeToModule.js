/*
 * @copyright 2016- commenthol
 * @license MIT
 */

'use strict'

// dependencies
var serialize = require('./serialize')

/**
 * serialize to a module which can be `require`ed.
 *
 * @example <caption>serializing while respecting references</caption>
 * var serialTM = require('serialize-to-js').serializeToModule;
 * var obj = { object: { regexp: /^test?$/ } };
 * obj.reference = obj.object;
 * console.log(serialTM(obj, { reference: true }));
 * //> var m = module.exports = {
 * //>   object: {
 * //>     regexp: /^test?$/
 * //>   }
 * //> }
 * //> m.reference = m.object
 *
 * @param {Object|Array|Function|Any} source - source to serialize
 * @param {Object} [opts] - options
 * @param {Boolean} opts.ignoreCircular - ignore circular objects
 * @param {Boolean} opts.reference - reference instead of a copy (requires post-processing of opts.references)
 * @param {Boolean} opts.comment - add a comments - useful for linting tools e.g. using 'eslint-disable'
 * @param {Boolean|Object} opts.beautify - beautify output - default is `false`. If Object then use je-beautify options.
 * @param {Boolean} opts.unsafe - do not escape chars `<>/`
 * @return {String} serialized representation of `source` as module
 */
function serializeToModule (source, opts) {
  opts = opts || {}
  var out = ''
  if (opts.reference) {
    opts.references = []
  }
  if (opts.comment) {
    out = '/* ' + opts.comment + ' */\n'
  }
  out += (opts.references ? 'var m = ' : '') +
    'module.exports = ' +
    serialize(source, opts) +
    ';\n'
  if (opts.references) {
    opts.references.forEach(function (i) {
      out += 'm' + i[0] + ' = m' + i[1] + ';\n'
    })
  }
  if (opts.beautify !== false) {
    var beautify = require('js-beautify').js_beautify
    if (typeof opts.beautify !== 'object') {
      opts.beautify = {
        indent_size: 2,
        indent_char: ' '
      }
    }
    out = beautify(out, opts.beautify)
  }

  return out
}
module.exports = serializeToModule
