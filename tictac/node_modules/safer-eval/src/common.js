'use strict'

const clones = require('clones')

const hasWindow = (typeof window !== 'undefined')
exports.hasWindow = hasWindow

const hasGlobal = (typeof global !== 'undefined')
exports.hasGlobal = hasGlobal

/**
* create a fresh context where nearly nothing is allowed
* @private
*/
exports.createContext = function () {
  // protection might not be complete!
  const context = {
    // disallowed
    global: undefined,
    process: undefined,
    module: undefined,
    require: undefined,
    document: undefined,
    window: undefined,
    Window: undefined,
    // no evil...
    eval: undefined,
    Function: undefined
  }

  // locally define all potential global vars
  if (hasGlobal) {
    Object.keys(global).forEach(function (key) {
      context[key] = undefined
    })
    cloneFunctions(context)
    context.Buffer = _protect('Buffer')
    context.console = clones(console, console) // console needs special treatment
  }
  if (hasWindow) {
    Object.keys(window).forEach(function (key) {
      context[key] = undefined
    })

    cloneFunctions(context)
    protectBuiltInObjects(context)
    context.console = clones(console, console) // console needs special treatment
    context.Object.constructor.constructor = 'function () {}'
  }

  return context
}

/**
* Apply allowed context properties
* @private
*/
exports.allow = function (context, newContext) {
  Object.keys(context || {}).forEach(function (key) {
    newContext[key] = context[key] // this is harmful - objects can be overwritten
  })
}

/**
* clone global functions
* @private
*/
function cloneFunctions (context) {
  ;[
    'clearImmediate',
    'clearInterval',
    'clearTimeout'
  ].forEach((str) => {
    try {
      let fn = new Function(`return ${str}`)() // eslint-disable-line no-new-func
      context[str] = fn
        ? function () {
          return fn.apply(null, [].slice.call(arguments))
        }
        : undefined
    } catch (e) {}
  })

  ;[
    'setImmediate',
    'setInterval',
    'setTimeout'
  ].forEach((str) => {
    try {
      let fn = new Function(`return ${str}`)() // eslint-disable-line no-new-func
      context[str] = fn
        ? function (f) {
          if (typeof f === 'function') {
            return fn.apply(null, [].slice.call(arguments))
          } else {
            throw new Error(str + ' requires function as argument')
          }
        }
        : undefined
    } catch (e) {}
  })
}

/**
* wraps up build-in objects using a cloned copy
* protect object against overwriting
* @private
*/
function protectBuiltInObjects (context) {
  ;[
    'Object',
    // 'Object.constructor.constructor',
    'Boolean',
    'Symbol',
    'Error',
    'EvalError',
    'InternalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError',
    'Number',
    'Math',
    'Date',
    'String',
    'RegExp',
    'Array',
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'Atomics',
    'DataView',
    'JSON',
    'Promise',
    'Generator',
    'GeneratorFunction',
    'Reflect',
    'Proxy',
    'Intl',
    'Buffer'
  ].forEach((str) => {
    try {
      context[str] = _protect(str)
      new context[str]() // eslint-disable-line no-new
    } catch (e) {
    }
  })
}

/**
* @private
*/
function _protect (str) {
  try {
    let type = new Function(`return ${str}`)() // eslint-disable-line no-new-func
    return type
      ? clones.classes(type)
      : undefined
  } catch (e) {}
}
