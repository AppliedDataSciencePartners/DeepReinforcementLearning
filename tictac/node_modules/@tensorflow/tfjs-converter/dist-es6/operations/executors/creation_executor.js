import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'fill': {
            var shape = getParamValue('shape', node, tensorMap, context);
            var value = getParamValue('value', node, tensorMap, context);
            return [tfc.fill(shape, value)];
        }
        case 'linspace': {
            var start = getParamValue('start', node, tensorMap, context);
            var stop_1 = getParamValue('stop', node, tensorMap, context);
            var num = getParamValue('num', node, tensorMap, context);
            return [tfc.linspace(start, stop_1, num)];
        }
        case 'oneHot': {
            var indices = getParamValue('indices', node, tensorMap, context);
            var depth = getParamValue('depth', node, tensorMap, context);
            var onValue = getParamValue('onValue', node, tensorMap, context);
            var offValue = getParamValue('offValue', node, tensorMap, context);
            return [tfc.oneHot(indices, depth, onValue, offValue)];
        }
        case 'ones': {
            return [tfc.ones(getParamValue('shape', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
        }
        case 'onesLike': {
            return [tfc.onesLike(getParamValue('x', node, tensorMap, context))];
        }
        case 'randomUniform': {
            return [tfc.randomUniform(getParamValue('shape', node, tensorMap, context), getParamValue('minval', node, tensorMap, context), getParamValue('maxval', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
        }
        case 'range': {
            var start = getParamValue('start', node, tensorMap, context);
            var stop_2 = getParamValue('stop', node, tensorMap, context);
            var step = getParamValue('step', node, tensorMap, context);
            return [tfc.range(start, stop_2, step, getParamValue('dtype', node, tensorMap, context))];
        }
        case 'truncatedNormal': {
            var shape = getParamValue('shape', node, tensorMap, context);
            var mean = getParamValue('mean', node, tensorMap, context);
            var stdDev = getParamValue('stdDev', node, tensorMap, context);
            var seed = getParamValue('seed', node, tensorMap, context);
            return [tfc.truncatedNormal(shape, mean, stdDev, getParamValue('dtype', node, tensorMap, context), seed)];
        }
        case 'zeros': {
            return [tfc.zeros(getParamValue('shape', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
        }
        case 'zerosLike': {
            return [tfc.zerosLike(getParamValue('x', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'creation';
//# sourceMappingURL=creation_executor.js.map