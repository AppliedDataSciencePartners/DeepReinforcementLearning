"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'batchNormalization': {
            return [tfc.batchNormalization(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('mean', node, tensorMap, context), utils_1.getParamValue('variance', node, tensorMap, context), utils_1.getParamValue('epsilon', node, tensorMap, context), utils_1.getParamValue('scale', node, tensorMap, context), utils_1.getParamValue('offset', node, tensorMap, context))];
        }
        case 'localResponseNormalization': {
            return [tfc.localResponseNormalization(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('radius', node, tensorMap, context), utils_1.getParamValue('bias', node, tensorMap, context), utils_1.getParamValue('alpha', node, tensorMap, context), utils_1.getParamValue('beta', node, tensorMap, context))];
        }
        case 'softmax': {
            return [tfc.softmax(utils_1.getParamValue('x', node, tensorMap, context))];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'normalization';
//# sourceMappingURL=normalization_executor.js.map