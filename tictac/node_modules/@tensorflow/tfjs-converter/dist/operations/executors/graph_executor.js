"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'const': {
            return tensorMap[node.name];
        }
        case 'placeholder':
            var def = utils_1.getParamValue('default', node, tensorMap, context);
            return [utils_1.getTensor(node.name, tensorMap, context) || def];
        case 'identity':
        case 'stopGradient':
        case 'fakeQuantWithMinMaxVars':
            return [utils_1.getParamValue('x', node, tensorMap, context)];
        case 'snapshot':
            var snapshot = utils_1.getParamValue('x', node, tensorMap, context);
            return [snapshot.clone()];
        case 'shape':
            return [tfc.tensor1d(utils_1.getParamValue('x', node, tensorMap, context).shape, 'int32')];
        case 'size':
            return [tfc.scalar(utils_1.getParamValue('x', node, tensorMap, context).size, 'int32')];
        case 'rank':
            return [tfc.scalar(utils_1.getParamValue('x', node, tensorMap, context).rank, 'int32')];
        case 'noop':
            return [];
        case 'print':
            var input = utils_1.getParamValue('x', node, tensorMap, context);
            var data = utils_1.getParamValue('data', node, tensorMap, context);
            var message = utils_1.getParamValue('message', node, tensorMap, context);
            var summarize = utils_1.getParamValue('summarize', node, tensorMap, context);
            console.warn('The graph has a tf.print() operation,' +
                'usually used for debugging, which slows down performance.');
            console.log(message);
            for (var i = 0; i < data.length; i++) {
                console.log(Array.prototype.slice.call(data[0].dataSync()).slice(0, summarize));
            }
            return [input];
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'graph';
//# sourceMappingURL=graph_executor.js.map