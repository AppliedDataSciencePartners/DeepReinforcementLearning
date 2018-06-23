import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue, split } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'cast': {
            return [tfc.cast(getParamValue('x', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
        }
        case 'expandDims': {
            var axis = node.params['axis'].value;
            return [tfc.expandDims(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'squeeze': {
            var axis = node.params['axis'].value;
            return [tfc.squeeze(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'reshape': {
            return [tfc.reshape(getParamValue('x', node, tensorMap, context), getParamValue('shape', node, tensorMap, context))];
        }
        case 'pad': {
            return [tfc.pad(getParamValue('x', node, tensorMap, context), split(getParamValue('padding', node, tensorMap, context), 2), getParamValue('constantValue', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'transformation';
//# sourceMappingURL=transformation_executor.js.map