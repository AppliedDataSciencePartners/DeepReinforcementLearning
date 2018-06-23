/* eslint
  no-new-func: 0
*/

'use strict'

var UNSAFE_CHARS_REGEXP = /[\\\r\n\t<>\u2028\u2029"/]/g
var CHARS_REGEXP = /[\\\r\n\t"]/g

var UNICODE_CHARS = {
  '"': '\\"',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\\': '\\\\',
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
}

function safeString (str) {
  str = str.replace(UNSAFE_CHARS_REGEXP, function (unsafeChar) {
    return UNICODE_CHARS[unsafeChar]
  })
  return str
}
exports.safeString = safeString

function unsafeString (str) {
  str = str.replace(CHARS_REGEXP, function (unsafeChar) {
    return UNICODE_CHARS[unsafeChar]
  })
  return str
}
exports.unsafeString = unsafeString

var isArray = exports.isArray = Array.isArray
exports.isArray = isArray

function isString (arg) {
  return typeof arg === 'string'
}
exports.isString = isString

function isNull (arg) {
  return arg === null
}
exports.isNull = isNull

function isRegExp (re) {
  return isObject(re) && objectToString(re) === '[object RegExp]'
}
exports.isRegExp = isRegExp

function isObject (arg) {
  return typeof arg === 'object' && arg !== null
}
exports.isObject = isObject

function isDate (d) {
  return isObject(d) && objectToString(d) === '[object Date]'
}
exports.isDate = isDate

function isError (e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error)
}
exports.isError = isError

function isFunction (arg) {
  return typeof arg === 'function'
}
exports.isFunction = isFunction

function isBuffer (arg) {
  return arg instanceof Buffer
}
exports.isBuffer = isBuffer

var TYPED_ARRAYS = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array'
]

function isTypedArray (arg) {
  var type = toType(arg)
  if (TYPED_ARRAYS.indexOf(type) !== -1) {
    return type
  }
}
exports.isTypedArray = isTypedArray

function objectToString (o) {
  return Object.prototype.toString.call(o)
}

function toType (o) {
  return objectToString(o).replace(/^\[object (.*)\]$/, '$1')
}
