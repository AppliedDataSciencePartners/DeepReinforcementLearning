import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'equal': {
            return [tfc.equal(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'notEqual': {
            return [tfc.notEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'greater': {
            return [tfc.greater(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'greaterEqual': {
            return [tfc.greaterEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'less': {
            return [tfc.less(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'lessEqual': {
            return [tfc.lessEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'logicalAnd': {
            return [tfc.logicalAnd(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'logicalNot': {
            return [tfc.logicalNot(getParamValue('a', node, tensorMap, context))];
        }
        case 'logicalOr': {
            return [tfc.logicalOr(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'where': {
            return [tfc.where(getParamValue('condition', node, tensorMap, context), getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'logical';
//# sourceMappingURL=logical_executor.js.map