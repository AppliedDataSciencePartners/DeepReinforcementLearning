"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'fill': {
            var shape = utils_1.getParamValue('shape', node, tensorMap, context);
            var value = utils_1.getParamValue('value', node, tensorMap, context);
            return [tfc.fill(shape, value)];
        }
        case 'linspace': {
            var start = utils_1.getParamValue('start', node, tensorMap, context);
            var stop_1 = utils_1.getParamValue('stop', node, tensorMap, context);
            var num = utils_1.getParamValue('num', node, tensorMap, context);
            return [tfc.linspace(start, stop_1, num)];
        }
        case 'oneHot': {
            var indices = utils_1.getParamValue('indices', node, tensorMap, context);
            var depth = utils_1.getParamValue('depth', node, tensorMap, context);
            var onValue = utils_1.getParamValue('onValue', node, tensorMap, context);
            var offValue = utils_1.getParamValue('offValue', node, tensorMap, context);
            return [tfc.oneHot(indices, depth, onValue, offValue)];
        }
        case 'ones': {
            return [tfc.ones(utils_1.getParamValue('shape', node, tensorMap, context), utils_1.getParamValue('dtype', node, tensorMap, context))];
        }
        case 'onesLike': {
            return [tfc.onesLike(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        case 'randomUniform': {
            return [tfc.randomUniform(utils_1.getParamValue('shape', node, tensorMap, context), utils_1.getParamValue('minval', node, tensorMap, context), utils_1.getParamValue('maxval', node, tensorMap, context), utils_1.getParamValue('dtype', node, tensorMap, context))];
        }
        case 'range': {
            var start = utils_1.getParamValue('start', node, tensorMap, context);
            var stop_2 = utils_1.getParamValue('stop', node, tensorMap, context);
            var step = utils_1.getParamValue('step', node, tensorMap, context);
            return [tfc.range(start, stop_2, step, utils_1.getParamValue('dtype', node, tensorMap, context))];
        }
        case 'truncatedNormal': {
            var shape = utils_1.getParamValue('shape', node, tensorMap, context);
            var mean = utils_1.getParamValue('mean', node, tensorMap, context);
            var stdDev = utils_1.getParamValue('stdDev', node, tensorMap, context);
            var seed = utils_1.getParamValue('seed', node, tensorMap, context);
            return [tfc.truncatedNormal(shape, mean, stdDev, utils_1.getParamValue('dtype', node, tensorMap, context), seed)];
        }
        case 'zeros': {
            return [tfc.zeros(utils_1.getParamValue('shape', node, tensorMap, context), utils_1.getParamValue('dtype', node, tensorMap, context))];
        }
        case 'zerosLike': {
            return [tfc.zerosLike(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'creation';
//# sourceMappingURL=creation_executor.js.map