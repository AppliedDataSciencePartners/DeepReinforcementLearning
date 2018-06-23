"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
var reduce_util_1 = require("./reduce_util");
jasmine_util_1.describeWithFlags('unsortedSegmentSum', test_util_1.ALL_ENVS, function () {
    it('tensor1D', function () {
        var t = tf.tensor1d([1, 2, 3, 4]);
        var segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
        var numSegments = 3;
        var res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments]);
        test_util_1.expectArraysClose(res, [4, 4, 2]);
    });
    it('tensor2D', function () {
        var t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var segmentIds = tf.tensor1d([0, 0], 'int32');
        var numSegments = 2;
        var res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments, 2]);
        test_util_1.expectArraysClose(res, [4, 6, 0, 0]);
    });
    it('tensor3D', function () {
        var t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [3, 2, 2]);
        var segmentIds = tf.tensor1d([2, 1, 2], 'int32');
        var numSegments = 3;
        var res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments, 2, 2]);
        test_util_1.expectArraysClose(res, [0, 0, 0, 0, 5, 6, 7, 8, 10, 12, 14, 16]);
    });
    it('N > than parallelization threshold, tensor1D', function () {
        var n = reduce_util_1.PARALLELIZE_THRESHOLD * 2;
        var values = new Float32Array(n);
        var numSegments = 5;
        var segmentIdValues = new Float32Array(n);
        var vals = new Float32Array(numSegments);
        for (var i = 0; i < n; i++) {
            values[i] = i;
            segmentIdValues[i] = i % numSegments;
            vals[i % numSegments] += i;
        }
        var t = tf.tensor1d(values);
        var segmentIds = tf.tensor1d(segmentIdValues, 'int32');
        var res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments]);
        test_util_1.expectArraysClose(res, vals);
    });
    it('ignores negative segmentIds', function () {
        var t = tf.tensor1d([1, 2, 3, 4]);
        var segmentIds = tf.tensor1d([0, 2, -1, 1], 'int32');
        var numSegments = 3;
        var res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments]);
        test_util_1.expectArraysClose(res, [1, 4, 2]);
    });
    it('gradient ignores negative segmentIds', function () {
        var t = tf.tensor1d([1, 2, 3, 4]);
        var segmentIds = tf.tensor1d([0, 2, -1, 1], 'int32');
        var numSegments = 3;
        var dy = tf.tensor1d([11, 2, 7]);
        var gradient = tf.grad(function (a) { return tf.unsortedSegmentSum(a, segmentIds, numSegments); })(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        test_util_1.expectArraysClose(gradient, [11, 7, 0, 2]);
    });
    it('tensor1D gradient', function () {
        var t = tf.tensor1d([1, 2, 3, 4]);
        var segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
        var numSegments = 3;
        var dy = tf.tensor1d([11, 2, 7]);
        var gradient = tf.grad(function (a) { return tf.unsortedSegmentSum(a, segmentIds, numSegments); })(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        test_util_1.expectArraysClose(gradient, [11, 7, 11, 2]);
    });
    it('tensor2D gradient', function () {
        var t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var segmentIds = tf.tensor1d([0, 0], 'int32');
        var numSegments = 2;
        var dy = tf.tensor2d([11, 2, 4, 5], [2, 2]);
        var gradient = tf.grad(function (a) { return tf.unsortedSegmentSum(a, segmentIds, numSegments); })(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        test_util_1.expectArraysClose(gradient, [11, 2, 11, 2]);
    });
    it('tensor3D gradient', function () {
        var t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [3, 2, 2]);
        var segmentIds = tf.tensor1d([2, 1, 2], 'int32');
        var numSegments = 3;
        var dy = tf.tensor3d([11, 2, 4, 5, 17, 31, 1, 0, -1, 14, 3, 28], [3, 2, 2]);
        var gradient = tf.grad(function (a) { return tf.unsortedSegmentSum(a, segmentIds, numSegments); })(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        test_util_1.expectArraysClose(gradient, [-1, 14, 3, 28, 17, 31, 1, 0, -1, 14, 3, 28]);
    });
});
//# sourceMappingURL=segment_ops_test.js.map