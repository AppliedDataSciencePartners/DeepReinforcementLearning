'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const opn = require('opn');

const openInBrowser = (() => {
  var _ref = _asyncToGenerator(function* (url, browser) {
    try {
      const options = typeof browser === 'string' ? { app: browser } : undefined;

      yield opn(url, options);
    } catch (err) {
      console.error(`Unexpected error while opening in browser: ${browser}`);
      console.error(err);
    }
  });

  return function openInBrowser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = openInBrowser;