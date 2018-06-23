'use strict';

let loadPlugin = (() => {
  var _ref4 = _asyncToGenerator(function* (plugin, relative, options) {
    if (typeof plugin === 'string') {
      plugin = yield localRequire(plugin, relative);
      plugin = plugin.default || plugin;

      if (typeof options !== 'object') {
        options = {};
      }

      if (Object.keys(options).length > 0) {
        plugin = plugin(options);
      }

      plugin = plugin.default || plugin;
    }

    return plugin;
  });

  return function loadPlugin(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const localRequire = require('./localRequire');

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (plugins, relative) {
    if (Array.isArray(plugins)) {
      return yield Promise.all(plugins.map((() => {
        var _ref2 = _asyncToGenerator(function* (p) {
          return yield loadPlugin(p, relative);
        });

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      })()).filter(Boolean));
    } else if (typeof plugins === 'object') {
      let mapPlugins = yield Promise.all(Object.keys(plugins).map((() => {
        var _ref3 = _asyncToGenerator(function* (p) {
          return yield loadPlugin(p, relative, plugins[p]);
        });

        return function (_x4) {
          return _ref3.apply(this, arguments);
        };
      })()));
      return mapPlugins.filter(Boolean);
    } else {
      return [];
    }
  });

  function loadPlugins(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return loadPlugins;
})();