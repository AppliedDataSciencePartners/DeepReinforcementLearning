import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'batchNormalization': {
            return [tfc.batchNormalization(getParamValue('x', node, tensorMap, context), getParamValue('mean', node, tensorMap, context), getParamValue('variance', node, tensorMap, context), getParamValue('epsilon', node, tensorMap, context), getParamValue('scale', node, tensorMap, context), getParamValue('offset', node, tensorMap, context))];
        }
        case 'localResponseNormalization': {
            return [tfc.localResponseNormalization(getParamValue('x', node, tensorMap, context), getParamValue('radius', node, tensorMap, context), getParamValue('bias', node, tensorMap, context), getParamValue('alpha', node, tensorMap, context), getParamValue('beta', node, tensorMap, context))];
        }
        case 'softmax': {
            return [tfc.softmax(getParamValue('x', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'normalization';
//# sourceMappingURL=normalization_executor.js.map