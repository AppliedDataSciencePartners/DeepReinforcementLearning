"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'equal': {
            return [tfc.equal(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'notEqual': {
            return [tfc.notEqual(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'greater': {
            return [tfc.greater(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'greaterEqual': {
            return [tfc.greaterEqual(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'less': {
            return [tfc.less(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'lessEqual': {
            return [tfc.lessEqual(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'logicalAnd': {
            return [tfc.logicalAnd(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'logicalNot': {
            return [tfc.logicalNot(utils_1.getParamValue('a', node, tensorMap, context))];
        }
        case 'logicalOr': {
            return [tfc.logicalOr(utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        case 'where': {
            return [tfc.where(utils_1.getParamValue('condition', node, tensorMap, context), utils_1.getParamValue('a', node, tensorMap, context), utils_1.getParamValue('b', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'logical';
//# sourceMappingURL=logical_executor.js.map