'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Packager = require('./Packager');

class CSSPackager extends Packager {
  addAsset(asset) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let css = asset.generated.css || '';

      // Figure out which media types this asset was imported with.
      // We only want to import the asset once, so group them all together.
      let media = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = asset.parentDeps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let dep = _step.value;

          if (!dep.media) {
            // Asset was imported without a media type. Don't wrap in @media.
            media.length = 0;
            break;
          } else {
            media.push(dep.media);
          }
        }

        // If any, wrap in an @media block
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (media.length) {
        css = `@media ${media.join(', ')} {\n${css.trim()}\n}\n`;
      }

      yield _this.write(css);
    })();
  }
}

module.exports = CSSPackager;