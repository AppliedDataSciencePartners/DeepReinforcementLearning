'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = minifyCss;

var _cssnano = require('cssnano');

var _cssnano2 = _interopRequireDefault(_cssnano);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Minify CSS with cssnano */
function minifyCss(tree, options, cssnanoOptions) {
    var promises = [];
    tree.walk(function (node) {
        if (node.tag === 'style' && node.content && node.content.length) {
            promises.push(processStyleNode(node, cssnanoOptions));
        } else if (node.attrs && node.attrs.style) {
            promises.push(processStyleAttr(node, cssnanoOptions));
        }

        return node;
    });

    return Promise.all(promises).then(function () {
        return tree;
    });
}

function processStyleNode(styleNode, cssnanoOptions) {
    return _cssnano2.default.process(Array.isArray(styleNode.content) ? styleNode.content.join(' ') : styleNode.content, cssnanoOptions).then(function (result) {
        return styleNode.content = [result.css];
    });
}

function processStyleAttr(node, cssnanoOptions) {
    // CSS "color: red;" is invalid. Therefore it should be wrapped inside some selector:
    // a{color: red;}
    var wrapperStart = 'a{';
    var wrapperEnd = '}';
    var wrappedStyle = wrapperStart + (node.attrs.style || '') + wrapperEnd;

    return _cssnano2.default.process(wrappedStyle, cssnanoOptions).then(function (result) {
        var minifiedCss = result.css;
        // Remove wrapperStart at the start and wrapperEnd at the end of minifiedCss
        node.attrs.style = minifiedCss.substring(wrapperStart.length, minifiedCss.length - wrapperEnd.length);
    });
}