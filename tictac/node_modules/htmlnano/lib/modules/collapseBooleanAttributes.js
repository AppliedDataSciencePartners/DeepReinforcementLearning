'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = collapseBooleanAttributes;
// Source: https://github.com/kangax/html-minifier/issues/63
var booleanAttributes = ['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare', 'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'readonly', 'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'truespeed', 'typemustmatch', 'visible'];

var booleanAttributesIndex = {};
booleanAttributes.forEach(function (attributeName) {
    return booleanAttributesIndex[attributeName] = true;
});

function collapseBooleanAttributes(tree) {
    tree.match({ attrs: true }, function (node) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.keys(node.attrs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var attrName = _step.value;

                if (booleanAttributesIndex[attrName]) {
                    node.attrs[attrName] = true;
                }
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

        return node;
    });

    return tree;
}