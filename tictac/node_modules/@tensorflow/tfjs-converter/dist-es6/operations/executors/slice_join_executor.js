import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'concat': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var inputs = getParamValue('tensors', node, tensorMap, context);
            return [tfc.concat(inputs, axis)];
        }
        case 'gather': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var input = getParamValue('x', node, tensorMap, context);
            var indices = getParamValue('indices', node, tensorMap, context);
            return [tfc.gather(input, indices, axis)];
        }
        case 'reverse': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var input = getParamValue('x', node, tensorMap, context);
            return [tfc.reverse(input, axis)];
        }
        case 'slice': {
            var begin = getParamValue('begin', node, tensorMap, context);
            var size = getParamValue('size', node, tensorMap, context);
            return [tfc.slice(getParamValue('x', node, tensorMap, context), begin, size)];
        }
        case 'stridedSlice': {
            var begin = getParamValue('begin', node, tensorMap, context);
            var end = getParamValue('end', node, tensorMap, context);
            var strides = getParamValue('strides', node, tensorMap, context);
            var beginMask = getParamValue('beginMask', node, tensorMap, context);
            var endMask = getParamValue('endMask', node, tensorMap, context);
            return [tfc.stridedSlice(getParamValue('x', node, tensorMap, context), begin, end, strides, beginMask, endMask)];
        }
        case 'stack': {
            return tfc.tidy(function () {
                var axis = getParamValue('axis', node, tensorMap, context);
                var tensors = getParamValue('tensors', node, tensorMap, context);
                var shape = tensors[0].shape;
                var squeezedShape = tensors[0].squeeze().shape;
                var mapped = tensors.map(function (tensor) {
                    var sameShape = tfc.util.arraysEqual(tensor.shape, shape);
                    if (!sameShape &&
                        !tfc.util.arraysEqual(tensor.squeeze().shape, squeezedShape)) {
                        throw new Error('the input tensors shape does not match');
                    }
                    return sameShape ? tensor : tensor.reshape(shape);
                });
                return [tfc.stack(mapped, axis)];
            });
        }
        case 'unstack': {
            return tfc.tidy(function () {
                var axis = getParamValue('axis', node, tensorMap, context);
                var tensor = getParamValue('tensor', node, tensorMap, context);
                return tfc.unstack(tensor, axis);
            });
        }
        case 'tile': {
            var reps = getParamValue('reps', node, tensorMap, context);
            return [tfc.tile(getParamValue('x', node, tensorMap, context), reps)];
        }
        case 'split': {
            var axis = getParamValue('axis', node, tensorMap, context);
            var numOrSizeSplits = getParamValue('numOrSizeSplits', node, tensorMap, context);
            return tfc.split(getParamValue('x', node, tensorMap, context), numOrSizeSplits, axis);
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'slice_join';
//# sourceMappingURL=slice_join_executor.js.map