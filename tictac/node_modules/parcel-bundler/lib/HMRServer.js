'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const prettyError = require('./utils/prettyError');
const generateCertificate = require('./utils/generateCertificate');
const getCertificate = require('./utils/getCertificate');
const logger = require('./Logger');

class HMRServer {
  start(options = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield new Promise((() => {
        var _ref = _asyncToGenerator(function* (resolve) {
          if (!options.https) {
            _this.server = http.createServer();
          } else if (typeof options.https === 'boolean') {
            _this.server = https.createServer(generateCertificate(options));
          } else {
            _this.server = https.createServer((yield getCertificate(options.https)));
          }

          _this.wss = new WebSocket.Server({ server: _this.server });
          _this.server.listen(options.hmrPort, resolve);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      _this.wss.on('connection', function (ws) {
        ws.onerror = _this.handleSocketError;
        if (_this.unresolvedError) {
          ws.send(JSON.stringify(_this.unresolvedError));
        }
      });

      _this.wss.on('error', _this.handleSocketError);

      return _this.wss._server.address().port;
    })();
  }

  stop() {
    this.wss.close();
    this.server.close();
  }

  emitError(err) {
    var _prettyError = prettyError(err);

    let message = _prettyError.message,
        stack = _prettyError.stack;

    // store the most recent error so we can notify new connections
    // and so we can broadcast when the error is resolved

    this.unresolvedError = {
      type: 'error',
      error: {
        message,
        stack
      }
    };

    this.broadcast(this.unresolvedError);
  }

  emitUpdate(assets) {
    if (this.unresolvedError) {
      this.unresolvedError = null;
      this.broadcast({
        type: 'error-resolved'
      });
    }

    const containsHtmlAsset = assets.some(asset => asset.type === 'html');
    if (containsHtmlAsset) {
      this.broadcast({
        type: 'reload'
      });
    } else {
      this.broadcast({
        type: 'update',
        assets: assets.map(asset => {
          let deps = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = asset.depAssets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              let _ref2 = _step.value;

              var _ref3 = _slicedToArray(_ref2, 2);

              let dep = _ref3[0];
              let depAsset = _ref3[1];

              deps[dep.name] = depAsset.id;
            }
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

          return {
            id: asset.id,
            generated: asset.generated,
            deps: deps
          };
        })
      });
    }
  }

  handleSocketError(err) {
    if (err.error.code === 'ECONNRESET') {
      // This gets triggered on page refresh, ignore this
      return;
    }
    logger.warn(err);
  }

  broadcast(msg) {
    const json = JSON.stringify(msg);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.wss.clients[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        let ws = _step2.value;

        ws.send(json);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
}

module.exports = HMRServer;