import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'matMul':
            return [tfc.matMul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context), getParamValue('transposeA', node, tensorMap, context), getParamValue('transposeB', node, tensorMap, context))];
        case 'transpose':
            return [tfc.transpose(getParamValue('x', node, tensorMap, context), getParamValue('perm', node, tensorMap, context))];
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'matrices';
//# sourceMappingURL=matrices_executor.js.map