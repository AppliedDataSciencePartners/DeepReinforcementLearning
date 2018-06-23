"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'max': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var keepDims = utils_1.getParamValue('keepDims', node, tensorMap, context);
            return [tfc.max(utils_1.getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'mean': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var keepDims = utils_1.getParamValue('keepDims', node, tensorMap, context);
            return [tfc.mean(utils_1.getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'min': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var keepDims = utils_1.getParamValue('keepDims', node, tensorMap, context);
            return [tfc.min(utils_1.getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'sum': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var keepDims = utils_1.getParamValue('keepDims', node, tensorMap, context);
            return [tfc.sum(utils_1.getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'argMax': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            return [tfc.argMax(utils_1.getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'argMin': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            return [tfc.argMin(utils_1.getParamValue('x', node, tensorMap, context), axis)];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'reduction';
//# sourceMappingURL=reduction_executor.js.map