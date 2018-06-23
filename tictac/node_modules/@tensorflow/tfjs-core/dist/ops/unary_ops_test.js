"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
var util = require("../util");
var selu_util = require("./selu_util");
jasmine_util_1.describeWithFlags('relu', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([1, -2, 0, 3, -0.1]);
        var result = tf.relu(a);
        test_util_1.expectArraysClose(result, [1, 0, 0, 3, 0]);
    });
    it('5D', function () {
        var a = tf.tensor5d([1, -2, 5, -3], [1, 2, 2, 1, 1]);
        var result = tf.relu(a);
        test_util_1.expectArraysClose(result, [1, 0, 5, 0]);
    });
    it('6D', function () {
        var a = tf.tensor6d([1, -2, 5, -3, -1, 4, 7, 8], [1, 2, 2, 2, 1, 1]);
        var result = tf.relu(a);
        test_util_1.expectArraysClose(result, [1, 0, 5, 0, 0, 4, 7, 8]);
    });
    it('does nothing to positive values', function () {
        var a = tf.scalar(1);
        var result = tf.relu(a);
        test_util_1.expectNumbersClose(result.get(), 1);
    });
    it('sets negative values to 0', function () {
        var a = tf.scalar(-1);
        var result = tf.relu(a);
        test_util_1.expectNumbersClose(result.get(), 0);
    });
    it('preserves zero values', function () {
        var a = tf.scalar(0);
        var result = tf.relu(a);
        test_util_1.expectNumbersClose(result.get(), 0);
    });
    it('propagates NaNs, float32', function () {
        var a = tf.tensor1d([1, -2, 0, 3, -0.1, NaN]);
        var result = tf.relu(a);
        expect(result.dtype).toBe('float32');
        test_util_1.expectArraysClose(result, [1, 0, 0, 3, 0, NaN]);
    });
    it('gradients: positive scalar', function () {
        var a = tf.scalar(3);
        var dy = tf.scalar(5);
        var grad = tf.grad(function (a) { return tf.relu(a); });
        var da = grad(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [5]);
    });
    it('gradients: negative scalar', function () {
        var a = tf.scalar(-3);
        var dy = tf.scalar(5);
        var grad = tf.grad(function (a) { return tf.relu(a); });
        var da = grad(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [0]);
    });
    it('gradients: array', function () {
        var a = tf.tensor2d([1, -1, 0, .1], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var grad = tf.grad(function (a) { return tf.relu(a); });
        var da = grad(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1, 0, 0, 4]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.relu({}); })
            .toThrowError(/Argument 'x' passed to 'relu' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('abs', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([1, -2, 0, 3, -0.1]);
        var result = tf.abs(a);
        test_util_1.expectArraysClose(result, [1, 2, 0, 3, 0.1]);
    });
    it('5D', function () {
        var a = tf.tensor5d([1, -2, 0, -3], [1, 2, 2, 1, 1]);
        var result = tf.abs(a);
        test_util_1.expectArraysClose(result, [1, 2, 0, 3]);
    });
    it('6D', function () {
        var a = tf.tensor6d([1, -2, 5, -3, -1, 4, 7, 8], [1, 2, 2, 2, 1, 1]);
        var result = tf.abs(a);
        test_util_1.expectArraysClose(result, [1, 2, 5, 3, 1, 4, 7, 8]);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([1, -2, 0, 3, -0.1, NaN]);
        var result = tf.abs(a);
        test_util_1.expectArraysClose(result, [1, 2, 0, 3, 0.1, NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(4);
        var dy = tf.scalar(8);
        var da = tf.grad(function (a) { return tf.abs(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [8 * 1]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, -3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var da = tf.grad(function (a) { return tf.abs(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 * 1, 2 * 1, 3 * -1, 4 * 1]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([3, -1, -2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var da = tf.grad(function (a) { return tf.abs(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 * 1, 2 * -1, 3 * -1, 4 * 1]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.abs({}); })
            .toThrowError(/Argument 'x' passed to 'abs' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('step', test_util_1.ALL_ENVS, function () {
    it('with 1d tensor', function () {
        var a = tf.tensor1d([1, -2, -.01, 3, -0.1]);
        var result = tf.step(a);
        test_util_1.expectArraysClose(result, [1, 0, 0, 1, 0]);
    });
    it('with 1d tensor and alpha', function () {
        var a = tf.tensor1d([1, -2, -.01, 3, NaN]);
        var result = tf.step(a, 0.1);
        test_util_1.expectArraysClose(result, [1, 0.1, 0.1, 1, NaN]);
    });
    it('with 2d tensor', function () {
        var a = tf.tensor2d([1, -5, -3, 4], [2, 2]);
        var result = tf.step(a);
        expect(result.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(result, [1, 0, 0, 1]);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([1, -2, -.01, 3, NaN]);
        var result = tf.step(a);
        test_util_1.expectArraysClose(result, [1, 0, 0, 1, NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(-4);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.step(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, -3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.step(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([3, -1, -2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.step(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.step({}); })
            .toThrowError(/Argument 'x' passed to 'step' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('neg', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([1, -3, 2, 7, -4]);
        var result = tf.neg(a);
        test_util_1.expectArraysClose(result, [-1, 3, -2, -7, 4]);
    });
    it('propagate NaNs', function () {
        var a = tf.tensor1d([1, -3, 2, 7, NaN]);
        var result = tf.neg(a);
        var expected = [-1, 3, -2, -7, NaN];
        test_util_1.expectArraysClose(result, expected);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(4);
        var dy = tf.scalar(8);
        var da = tf.grad(function (a) { return tf.neg(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [8 * -1]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, -3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var da = tf.grad(function (a) { return tf.neg(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 * -1, 2 * -1, 3 * -1, 4 * -1]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([3, -1, -2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var da = tf.grad(function (a) { return tf.neg(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [1 * -1, 2 * -1, 3 * -1, 4 * -1]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.neg({}); })
            .toThrowError(/Argument 'x' passed to 'neg' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('sigmoid', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.sigmoid(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = 1 / (1 + Math.exp(-values[i]));
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('6D', function () {
        var a = tf.ones([2, 2, 2, 2, 2, 2]);
        var result = tf.sigmoid(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = 1 / (1 + Math.exp(-1.0));
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([3, NaN]);
        var res = tf.sigmoid(a);
        test_util_1.expectArraysClose(res, [1 / (1 + Math.exp(-3)), NaN]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, -3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var da = tf.grad(function (a) { return tf.sigmoid(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            var y = 1 / (1 + Math.exp(-a.get(i)));
            expected[i] = dy.get(i) * y * (1 - y);
        }
        test_util_1.expectArraysClose(da, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.sigmoid({}); })
            .toThrowError(/Argument 'x' passed to 'sigmoid' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('logSigmoid', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.logSigmoid(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.log(1 / (1 + Math.exp(-values[i])));
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar', function () {
        var a = tf.scalar(-2);
        var result = tf.logSigmoid(a);
        var expected = [Math.log(1 / (1 + Math.exp(2)))];
        test_util_1.expectArraysClose(result, expected);
    });
    it('tensor2D', function () {
        var values = [1, 2, -3, 5];
        var a = tf.tensor2d(values, [2, 2]);
        var result = tf.logSigmoid(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.log(1 / (1 + Math.exp(-values[i])));
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('larger magnitude negative inputs', function () {
        var values = [-100, -200, -3000];
        var a = tf.tensor1d(values);
        var result = tf.logSigmoid(a);
        var expected = [-100, -200, -3000];
        test_util_1.expectArraysClose(result, expected);
    });
    it('larger magnitude positive inputs', function () {
        var values = [100, 200, 3000, 50000];
        var a = tf.tensor1d(values);
        var result = tf.logSigmoid(a);
        var expected = [0, 0, 0, 0];
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([3, NaN]);
        var res = tf.logSigmoid(a);
        test_util_1.expectArraysClose(res, [Math.log(1 / (1 + Math.exp(-3))), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(3);
        var dy = tf.scalar(4);
        var da = tf.grad(function (a) { return tf.logSigmoid(a); })(a, dy).get();
        var y = 1 / (1 + Math.exp(a.get()));
        test_util_1.expectNumbersClose(da, dy.get() * y);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, -3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var da = tf.grad(function (a) { return tf.logSigmoid(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            var y = 1 / (1 + Math.exp(a.get(i)));
            expected[i] = dy.get(i) * y;
        }
        test_util_1.expectArraysClose(da, expected);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([1, 2, -3, 5], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var da = tf.grad(function (a) { return tf.logSigmoid(a); })(a, dy);
        var expected = [];
        var aVals = a.dataSync();
        var dyVals = dy.dataSync();
        for (var i = 0; i < a.size; i++) {
            var y = 1 / (1 + Math.exp(aVals[i]));
            expected[i] = dyVals[i] * y;
        }
        test_util_1.expectArraysClose(da, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.logSigmoid({}); })
            .toThrowError(/Argument 'x' passed to 'logSigmoid' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('softplus', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.softplus(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.log((1 + Math.exp(values[i])));
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar', function () {
        var a = tf.scalar(-2);
        var result = tf.softplus(a);
        var expected = [Math.log((1 + Math.exp(-2)))];
        test_util_1.expectArraysClose(result, expected);
    });
    it('tensor2D', function () {
        var values = [1, 2, -3, 5];
        var a = tf.tensor2d(values, [2, 2]);
        var result = tf.softplus(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.log((1 + Math.exp(values[i])));
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('larger magnitude negative inputs', function () {
        var values = [-100, -200, -3000, -50000];
        var a = tf.tensor1d(values);
        var result = tf.softplus(a);
        var expected = [0, 0, 0, 0];
        test_util_1.expectArraysClose(result, expected);
    });
    it('larger magnitude positive inputs', function () {
        var values = [100, 200, 3000];
        var a = tf.tensor1d(values);
        var result = tf.softplus(a);
        var expected = [100, 200, 3000];
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([3, NaN]);
        var res = tf.softplus(a);
        test_util_1.expectArraysClose(res, [Math.log((1 + Math.exp(3))), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(3);
        var dy = tf.scalar(4);
        var da = tf.grad(function (a) { return tf.softplus(a); })(a, dy);
        var y = 1 / (1 + Math.exp(-a.get()));
        test_util_1.expectNumbersClose(da.get(), dy.get() * y);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, -3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var da = tf.grad(function (a) { return tf.softplus(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            var y = 1 / (1 + Math.exp(-a.get(i)));
            expected[i] = dy.get(i) * y;
        }
        test_util_1.expectArraysClose(da, expected);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([1, 2, -3, 5], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var da = tf.grad(function (a) { return tf.softplus(a); })(a, dy);
        var expected = [];
        var aVals = a.dataSync();
        var dyVals = dy.dataSync();
        for (var i = 0; i < a.size; i++) {
            var y = 1 / (1 + Math.exp(-aVals[i]));
            expected[i] = dyVals[i] * y;
        }
        test_util_1.expectArraysClose(da, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.softplus({}); })
            .toThrowError(/Argument 'x' passed to 'softplus' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('sqrt', test_util_1.ALL_ENVS, function () {
    it('sqrt', function () {
        var a = tf.tensor1d([2, 4]);
        var r = tf.sqrt(a);
        test_util_1.expectNumbersClose(r.get(0), Math.sqrt(2));
        test_util_1.expectNumbersClose(r.get(1), Math.sqrt(4));
    });
    it('sqrt propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN]);
        var r = tf.sqrt(a);
        test_util_1.expectArraysClose(r, [Math.sqrt(1), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(4);
        var dy = tf.scalar(8);
        var da = tf.grad(function (a) { return tf.sqrt(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [8 / (2 * Math.sqrt(4))]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, 3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.sqrt(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            1 / (2 * Math.sqrt(1)), 2 / (2 * Math.sqrt(2)),
            3 / (2 * Math.sqrt(3)), 4 / (2 * Math.sqrt(5))
        ], 1e-1);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.sqrt(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            1 / (2 * Math.sqrt(3)), 2 / (2 * Math.sqrt(1)),
            3 / (2 * Math.sqrt(2)), 4 / (2 * Math.sqrt(3))
        ], 1e-1);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.sqrt({}); })
            .toThrowError(/Argument 'x' passed to 'sqrt' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('rsqrt', test_util_1.ALL_ENVS, function () {
    it('rsqrt', function () {
        var a = tf.tensor1d([2, 4]);
        var r = tf.rsqrt(a);
        test_util_1.expectNumbersClose(r.get(0), 1 / Math.sqrt(2));
        test_util_1.expectNumbersClose(r.get(1), 1 / Math.sqrt(4));
    });
    it('rsqrt propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN]);
        var r = tf.rsqrt(a);
        test_util_1.expectArraysClose(r, [1 / Math.sqrt(1), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(4);
        var dy = tf.scalar(8);
        var da = tf.grad(function (a) { return tf.rsqrt(a); })(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        test_util_1.expectArraysClose(da, [(-1 * 8) / (2 * Math.pow(4, 1.5))]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([1, 2, 3, 5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.rsqrt(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            -1 * 1 / (2 * Math.pow(1, 1.5)), -1 * 2 / (2 * Math.pow(2, 1.5)),
            -1 * 3 / (2 * Math.pow(3, 1.5)), -1 * 4 / (2 * Math.pow(5, 1.5))
        ], 1e-1);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.rsqrt(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            -1 * 1 / (2 * Math.pow(3, 1.5)), -1 * 2 / (2 * Math.pow(1, 1.5)),
            -1 * 3 / (2 * Math.pow(2, 1.5)), -1 * 4 / (2 * Math.pow(3, 1.5))
        ], 1e-1);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.rsqrt({}); })
            .toThrowError(/Argument 'x' passed to 'rsqrt' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('square', test_util_1.ALL_ENVS, function () {
    it('1D array', function () {
        var a = tf.tensor1d([2, 4, Math.sqrt(2)]);
        var r = tf.square(a);
        test_util_1.expectArraysClose(r, [4, 16, 2]);
    });
    it('2D array', function () {
        var a = tf.tensor2d([1, 2, Math.sqrt(2), Math.sqrt(3)], [2, 2]);
        var r = tf.square(a);
        expect(r.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(r, [1, 4, 2, 3]);
    });
    it('5D array', function () {
        var a = tf.tensor5d([1, 2, Math.sqrt(2), Math.sqrt(3)], [1, 1, 2, 2, 1]);
        var r = tf.square(a);
        expect(r.shape).toEqual([1, 1, 2, 2, 1]);
        test_util_1.expectArraysClose(r, [1, 4, 2, 3]);
    });
    it('6D array', function () {
        var a = tf.tensor6d([1, 2, Math.sqrt(2), Math.sqrt(3), 3, 4, Math.sqrt(7), Math.sqrt(13)], [1, 1, 2, 2, 2, 1]);
        var r = tf.square(a);
        expect(r.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(r, [1, 4, 2, 3, 9, 16, 7, 13]);
    });
    it('square propagates NaNs', function () {
        var a = tf.tensor1d([1.5, NaN]);
        var r = tf.square(a);
        test_util_1.expectArraysClose(r, [2.25, NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.square(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [2 * 5 * 8]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.square(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [-2, 4 * 2, 6 * 3, -10 * 4]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.square(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [-6 * 1, 2 * 2, 4 * 3, 6 * 4]);
    });
    it('gradients: Tensor5D', function () {
        var a = tf.tensor5d([-3, 1, 2, 3], [1, 1, 1, 2, 2]);
        var dy = tf.tensor5d([1, 2, 3, 4], [1, 1, 1, 2, 2]);
        var gradients = tf.grad(function (a) { return tf.square(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [-6 * 1, 2 * 2, 4 * 3, 6 * 4]);
    });
    it('gradients: Tensor6D', function () {
        var a = tf.tensor6d([-3, 1, 2, 3, -4, 5, 12, 3], [1, 1, 1, 2, 2, 2]);
        var dy = tf.tensor6d([1, 2, 3, 4, 5, 6, 7, 8], [1, 1, 1, 2, 2, 2]);
        var gradients = tf.grad(function (a) { return tf.square(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [-6 * 1, 2 * 2, 4 * 3, 6 * 4, -8 * 5, 10 * 6, 24 * 7, 6 * 8]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.square({}); })
            .toThrowError(/Argument 'x' passed to 'square' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('reciprocal', test_util_1.ALL_ENVS, function () {
    it('1D array', function () {
        var a = tf.tensor1d([2, 3, 0, NaN]);
        var r = tf.reciprocal(a);
        test_util_1.expectArraysClose(r, [1 / 2, 1 / 3, Infinity, NaN]);
    });
    it('2D array', function () {
        var a = tf.tensor2d([1, Infinity, 0, NaN], [2, 2]);
        var r = tf.reciprocal(a);
        expect(r.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(r, [1 / 1, 0, Infinity, NaN]);
    });
    it('reciprocal propagates NaNs', function () {
        var a = tf.tensor1d([1.5, NaN]);
        var r = tf.reciprocal(a);
        test_util_1.expectArraysClose(r, [1 / 1.5, NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.reciprocal(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [-1 * 8 * (1 / (5 * 5))]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.reciprocal(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            -1 * 1 * (1 / (-1 * -1)), -1 * 2 * (1 / (2 * 2)), -1 * 3 * (1 / (3 * 3)),
            -1 * 4 * (1 / (-5 * -5))
        ]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-1, 2, 3, -5], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.reciprocal(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            -1 * 1 * (1 / (-1 * -1)), -1 * 2 * (1 / (2 * 2)), -1 * 3 * (1 / (3 * 3)),
            -1 * 4 * (1 / (-5 * -5))
        ]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.reciprocal({}); })
            .toThrowError(/Argument 'x' passed to 'reciprocal' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('log', test_util_1.ALL_ENVS, function () {
    it('log', function () {
        var a = tf.tensor1d([1, 2]);
        var r = tf.log(a);
        test_util_1.expectNumbersClose(r.get(0), Math.log(1));
        test_util_1.expectNumbersClose(r.get(1), Math.log(2));
    });
    it('log 6D', function () {
        var a = tf.range(1, 65).reshape([2, 2, 2, 2, 2, 2]);
        var r = tf.log(a);
        var expectedResult = [];
        for (var i = 1; i < 65; i++) {
            expectedResult[i - 1] = Math.log(i);
        }
        test_util_1.expectArraysClose(r, expectedResult);
    });
    it('log propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN]);
        var r = tf.log(a);
        test_util_1.expectArraysClose(r, [Math.log(1), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.log(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [3 / 5]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.log(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 / -1, 2 / 2, 3 / 3, 4 / -5]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.log(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 / -3, 2 / 1, 3 / 2, 4 / 3]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.log({}); })
            .toThrowError(/Argument 'x' passed to 'log' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('log1p', test_util_1.ALL_ENVS, function () {
    it('log1p', function () {
        var a = tf.tensor1d([1, 2]);
        var r = tf.log1p(a);
        test_util_1.expectNumbersClose(r.get(0), Math.log1p(1));
        test_util_1.expectNumbersClose(r.get(1), Math.log1p(2));
    });
    it('log1p propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN]);
        var r = tf.log1p(a);
        test_util_1.expectArraysClose(r, [Math.log1p(1), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.log1p(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [3 / (1 + 5)]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.log1p(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [Infinity, 2 / (1 + 2), 3 / (1 + 3), 4 / (1 + -5)]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.log1p(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 / (1 + -3), 2 / (1 + 1), 3 / (1 + 2), 4 / (1 + 3)]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.log1p({}); })
            .toThrowError(/Argument 'x' passed to 'log1p' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('ceil', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([1.5, 2.1, -1.4]);
        var r = tf.ceil(a);
        test_util_1.expectNumbersClose(r.get(0), 2);
        test_util_1.expectNumbersClose(r.get(1), 3);
        test_util_1.expectNumbersClose(r.get(2), -1);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([1.5, NaN, -1.4]);
        var r = tf.ceil(a);
        test_util_1.expectArraysClose(r, [2, NaN, -1]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5.2);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.ceil(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1.1, 2.6, 3, -5.9]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.ceil(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2.2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.ceil(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.ceil({}); })
            .toThrowError(/Argument 'x' passed to 'ceil' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('floor', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([1.5, 2.1, -1.4]);
        var r = tf.floor(a);
        test_util_1.expectNumbersClose(r.get(0), 1);
        test_util_1.expectNumbersClose(r.get(1), 2);
        test_util_1.expectNumbersClose(r.get(2), -2);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([1.5, NaN, -1.4]);
        var r = tf.floor(a);
        test_util_1.expectArraysClose(r, [1, NaN, -2]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5.2);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.floor(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1.1, 2.6, 3, -5.9]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.floor(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2.2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.floor(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.floor({}); })
            .toThrowError(/Argument 'x' passed to 'floor' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('sign', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([1.5, 0, NaN, -1.4]);
        var r = tf.sign(a);
        test_util_1.expectNumbersClose(r.get(0), 1);
        test_util_1.expectNumbersClose(r.get(1), 0);
        test_util_1.expectNumbersClose(r.get(2), 0);
        test_util_1.expectNumbersClose(r.get(3), -1);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([1.5, NaN, -1.4]);
        var r = tf.sign(a);
        test_util_1.expectArraysClose(r, [1, 0, -1]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5.2);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.sign(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1.1, 2.6, 3, -5.9]);
        var dy = tf.tensor1d([-1, 1, 1, -1]);
        var gradients = tf.grad(function (a) { return tf.sign(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2.2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.sign(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.sign({}); })
            .toThrowError(/Argument 'x' passed to 'sign' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('exp', test_util_1.ALL_ENVS, function () {
    it('exp', function () {
        var a = tf.tensor1d([1, 2, 0]);
        var r = tf.exp(a);
        test_util_1.expectNumbersClose(r.get(0), Math.exp(1));
        test_util_1.expectNumbersClose(r.get(1), Math.exp(2));
        test_util_1.expectNumbersClose(r.get(2), 1);
    });
    it('exp propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN, 0]);
        var r = tf.exp(a);
        test_util_1.expectArraysClose(r, [Math.exp(1), NaN, 1]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.exp(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [3 * Math.exp(0.5)]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.exp(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 * Math.exp(-1), 2 * Math.exp(2), 3 * Math.exp(3), 4 * Math.exp(-5)], 1e-1);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.exp(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 * Math.exp(-3), 2 * Math.exp(1), 3 * Math.exp(2), 4 * Math.exp(3)], 1e-1);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.exp({}); })
            .toThrowError(/Argument 'x' passed to 'exp' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('expm1', test_util_1.ALL_ENVS, function () {
    it('expm1', function () {
        var a = tf.tensor1d([1, 2, 0]);
        var r = tf.expm1(a);
        test_util_1.expectNumbersClose(r.get(0), Math.expm1(1));
        test_util_1.expectNumbersClose(r.get(1), Math.expm1(2));
        test_util_1.expectNumbersClose(r.get(2), Math.expm1(0));
    });
    it('expm1 propagates NaNs', function () {
        var a = tf.tensor1d([1, NaN, 0]);
        var r = tf.expm1(a);
        test_util_1.expectArraysClose(r, [Math.expm1(1), NaN, Math.expm1(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.expm1(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [3 * Math.exp(0.5)]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.expm1(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 * Math.exp(-1), 2 * Math.exp(2), 3 * Math.exp(3), 4 * Math.exp(-5)], 1e-1);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.expm1(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 * Math.exp(-3), 2 * Math.exp(1), 3 * Math.exp(2), 4 * Math.exp(3)], 1e-1);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.expm1({}); })
            .toThrowError(/Argument 'x' passed to 'expm1' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('sin', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.sin(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.sin(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.sin(a);
        test_util_1.expectArraysClose(res, [Math.sin(4), NaN, Math.sin(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.sin(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * Math.cos(5)]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.sin(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 * Math.cos(-1), 2 * Math.cos(2), 3 * Math.cos(3), 4 * Math.cos(-5)], 1e-1);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.sin(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1 * Math.cos(-3), 2 * Math.cos(1), 3 * Math.cos(2), 4 * Math.cos(3)], 1e-1);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.sin({}); })
            .toThrowError(/Argument 'x' passed to 'sin' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('cos', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.cos(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.cos(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.cos(a);
        test_util_1.expectArraysClose(res, [Math.cos(4), NaN, Math.cos(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.cos(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * Math.sin(5) * -1]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1, 2, 3, -5]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.cos(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            1 * Math.sin(-1) * -1, 2 * Math.sin(2) * -1, 3 * Math.sin(3) * -1,
            4 * Math.sin(-5) * -1
        ], 1e-1);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.cos(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [
            1 * Math.sin(-3) * -1, 2 * Math.sin(1) * -1, 3 * Math.sin(2) * -1,
            4 * Math.sin(3) * -1
        ], 1e-1);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.cos({}); })
            .toThrowError(/Argument 'x' passed to 'cos' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('tan', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.tan(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.tan(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.tan(a);
        test_util_1.expectArraysClose(res, [Math.tan(4), NaN, Math.tan(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.tan(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 / (Math.cos(0.5) * Math.cos(0.5))]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-1, 2, 3, -5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.tan(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (Math.cos(aValues[i]) * Math.cos(aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-3, 1, 2, 3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.tan(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (Math.cos(aValues[i]) * Math.cos(aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.tan({}); })
            .toThrowError(/Argument 'x' passed to 'tan' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('asin', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [.1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.asin(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.asin(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.asin(a);
        test_util_1.expectArraysClose(res, [Math.asin(4), NaN, Math.asin(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.asin(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 / Math.sqrt(1 - (0.5 * 0.5))]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-0.1, 0.2, 0.3, -0.5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.asin(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / Math.sqrt(1 - (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-0.3, 0.1, 0.2, 0.3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.asin(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / Math.sqrt(1 - (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.asin({}); })
            .toThrowError(/Argument 'x' passed to 'asin' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('acos', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [.1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.acos(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.acos(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.acos(a);
        test_util_1.expectArraysClose(res, [Math.acos(4), NaN, Math.acos(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.acos(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [(-1 * 8) / Math.sqrt(1 - (0.5 * 0.5))]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-0.1, 0.2, 0.3, -0.5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.acos(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] =
                (-1 * dyValues[i]) / Math.sqrt(1 - (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-0.3, 0.1, 0.2, 0.3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.acos(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] =
                (-1 * dyValues[i]) / Math.sqrt(1 - (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.acos({}); })
            .toThrowError(/Argument 'x' passed to 'acos' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('atan', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.atan(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.atan(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('6D atan', function () {
        var a = tf.range(1, 65).reshape([2, 2, 2, 2, 2, 2]);
        var result = tf.atan(a);
        var expected = [];
        for (var i = 1; i < 65; ++i) {
            expected[i - 1] = Math.atan(i);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.atan(a);
        test_util_1.expectArraysClose(res, [Math.atan(4), NaN, Math.atan(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.atan(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 / (1 + (0.5 * 0.5))]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-0.1, 0.2, 0.3, -0.5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.atan(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (1 + (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-0.3, 0.1, 0.2, 0.3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.atan(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (1 + (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.atan({}); })
            .toThrowError(/Argument 'x' passed to 'atan' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('sinh', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, -1, -4];
        var a = tf.tensor1d(values);
        var result = tf.sinh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.sinh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.sinh(a);
        test_util_1.expectArraysClose(res, [Math.sinh(4), NaN, Math.sinh(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.sinh(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * Math.cosh(0.5)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-1, 2, 3, -5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.sinh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * Math.cosh(aValues[i]);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-3, 1, 2, 3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.sinh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * Math.cosh(aValues[i]);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.sinh({}); })
            .toThrowError(/Argument 'x' passed to 'sinh' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('cosh', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, -1, -4];
        var a = tf.tensor1d(values);
        var result = tf.cosh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.cosh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.cosh(a);
        test_util_1.expectArraysClose(res, [Math.cosh(4), NaN, Math.cosh(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.cosh(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * Math.sinh(0.5)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-1, 2, 3, -5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.cosh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * Math.sinh(aValues[i]);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-3, 1, 2, 3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.cosh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * Math.sinh(aValues[i]);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.cosh({}); })
            .toThrowError(/Argument 'x' passed to 'cosh' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('tanh', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.tanh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = util.tanh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.tanh(a);
        test_util_1.expectArraysClose(res, [util.tanh(4), NaN, util.tanh(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.tanh(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * (1 - (Math.tanh(0.5) * Math.tanh(0.5)))]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-1, 2, 3, -5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.tanh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] =
                dyValues[i] * (1 - (Math.tanh(aValues[i]) * Math.tanh(aValues[i])));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-3, 1, 2, 3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.tanh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] =
                dyValues[i] * (1 - (Math.tanh(aValues[i]) * Math.tanh(aValues[i])));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.tanh({}); })
            .toThrowError(/Argument 'x' passed to 'tanh' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('leakyRelu', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([0, 1, -2]);
        var result = tf.leakyRelu(a);
        expect(result.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(result, [0, 1, -0.4]);
    });
    it('propagates NaN', function () {
        var a = tf.tensor1d([0, 1, NaN]);
        var result = tf.leakyRelu(a);
        expect(result.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(result, [0, 1, NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(-4);
        var dy = tf.scalar(8);
        var alpha = 0.1;
        var gradients = tf.grad(function (a) { return tf.leakyRelu(a, alpha); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * alpha]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [1, -1, 0.1];
        var dyValues = [1, 2, 3];
        var alpha = 0.1;
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.leakyRelu(a, alpha); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1, 2 * alpha, 3]);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [1, -1, 0.1, 0.5];
        var dyValues = [1, 2, 3, 4];
        var alpha = 0.1;
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.leakyRelu(a, alpha); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1, 2 * alpha, 3, 4]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.leakyRelu({}); })
            .toThrowError(/Argument 'x' passed to 'leakyRelu' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('elu', test_util_1.ALL_ENVS, function () {
    it('calculate elu', function () {
        var a = tf.tensor1d([1, -1, 0]);
        var result = tf.elu(a);
        expect(result.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(result, [1, -0.6321, 0]);
    });
    it('elu propagates NaN', function () {
        var a = tf.tensor1d([1, NaN]);
        var result = tf.elu(a);
        expect(result.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(result, [1, NaN]);
    });
    it('derivative', function () {
        var x = tf.tensor1d([1, 3, -2]);
        var dy = tf.tensor1d([5, 50, 500]);
        var gradients = tf.grad(function (a) { return tf.elu(a); })(x, dy);
        expect(gradients.shape).toEqual(x.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [5, 50, 500 * Math.exp(-2)]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.elu({}); })
            .toThrowError(/Argument 'x' passed to 'elu' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('selu', test_util_1.ALL_ENVS, function () {
    var scaleAlpha = selu_util.SELU_SCALEALPHA;
    var scale = selu_util.SELU_SCALE;
    it('calculate selu', function () {
        var a = tf.tensor1d([1, -1, 0]);
        var result = tf.selu(a);
        expect(result.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(result, [1.0507, -1.1113, 0]);
    });
    it('selu propagates NaN', function () {
        var a = tf.tensor1d([1, NaN]);
        var result = tf.selu(a);
        expect(result.shape).toEqual(a.shape);
        test_util_1.expectArraysClose(result, [1.0507, NaN]);
    });
    it('gradients: Scalar', function () {
        var aValue = 1;
        var dyValue = 1;
        var a = tf.scalar(aValue);
        var dy = tf.scalar(dyValue);
        var gradients = tf.grad(function (a) { return tf.selu(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [dyValue * scale]);
        aValue = -1;
        dyValue = 2;
        a = tf.scalar(aValue);
        dy = tf.scalar(dyValue);
        gradients = tf.grad(function (a) { return tf.selu(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [dyValue * scaleAlpha * Math.exp(aValue)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [1, -1, 0];
        var dyValues = [1, 2, 3];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.selu(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            if (aValues[i] > 0) {
                expected[i] = dyValues[i] * scale;
            }
            else {
                expected[i] = dyValues[i] * scaleAlpha * Math.exp(aValues[i]);
            }
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [1, -1, 0, 0.5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.selu(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            if (aValues[i] > 0) {
                expected[i] = dyValues[i] * scale;
            }
            else {
                expected[i] = dyValues[i] * scaleAlpha * Math.exp(aValues[i]);
            }
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.selu({}); })
            .toThrowError(/Argument 'x' passed to 'selu' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('clip', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([3, -1, 0, 100, -7, 2]);
        var min = -1;
        var max = 50;
        var result = tf.clipByValue(a, min, max);
        test_util_1.expectArraysClose(result, [3, -1, 0, 50, -1, 2]);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([3, -1, 0, 100, -7, 2, NaN]);
        var min = -1;
        var max = 50;
        var result = tf.clipByValue(a, min, max);
        test_util_1.expectArraysClose(result, [3, -1, 0, 50, -1, 2, NaN]);
    });
    it('min greater than max', function () {
        var a = tf.tensor1d([3, -1, 0, 100, -7, 2]);
        var min = 1;
        var max = -1;
        var f = function () {
            tf.clipByValue(a, min, max);
        };
        expect(f).toThrowError();
    });
    it('derivative: 1D tensor', function () {
        var min = -1;
        var max = 2;
        var x = tf.tensor1d([3, -2, 1]);
        var dy = tf.tensor1d([5, 50, 500]);
        var gradients = tf.grad(function (x) { return x.clipByValue(min, max); })(x, dy);
        expect(gradients.shape).toEqual(x.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 500]);
    });
    it('derivative: 1D tensor with max or min value', function () {
        var min = -1;
        var max = 2;
        var x = tf.tensor1d([-1, 1, 2, 3]);
        var dy = tf.tensor1d([1, 10, 100, 1000]);
        var gradients = tf.grad(function (x) { return x.clipByValue(min, max); })(x, dy);
        expect(gradients.shape).toEqual(x.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [1, 10, 100, 0]);
    });
    it('derivative: scalar', function () {
        var min = -1;
        var max = 2;
        var x = tf.scalar(-10);
        var dy = tf.scalar(5);
        var gradients = tf.grad(function (x) { return x.clipByValue(min, max); })(x, dy);
        expect(gradients.shape).toEqual(x.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.clipByValue({}, 0, 1); })
            .toThrowError(/Argument 'x' passed to 'clipByValue' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('round', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var a = tf.tensor1d([0.9, 2.5, 2.3, 1.5, -4.5]);
        var r = a.round();
        test_util_1.expectNumbersClose(r.get(0), 1.0);
        test_util_1.expectNumbersClose(r.get(1), 2.0);
        test_util_1.expectNumbersClose(r.get(2), 2.0);
        test_util_1.expectNumbersClose(r.get(3), 2.0);
        test_util_1.expectNumbersClose(r.get(4), -4.0);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([1.5, NaN, -1.4]);
        var r = tf.round(a);
        test_util_1.expectArraysClose(r, [2, NaN, -1]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(5.2);
        var dy = tf.scalar(3);
        var gradients = tf.grad(function (a) { return tf.round(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0]);
    });
    it('gradients: Tensor1D', function () {
        var a = tf.tensor1d([-1.1, 2.6, 3, -5.9]);
        var dy = tf.tensor1d([1, 2, 3, 4]);
        var gradients = tf.grad(function (a) { return tf.round(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('gradients: Tensor2D', function () {
        var a = tf.tensor2d([-3, 1, 2.2, 3], [2, 2]);
        var dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        var gradients = tf.grad(function (a) { return tf.round(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [0, 0, 0, 0]);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.round({}); })
            .toThrowError(/Argument 'x' passed to 'round' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('asinh', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [1, -3, 2, 7, -4];
        var a = tf.tensor1d(values);
        var result = tf.asinh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.asinh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar', function () {
        var a = tf.scalar(1);
        var result = tf.asinh(a);
        var expected = [Math.asinh(1)];
        test_util_1.expectArraysClose(result, expected);
    });
    it('tensor2D', function () {
        var values = [1, -3, 2, 7];
        var a = tf.tensor2d(values, [2, 2]);
        var result = tf.asinh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.asinh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 0]);
        var res = tf.asinh(a);
        test_util_1.expectArraysClose(res, [Math.asinh(4), NaN, Math.asinh(0)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.asinh(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 / Math.sqrt(1.0 + 0.5 * 0.5)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-1, 2, 3, -5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.asinh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / Math.sqrt(1 + aValues[i] * aValues[i]);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-3, 1, 2, 3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.asinh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / Math.sqrt(1 + aValues[i] * aValues[i]);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.asinh({}); })
            .toThrowError(/Argument 'x' passed to 'asinh' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('acosh', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [2, 3, 4, 5, 6];
        var a = tf.tensor1d(values);
        var result = tf.acosh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.acosh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar', function () {
        var value = 2;
        var a = tf.scalar(value);
        var result = tf.acosh(a);
        var expected = [Math.acosh(value)];
        test_util_1.expectArraysClose(result, expected);
    });
    it('tensor2d', function () {
        var values = [2, 3, 4, 5];
        var a = tf.tensor2d(values, [2, 2]);
        var result = tf.acosh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.acosh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([4, NaN, 2]);
        var res = tf.acosh(a);
        test_util_1.expectArraysClose(res, [Math.acosh(4), NaN, Math.acosh(2)]);
    });
    it('NaN outside function domain', function () {
        var a = tf.tensor1d([4, -1, 2]);
        var res = tf.acosh(a);
        test_util_1.expectArraysClose(res, [Math.acosh(4), NaN, Math.acosh(2)]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(1.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.acosh(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8.0 / Math.sqrt(1.5 * 1.5 - 1.0)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [2, 3, 5, 10];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.acosh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / Math.sqrt(Math.pow(aValues[i], 2) - 1.0);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [2, 3, 5, 7];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.acosh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / Math.sqrt(Math.pow(aValues[i], 2) - 1.0);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.acosh({}); })
            .toThrowError(/Argument 'x' passed to 'acosh' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('atanh', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [-0.25, 0.25, 0.5, .75, -0.4];
        var a = tf.tensor1d(values);
        var result = tf.atanh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.atanh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar', function () {
        var value = 0.2;
        var a = tf.scalar(value);
        var result = tf.atanh(a);
        var expected = [Math.atanh(value)];
        test_util_1.expectArraysClose(result, expected);
    });
    it('tensor2d', function () {
        var values = [0.2, 0.3, 0.4, 0.5];
        var a = tf.tensor2d(values, [2, 2]);
        var result = tf.atanh(a);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = Math.atanh(values[i]);
        }
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([0.5, NaN, 0]);
        var res = tf.atanh(a);
        test_util_1.expectArraysClose(res, [Math.atanh(0.5), NaN, Math.atanh(0)]);
    });
    it('NaN outside function domain', function () {
        var a = tf.tensor1d([-2, 0, 2]);
        var res = tf.atanh(a);
        test_util_1.expectArraysClose(res, [NaN, Math.atanh(0), NaN]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.atanh(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 / (1 - 0.5 * 0.5)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-0.1, 0.2, 0.3, -0.5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.atanh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (1 - Math.pow(aValues[i], 2));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-0.3, 0.1, 0.2, 0.3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.atanh(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (1 - Math.pow(aValues[i], 2));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('throws when passed a non-tensor', function () {
        expect(function () { return tf.atanh({}); })
            .toThrowError(/Argument 'x' passed to 'atanh' must be a Tensor/);
    });
});
jasmine_util_1.describeWithFlags('erf', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var values = [-0.25, 0.25, 0.5, .75, -0.4];
        var a = tf.tensor1d(values);
        var result = tf.erf(a);
        var expected = [-0.2763264, 0.2763264, 0.5204999, 0.7111556, -0.4283924];
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar', function () {
        var a = tf.scalar(1);
        var result = tf.erf(a);
        var expected = [0.8427008];
        test_util_1.expectArraysClose(result, expected);
    });
    it('scalar in int32', function () {
        var a = tf.scalar(1, 'int32');
        var result = tf.erf(a);
        var expected = [0.8427008];
        test_util_1.expectArraysClose(result, expected);
    });
    it('tensor2d', function () {
        var values = [0.2, 0.3, 0.4, 0.5];
        var a = tf.tensor2d(values, [2, 2]);
        var result = tf.erf(a);
        var expected = [0.2227026, 0.32862678, 0.42839235, 0.5204999];
        test_util_1.expectArraysClose(result, expected);
    });
    it('propagates NaNs', function () {
        var a = tf.tensor1d([0.5, NaN, 0]);
        var res = tf.erf(a);
        test_util_1.expectArraysClose(res, [0.5204999, NaN, 0.0]);
    });
    it('gradients: Scalar', function () {
        var a = tf.scalar(0.5);
        var dy = tf.scalar(8);
        var gradients = tf.grad(function (a) { return tf.erf(a); })(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, [8 * 2 * Math.exp(-0.5 * 0.5) / Math.sqrt(Math.PI)]);
    });
    it('gradients: Tensor1D', function () {
        var aValues = [-0.1, 0.2, 0.3, -0.5];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor1d(aValues);
        var dy = tf.tensor1d(dyValues);
        var gradients = tf.grad(function (a) { return tf.erf(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * 2 * Math.exp(-aValues[i] * aValues[i]) /
                Math.sqrt(Math.PI);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
    it('gradients: Tensor2D', function () {
        var aValues = [-0.3, 0.1, 0.2, 0.3];
        var dyValues = [1, 2, 3, 4];
        var a = tf.tensor2d(aValues, [2, 2]);
        var dy = tf.tensor2d(dyValues, [2, 2]);
        var gradients = tf.grad(function (a) { return tf.erf(a); })(a, dy);
        var expected = [];
        for (var i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * 2 * Math.exp(-aValues[i] * aValues[i]) /
                Math.sqrt(Math.PI);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        test_util_1.expectArraysClose(gradients, expected);
    });
});
//# sourceMappingURL=unary_ops_test.js.map