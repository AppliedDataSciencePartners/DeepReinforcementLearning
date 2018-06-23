'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _posthtml = require('posthtml');

var _posthtml2 = _interopRequireDefault(_posthtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Array of all enabled modules
var defaultOptions = {
    removeComments: 'safe',
    removeEmptyAttributes: true,
    removeRedundantAttributes: false,
    collapseWhitespace: 'conservative',
    collapseBooleanAttributes: true,
    mergeStyles: true,
    mergeScripts: true,
    minifyCss: {
        safe: true
    },
    minifyJs: {},
    minifyJson: {},
    minifySvg: {},
    custom: []
};

function htmlnano() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return function minifier(tree) {
        options = (0, _objectAssign2.default)({}, defaultOptions, options);
        var promise = Promise.resolve(tree);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var moduleName = _step.value;

                if (!options[moduleName]) {
                    // The module is disabled
                    return 'continue';
                }

                if (defaultOptions[moduleName] === undefined) {
                    throw new Error('Module "' + moduleName + '" is not defined');
                }

                var module = require('./modules/' + moduleName);
                promise = promise.then(function (tree) {
                    return module.default(tree, options, options[moduleName]);
                });
            };

            for (var _iterator = Object.keys(options)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ret = _loop();

                if (_ret === 'continue') continue;
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

        return promise;
    };
}

htmlnano.process = function (html, options) {
    return (0, _posthtml2.default)([htmlnano(options)]).process(html);
};

htmlnano.defaultOptions = defaultOptions;

exports.default = htmlnano;