'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const promisify = require('../utils/promisify');
const path = require('path');

var _require = require('../utils/fs');

const mkdirp = _require.mkdirp;


class Packager {
  constructor(bundle, bundler) {
    this.bundle = bundle;
    this.bundler = bundler;
    this.options = bundler.options;
  }

  setup() {
    var _this = this;

    return _asyncToGenerator(function* () {
      // Create sub-directories if needed
      if (_this.bundle.name.includes(path.sep)) {
        yield mkdirp(path.dirname(_this.bundle.name));
      }

      _this.dest = fs.createWriteStream(_this.bundle.name);
      _this.dest.write = promisify(_this.dest.write.bind(_this.dest));
      _this.dest.end = promisify(_this.dest.end.bind(_this.dest));
    })();
  }

  write(string) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.dest.write(string);
    })();
  }

  start() {
    return _asyncToGenerator(function* () {})();
  }

  // eslint-disable-next-line no-unused-vars
  addAsset(asset) {
    return _asyncToGenerator(function* () {
      throw new Error('Must be implemented by subclasses');
    })();
  }

  getSize() {
    return this.dest.bytesWritten;
  }

  end() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3.dest.end();
    })();
  }
}

module.exports = Packager;