"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'abs':
            return [tfc.abs(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'acos':
            return [tfc.acos(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'acosh':
            return [tfc.acosh(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'asin':
            return [tfc.asin(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'asinh':
            return [tfc.asinh(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'atan':
            return [tfc.atan(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'atanh':
            return [tfc.atanh(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'ceil':
            return [tfc.ceil(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'cos':
            return [tfc.cos(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'cosh':
            return [tfc.cosh(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'elu':
            return [tfc.elu(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'erf':
            return [tfc.erf(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'exp':
            return [tfc.exp(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'expm1': {
            return [tfc.expm1(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'floor':
            return [tfc.floor(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'log':
            return [tfc.log(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'log1p': {
            return [tfc.log1p(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'neg':
            return [tfc.neg(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'reciprocal': {
            return [tfc.reciprocal(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'relu':
            return [tfc.relu(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'round': {
            return [tfc.round(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'selu':
            return [tfc.selu(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'sigmoid':
            return [tfc.sigmoid(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'sin':
            return [tfc.sin(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'sign': {
            return [tfc.sign(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'sinh': {
            return [tfc.sinh(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'softplus': {
            return [tfc.softplus(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'sqrt': {
            return [tfc.sqrt(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'square': {
            return [tfc.square(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'tanh': {
            return [tfc.tanh(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'tan':
            return [tfc.tan(utils_1.getParamValue('x', node, tensorMap, context))];
        case 'clipByValue':
            return [tfc.clipByValue(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('clipValueMin', node, tensorMap, context), utils_1.getParamValue('clipValueMax', node, tensorMap, context))];
        case 'rsqrt':
            return [tfc.div(tfc.scalar(1.0, 'float32'), tfc.sqrt(utils_1.getTensor(node.inputNames[0], tensorMap, context)))];
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'basic_math';
//# sourceMappingURL=basic_math_executor.js.map