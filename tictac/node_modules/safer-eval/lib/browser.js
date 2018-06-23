/**
* @copyright 2017 Commenthol
* @license MIT
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./common'),
    createContext = _require.createContext,
    allow = _require.allow;

/**
* reuse saferEval context
* @class
* @example
* const {SaferEval} = require('safer-eval')
* const safer = new SaferEval()
* let res1 = safer.runInContext('new Date('1970-01-01')')
* let res2 = safer.runInContext('new Date('1970-07-01')')
*/


var SaferEval = function () {
  /**
  * @param {Object} [context] - allowed context
  */
  function SaferEval(context) {
    _classCallCheck(this, SaferEval);

    // define disallowed objects in context
    var __context = createContext();
    // apply "allowed" context vars
    allow(context, __context);

    this._context = __context;
  }

  /**
  * @param {String} code - a string containing javascript code
  * @return {Any} evaluated code
  */


  _createClass(SaferEval, [{
    key: 'runInContext',
    value: function runInContext(code) {
      if (typeof code !== 'string') {
        throw new TypeError('not a string');
      }
      var __context = this._context;

      var src = '';
      // set local scope vars from each context property
      Object.keys(__context).forEach(function (key) {
        src += 'var ' + key + ' = __context[\'' + key + '\'];\n';
      });
      src += 'return ' + code + ';\n';

      return Function('__context', src).call(null, __context); // eslint-disable-line
    }
  }]);

  return SaferEval;
}();

/**
* A safer approach for eval. (Browser)
*
* This might not be as safe as the nodeJs version as there is no real sandboxing
* available in the browser.
*
* **Warning: This function might be harmful - so you are warned!**
*
* `context` allows the definition of passed in Objects into the sandbox.
* Take care, injected `code` can overwrite those passed context props!
* Check the tests under "harmful context"!
*
* @static
* @throws Error
* @param {String} code - a string containing javascript code
* @param {Object} [context] - define globals, properties for evaluation context
* @param {Object} [opts] - options
* @param {Object} [opts.freeze=true] - freeze all native objects
* @return {Any} evaluated code
* @example
* var code = `{d: new Date('1970-01-01'), b: function () { return navigator.userAgent }`
* var res = saferEval(code, {navigator: window.navigator})
* // => toString.call(res.d) = '[object Date]'
* // => toString.call(res.b) = '[object Function]'
*/


function saferEval(code, context) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new SaferEval(context).runInContext(code);
}

module.exports = saferEval;
module.exports.SaferEval = SaferEval;