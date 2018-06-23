"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'add': {
            return [tfc.add(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'mod':
            return [tfc.mod(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        case 'mul':
            return [tfc.mul(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        case 'div': {
            return [tfc.div(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'floorDiv': {
            return [tfc.floorDiv(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'sub': {
            return [tfc.sub(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'minimum': {
            return [tfc.minimum(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'maximum': {
            return [tfc.maximum(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'pow': {
            return [tfc.pow(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'squaredDifference': {
            return [tfc.squaredDifference(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'arithmetic';
//# sourceMappingURL=arithmetic_executor.js.map