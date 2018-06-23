import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'conv1d': {
            var stride = getParamValue('stride', node, tensorMap, context);
            var pad = getParamValue('pad', node, tensorMap, context);
            var dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            var dilation = getParamValue('dilation', node, tensorMap, context);
            return [tfc.conv1d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), stride, pad, dataFormat, dilation)];
        }
        case 'conv2d': {
            var stride = getParamValue('strides', node, tensorMap, context);
            var pad = getParamValue('pad', node, tensorMap, context);
            var dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            var dilations = getParamValue('dilations', node, tensorMap, context);
            return [tfc.conv2d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[0], dilations[1]])];
        }
        case 'conv2dTranspose': {
            var shape = getParamValue('outputShape', node, tensorMap, context);
            var stride = getParamValue('strides', node, tensorMap, context);
            var pad = getParamValue('pad', node, tensorMap, context);
            return [tfc.conv2dTranspose(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), shape, [stride[1], stride[2]], pad)];
        }
        case 'depthwiseConv2d': {
            var stride = getParamValue('strides', node, tensorMap, context);
            var pad = getParamValue('pad', node, tensorMap, context);
            var dilations = getParamValue('dilations', node, tensorMap, context);
            var dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            return [tfc.depthwiseConv2d(getParamValue('input', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[0], dilations[1]])];
        }
        case 'avgPool': {
            var stride = getParamValue('strides', node, tensorMap, context);
            var pad = getParamValue('pad', node, tensorMap, context);
            var kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            return [tfc.avgPool(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
        }
        case 'maxPool': {
            var stride = getParamValue('strides', node, tensorMap, context);
            var pad = getParamValue('pad', node, tensorMap, context);
            var kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            return [tfc.maxPool(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'convolution';
//# sourceMappingURL=convolution_executor.js.map