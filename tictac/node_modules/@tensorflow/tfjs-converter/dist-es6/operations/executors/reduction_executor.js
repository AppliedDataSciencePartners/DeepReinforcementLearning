import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'max': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfc.max(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'mean': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfc.mean(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'min': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfc.min(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'sum': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfc.sum(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'argMax': {
            var axis = getParamValue('axis', node, tensorMap, context);
            return [tfc.argMax(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'argMin': {
            var axis = getParamValue('axis', node, tensorMap, context);
            return [tfc.argMin(getParamValue('x', node, tensorMap, context), axis)];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'reduction';
//# sourceMappingURL=reduction_executor.js.map