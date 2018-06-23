'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = collapseWhitespace;

var _helpers = require('../helpers');

var noWhitespaceCollapseElements = ['script', 'style', 'pre', 'textarea'];

/** Collapses redundant whitespaces */
function collapseWhitespace(tree, options, collapseType) {
    if (collapseType !== 'conservative' && collapseType !== 'all') {
        collapseType = 'conservative';
    }

    tree.forEach(function (node, index) {
        if (typeof node === 'string' && !(0, _helpers.isComment)(node)) {
            node = collapseRedundantWhitespaces(node, collapseType, tree.walk !== undefined);
        }

        var isAllowCollapseWhitespace = noWhitespaceCollapseElements.indexOf(node.tag) === -1;
        if (node.content && node.content.length && isAllowCollapseWhitespace) {
            node.content = collapseWhitespace(node.content, options, collapseType);
        }

        tree[index] = node;
    });

    return tree;
}

function collapseRedundantWhitespaces(text, collapseType) {
    var isTopLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    text = text && text.length > 0 ? text.replace(/\s+/g, ' ') : '';
    if (collapseType === 'all' || isTopLevel) {
        text = text.trim();
    }

    return text;
}