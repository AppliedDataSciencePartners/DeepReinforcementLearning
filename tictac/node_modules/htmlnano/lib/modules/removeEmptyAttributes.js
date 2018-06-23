'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = removeEmptyAttributes;
// Source: https://www.w3.org/TR/html4/sgml/dtd.html#events (Generic Attributes)
var safeToRemoveAttrs = ['id', 'class', 'style', 'title', 'lang', 'dir', 'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onkeypress', 'onkeydown', 'onkeyup'];

/** Removes empty attributes */
function removeEmptyAttributes(tree) {
    tree.walk(function (node) {
        if (!node.attrs) {
            return node;
        }

        Object.keys(node.attrs).forEach(function (attrName) {
            var attrNameLower = attrName.toLowerCase();
            if (safeToRemoveAttrs.indexOf(attrNameLower) === -1) {
                return;
            }

            var attrValue = node.attrs[attrName];
            if (attrValue === '' || (attrValue || '').match(/^\s+$/)) {
                delete node.attrs[attrName];
            }
        });

        return node;
    });

    return tree;
}