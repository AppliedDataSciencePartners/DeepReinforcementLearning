"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var utils_1 = require("./utils");
exports.executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'concat': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var inputs = utils_1.getParamValue('tensors', node, tensorMap, context);
            return [tfc.concat(inputs, axis)];
        }
        case 'gather': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var input = utils_1.getParamValue('x', node, tensorMap, context);
            var indices = utils_1.getParamValue('indices', node, tensorMap, context);
            return [tfc.gather(input, indices, axis)];
        }
        case 'reverse': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var input = utils_1.getParamValue('x', node, tensorMap, context);
            return [tfc.reverse(input, axis)];
        }
        case 'slice': {
            var begin = utils_1.getParamValue('begin', node, tensorMap, context);
            var size = utils_1.getParamValue('size', node, tensorMap, context);
            return [tfc.slice(utils_1.getParamValue('x', node, tensorMap, context), begin, size)];
        }
        case 'stridedSlice': {
            var begin = utils_1.getParamValue('begin', node, tensorMap, context);
            var end = utils_1.getParamValue('end', node, tensorMap, context);
            var strides = utils_1.getParamValue('strides', node, tensorMap, context);
            var beginMask = utils_1.getParamValue('beginMask', node, tensorMap, context);
            var endMask = utils_1.getParamValue('endMask', node, tensorMap, context);
            return [tfc.stridedSlice(utils_1.getParamValue('x', node, tensorMap, context), begin, end, strides, beginMask, endMask)];
        }
        case 'stack': {
            return tfc.tidy(function () {
                var axis = utils_1.getParamValue('axis', node, tensorMap, context);
                var tensors = utils_1.getParamValue('tensors', node, tensorMap, context);
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
                var axis = utils_1.getParamValue('axis', node, tensorMap, context);
                var tensor = utils_1.getParamValue('tensor', node, tensorMap, context);
                return tfc.unstack(tensor, axis);
            });
        }
        case 'tile': {
            var reps = utils_1.getParamValue('reps', node, tensorMap, context);
            return [tfc.tile(utils_1.getParamValue('x', node, tensorMap, context), reps)];
        }
        case 'split': {
            var axis = utils_1.getParamValue('axis', node, tensorMap, context);
            var numOrSizeSplits = utils_1.getParamValue('numOrSizeSplits', node, tensorMap, context);
            return tfc.split(utils_1.getParamValue('x', node, tensorMap, context), numOrSizeSplits, axis);
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
exports.CATEGORY = 'slice_join';
//# sourceMappingURL=slice_join_executor.js.map