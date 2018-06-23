'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mergeScripts;
/* Merge multiple <script> into one */
function mergeScripts(tree) {
    var scriptNodesIndex = {};

    tree.match({ tag: 'script' }, function (node) {
        var nodeAttrs = node.attrs || {};
        if (nodeAttrs.src) {
            return node;
        }

        var scriptType = nodeAttrs.type || 'text/javascript';
        if (scriptType !== 'text/javascript' && scriptType !== 'application/javascript') {
            return node;
        }

        var scriptKey = JSON.stringify({
            id: nodeAttrs.id,
            class: nodeAttrs.class,
            type: scriptType,
            defer: nodeAttrs.defer !== undefined,
            async: nodeAttrs.async !== undefined
        });
        if (!scriptNodesIndex[scriptKey]) {
            scriptNodesIndex[scriptKey] = [];
        }

        scriptNodesIndex[scriptKey].push(node);
        return node;
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var scriptKey = _step.value;

            var scriptNodes = scriptNodesIndex[scriptKey];
            var lastScriptNode = scriptNodes.pop();
            scriptNodes.reverse().forEach(function (scriptNode) {
                var scriptContent = (scriptNode.content || []).join(' ');
                lastScriptNode.content.unshift(scriptContent + ' ');

                scriptNode.tag = false;
                scriptNode.content = [];
            });
        };

        for (var _iterator = Object.keys(scriptNodesIndex)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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

    return tree;
}