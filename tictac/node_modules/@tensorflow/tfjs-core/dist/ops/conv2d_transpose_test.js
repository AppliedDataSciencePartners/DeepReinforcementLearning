"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var test_util_1 = require("../test_util");
var jasmine_util_1 = require("../jasmine_util");
jasmine_util_1.describeWithFlags('conv2dTranspose', test_util_1.ALL_ENVS, function () {
    it('input=2x2x1,d2=1,f=2,s=1,p=0', function () {
        var origInputDepth = 1;
        var origOutputDepth = 1;
        var inputShape = [1, 1, origOutputDepth];
        var fSize = 2;
        var origPad = 0;
        var origStride = 1;
        var x = tf.tensor3d([2], inputShape);
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        var result = tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad);
        var expected = [6, 2, 10, 0];
        expect(result.shape).toEqual([2, 2, 1]);
        test_util_1.expectArraysClose(result, expected);
    });
    it('input=2x2x1,d2=1,f=2,s=1,p=0, batch=2', function () {
        var origInputDepth = 1;
        var origOutputDepth = 1;
        var inputShape = [2, 1, 1, origOutputDepth];
        var fSize = 2;
        var origPad = 0;
        var origStride = 1;
        var x = tf.tensor4d([2, 3], inputShape);
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        var result = tf.conv2dTranspose(x, w, [2, 2, 2, 1], origStride, origPad);
        var expected = [6, 2, 10, 0, 9, 3, 15, 0];
        expect(result.shape).toEqual([2, 2, 2, 1]);
        test_util_1.expectArraysClose(result, expected);
    });
    it('throws when x is not rank 3', function () {
        var origInputDepth = 1;
        var origOutputDepth = 1;
        var fSize = 2;
        var origPad = 0;
        var origStride = 1;
        var x = tf.tensor2d([2, 2], [2, 1]);
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(function () { return tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad); })
            .toThrowError();
    });
    it('throws when weights is not rank 4', function () {
        var origInputDepth = 1;
        var origOutputDepth = 1;
        var inputShape = [1, 1, origOutputDepth];
        var fSize = 2;
        var origPad = 0;
        var origStride = 1;
        var x = tf.tensor3d([2], inputShape);
        var w = tf.tensor3d([3, 1, 5, 0], [fSize, fSize, origInputDepth]);
        expect(function () { return tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad); })
            .toThrowError();
    });
    it('throws when x depth does not match weights original output depth', function () {
        var origInputDepth = 1;
        var origOutputDepth = 2;
        var wrongOrigOutputDepth = 3;
        var inputShape = [1, 1, origOutputDepth];
        var fSize = 2;
        var origPad = 0;
        var origStride = 1;
        var x = tf.tensor3d([2, 2], inputShape);
        var w = tf.randomNormal([fSize, fSize, origInputDepth, wrongOrigOutputDepth]);
        expect(function () { return tf.conv2dTranspose(x, w, [2, 2, 2], origStride, origPad); })
            .toThrowError();
    });
    it('throws when passed x as a non-tensor', function () {
        var origInputDepth = 1;
        var origOutputDepth = 1;
        var fSize = 2;
        var origPad = 0;
        var origStride = 1;
        var w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(function () { return tf.conv2dTranspose({}, w, [2, 2, 1], origStride, origPad); })
            .toThrowError(/Argument 'x' passed to 'conv2dTranspose' must be a Tensor/);
    });
    it('throws when passed filter as a non-tensor', function () {
        var origOutputDepth = 1;
        var inputShape = [1, 1, origOutputDepth];
        var origPad = 0;
        var origStride = 1;
        var x = tf.tensor3d([2], inputShape);
        expect(function () { return tf.conv2dTranspose(x, {}, [2, 2, 1], origStride, origPad); })
            .toThrowError(/Argument 'filter' passed to 'conv2dTranspose' must be a Tensor/);
    });
});
//# sourceMappingURL=conv2d_transpose_test.js.map