"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'conv1d': {
            var stride = utils_1.getParamValue('stride', node, tensorMap, context);
            var pad = utils_1.getParamValue('pad', node, tensorMap, context);
            var dataFormat = utils_1.getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            var dilation = utils_1.getParamValue('dilation', node, tensorMap, context);
            return [tfc.conv1d(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('filter', node, tensorMap, context), stride, pad, dataFormat, dilation)];
        }
        case 'conv2d': {
            var stride = utils_1.getParamValue('strides', node, tensorMap, context);
            var pad = utils_1.getParamValue('pad', node, tensorMap, context);
            var dataFormat = utils_1.getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            var dilations = utils_1.getParamValue('dilations', node, tensorMap, context);
            return [tfc.conv2d(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[0], dilations[1]])];
        }
        case 'conv2dTranspose': {
            var shape = utils_1.getParamValue('outputShape', node, tensorMap, context);
            var stride = utils_1.getParamValue('strides', node, tensorMap, context);
            var pad = utils_1.getParamValue('pad', node, tensorMap, context);
            return [tfc.conv2dTranspose(utils_1.getParamValue('x', node, tensorMap, context), utils_1.getParamValue('filter', node, tensorMap, context), shape, [stride[1], stride[2]], pad)];
        }
        case 'depthwiseConv2d': {
            var stride = utils_1.getParamValue('strides', node, tensorMap, context);
            var pad = utils_1.getParamValue('pad', node, tensorMap, context);
            var dilations = utils_1.getParamValue('dilations', node, tensorMap, context);
            var dataFormat = utils_1.getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            return [tfc.depthwiseConv2d(utils_1.getParamValue('input', node, tensorMap, context), utils_1.getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[0], dilations[1]])];
        }
        case 'avgPool': {
            var stride = utils_1.getParamValue('strides', node, tensorMap, context);
            var pad = utils_1.getParamValue('pad', node, tensorMap, context);
            var kernelSize = utils_1.getParamValue('kernelSize', node, tensorMap, context);
            return [tfc.avgPool(utils_1.getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
        }
        case 'maxPool': {
            var stride = utils_1.getParamValue('strides', node, tensorMap, context);
            var pad = utils_1.getParamValue('pad', node, tensorMap, context);
            var kernelSize = utils_1.getParamValue('kernelSize', node, tensorMap, context);
            return [tfc.maxPool(utils_1.getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'convolution';
//# sourceMappingURL=convolution_executor.js.map