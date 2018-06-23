'use strict';

let getCertificate = (() => {
  var _ref = _asyncToGenerator(function* (options) {
    try {
      let cert = yield fs.readFile(options.cert);
      let key = yield fs.readFile(options.key);
      return { key, cert };
    } catch (err) {
      throw new Error('Certificate and/or key not found');
    }
  });

  return function getCertificate(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('./fs');

module.exports = getCertificate;