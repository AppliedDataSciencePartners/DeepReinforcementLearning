import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue, getTensor } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'const': {
            return tensorMap[node.name];
        }
        case 'placeholder':
            var def = getParamValue('default', node, tensorMap, context);
            return [getTensor(node.name, tensorMap, context) || def];
        case 'identity':
        case 'stopGradient':
        case 'fakeQuantWithMinMaxVars':
            return [getParamValue('x', node, tensorMap, context)];
        case 'snapshot':
            var snapshot = getParamValue('x', node, tensorMap, context);
            return [snapshot.clone()];
        case 'shape':
            return [tfc.tensor1d(getParamValue('x', node, tensorMap, context).shape, 'int32')];
        case 'size':
            return [tfc.scalar(getParamValue('x', node, tensorMap, context).size, 'int32')];
        case 'rank':
            return [tfc.scalar(getParamValue('x', node, tensorMap, context).rank, 'int32')];
        case 'noop':
            return [];
        case 'print':
            var input = getParamValue('x', node, tensorMap, context);
            var data = getParamValue('data', node, tensorMap, context);
            var message = getParamValue('message', node, tensorMap, context);
            var summarize = getParamValue('summarize', node, tensorMap, context);
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
export var CATEGORY = 'graph';
//# sourceMappingURL=graph_executor.js.map