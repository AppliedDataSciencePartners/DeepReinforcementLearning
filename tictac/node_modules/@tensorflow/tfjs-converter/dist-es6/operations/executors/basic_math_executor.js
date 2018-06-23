import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue, getTensor } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'abs':
            return [tfc.abs(getParamValue('x', node, tensorMap, context))];
        case 'acos':
            return [tfc.acos(getParamValue('x', node, tensorMap, context))];
        case 'acosh':
            return [tfc.acosh(getParamValue('x', node, tensorMap, context))];
        case 'asin':
            return [tfc.asin(getParamValue('x', node, tensorMap, context))];
        case 'asinh':
            return [tfc.asinh(getParamValue('x', node, tensorMap, context))];
        case 'atan':
            return [tfc.atan(getParamValue('x', node, tensorMap, context))];
        case 'atanh':
            return [tfc.atanh(getParamValue('x', node, tensorMap, context))];
        case 'ceil':
            return [tfc.ceil(getParamValue('x', node, tensorMap, context))];
        case 'cos':
            return [tfc.cos(getParamValue('x', node, tensorMap, context))];
        case 'cosh':
            return [tfc.cosh(getParamValue('x', node, tensorMap, context))];
        case 'elu':
            return [tfc.elu(getParamValue('x', node, tensorMap, context))];
        case 'erf':
            return [tfc.erf(getParamValue('x', node, tensorMap, context))];
        case 'exp':
            return [tfc.exp(getParamValue('x', node, tensorMap, context))];
        case 'expm1': {
            return [tfc.expm1(getParamValue('x', node, tensorMap, context))];
        }
        case 'floor':
            return [tfc.floor(getParamValue('x', node, tensorMap, context))];
        case 'log':
            return [tfc.log(getParamValue('x', node, tensorMap, context))];
        case 'log1p': {
            return [tfc.log1p(getParamValue('x', node, tensorMap, context))];
        }
        case 'neg':
            return [tfc.neg(getParamValue('x', node, tensorMap, context))];
        case 'reciprocal': {
            return [tfc.reciprocal(getParamValue('x', node, tensorMap, context))];
        }
        case 'relu':
            return [tfc.relu(getParamValue('x', node, tensorMap, context))];
        case 'round': {
            return [tfc.round(getParamValue('x', node, tensorMap, context))];
        }
        case 'selu':
            return [tfc.selu(getParamValue('x', node, tensorMap, context))];
        case 'sigmoid':
            return [tfc.sigmoid(getParamValue('x', node, tensorMap, context))];
        case 'sin':
            return [tfc.sin(getParamValue('x', node, tensorMap, context))];
        case 'sign': {
            return [tfc.sign(getParamValue('x', node, tensorMap, context))];
        }
        case 'sinh': {
            return [tfc.sinh(getParamValue('x', node, tensorMap, context))];
        }
        case 'softplus': {
            return [tfc.softplus(getParamValue('x', node, tensorMap, context))];
        }
        case 'sqrt': {
            return [tfc.sqrt(getParamValue('x', node, tensorMap, context))];
        }
        case 'square': {
            return [tfc.square(getParamValue('x', node, tensorMap, context))];
        }
        case 'tanh': {
            return [tfc.tanh(getParamValue('x', node, tensorMap, context))];
        }
        case 'tan':
            return [tfc.tan(getParamValue('x', node, tensorMap, context))];
        case 'clipByValue':
            return [tfc.clipByValue(getParamValue('x', node, tensorMap, context), getParamValue('clipValueMin', node, tensorMap, context), getParamValue('clipValueMax', node, tensorMap, context))];
        case 'rsqrt':
            return [tfc.div(tfc.scalar(1.0, 'float32'), tfc.sqrt(getTensor(node.inputNames[0], tensorMap, context)))];
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'basic_math';
//# sourceMappingURL=basic_math_executor.js.map