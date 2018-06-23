'use strict';

let loadEnv = (() => {
  var _ref = _asyncToGenerator(function* (filepath) {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const dotenvFiles = [`.env.${NODE_ENV}.local`, `.env.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && '.env.local', '.env'].filter(Boolean);

    yield Promise.all(dotenvFiles.map((() => {
      var _ref2 = _asyncToGenerator(function* (dotenvFile) {
        const envPath = yield config.resolve(filepath, [dotenvFile]);
        if (envPath) {
          dotenv.config({ path: envPath });
        }
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })()));
  });

  return function loadEnv(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const config = require('./config');
const dotenv = require('dotenv');

module.exports = loadEnv;