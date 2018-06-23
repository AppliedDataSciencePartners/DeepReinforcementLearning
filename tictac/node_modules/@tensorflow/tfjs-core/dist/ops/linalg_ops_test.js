"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
jasmine_util_1.describeWithFlags('gramSchmidt-tiny', test_util_1.ALL_ENVS, function () {
    it('2x2, Array of Tensor1D', function () {
        var xs = [tf.randomNormal([2]), tf.randomNormal([2])];
        var ys = tf.linalg.gramSchmidt(xs);
        var y = tf.stack(ys);
        test_util_1.expectArraysClose(y.transpose().matMul(y), tf.eye(2));
        test_util_1.expectArraysClose(tf.sum(xs[0].mul(ys[0])), tf.norm(xs[0]).mul(tf.norm(ys[0])));
    });
    it('3x3, Array of Tensor1D', function () {
        var xs = [tf.randomNormal([3]), tf.randomNormal([3]), tf.randomNormal([3])];
        var ys = tf.linalg.gramSchmidt(xs);
        var y = tf.stack(ys);
        test_util_1.expectArraysClose(y.transpose().matMul(y), tf.eye(3));
        test_util_1.expectArraysClose(tf.sum(xs[0].mul(ys[0])), tf.norm(xs[0]).mul(tf.norm(ys[0])));
    });
    it('3x3, Matrix', function () {
        var xs = tf.randomNormal([3, 3]);
        var y = tf.linalg.gramSchmidt(xs);
        test_util_1.expectArraysClose(y.transpose().matMul(y), tf.eye(3));
    });
    it('2x3, Matrix', function () {
        var xs = tf.randomNormal([2, 3]);
        var y = tf.linalg.gramSchmidt(xs);
        test_util_1.expectArraysClose(y.matMul(y.transpose()), tf.eye(2));
    });
    it('3x2 Matrix throws Error', function () {
        var xs = tf.tensor2d([[1, 2], [3, -1], [5, 1]]);
        expect(function () { return tf.linalg.gramSchmidt(xs); })
            .toThrowError(/Number of vectors \(3\) exceeds number of dimensions \(2\)/);
    });
    it('Mismatching dimensions input throws Error', function () {
        var xs = [tf.tensor1d([1, 2, 3]), tf.tensor1d([-1, 5, 1]), tf.tensor1d([0, 0])];
        expect(function () { return tf.linalg.gramSchmidt(xs); }).toThrowError(/Non-unique/);
    });
    it('Empty input throws Error', function () {
        expect(function () { return tf.linalg.gramSchmidt([]); }).toThrowError(/empty/);
    });
});
jasmine_util_1.describeWithFlags('gramSchmidt-non-tiny', test_util_1.WEBGL_ENVS, function () {
    it('32x512', function () {
        var xs = tf.randomUniform([32, 512]);
        var y = tf.linalg.gramSchmidt(xs);
        test_util_1.expectArraysClose(y.matMul(y.transpose()), tf.eye(32));
    });
});
//# sourceMappingURL=linalg_ops_test.js.map