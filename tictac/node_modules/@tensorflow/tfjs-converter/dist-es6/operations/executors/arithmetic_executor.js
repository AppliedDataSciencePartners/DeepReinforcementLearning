import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'add': {
            return [tfc.add(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'mod':
            return [tfc.mod(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        case 'mul':
            return [tfc.mul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        case 'div': {
            return [tfc.div(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'floorDiv': {
            return [tfc.floorDiv(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'sub': {
            return [tfc.sub(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'minimum': {
            return [tfc.minimum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'maximum': {
            return [tfc.maximum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'pow': {
            return [tfc.pow(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'squaredDifference': {
            return [tfc.squaredDifference(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'arithmetic';
//# sourceMappingURL=arithmetic_executor.js.map