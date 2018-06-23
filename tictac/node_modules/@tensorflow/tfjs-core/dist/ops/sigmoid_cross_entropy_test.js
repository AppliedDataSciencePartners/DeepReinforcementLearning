"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
jasmine_util_1.describeWithFlags('sigmoidCrossEntropyWithLogits', test_util_1.ALL_ENVS, function () {
    var sigmoid = function (val) { return 1 / (1 + Math.exp(-val)); };
    var getExpectedVal = function (labelValues, logitValues) {
        var expected = [];
        for (var i = 0; i < labelValues.length; i++) {
            expected[i] = labelValues[i] * -1 * Math.log(sigmoid(logitValues[i])) +
                ((1 - labelValues[i]) * -1 * Math.log(1 - sigmoid(logitValues[i])));
        }
        return expected;
    };
    it('1D', function () {
        var logitValues = [1, 2, 3];
        var labelValues = [0.3, -0.6, 0.1];
        var logits = tf.tensor1d(logitValues);
        var label = tf.tensor1d(labelValues);
        var expected = getExpectedVal(labelValues, logitValues);
        var y = tf.sigmoidCrossEntropyWithLogits(label, logits);
        expect(y.shape).toEqual([3]);
        test_util_1.expectArraysClose(y, expected);
    });
    it('2D', function () {
        var logitValues = [1, 2, 3, 4, 5, 6];
        var labelValues = [0.3, 0.6, 0.1, 0.2, 0.3, 0.5];
        var logits = tf.tensor2d(logitValues, [2, 3]);
        var label = tf.tensor2d(labelValues, [2, 3]);
        var y = tf.sigmoidCrossEntropyWithLogits(label, logits);
        var expected = getExpectedVal(labelValues, logitValues);
        expect(y.shape).toEqual([2, 3]);
        test_util_1.expectArraysClose(y, expected);
    });
    it('Propagates NaNs', function () {
        var logitValues = [1, 2, NaN];
        var labelValues = [0.3, -0.6, 0.1];
        var logits = tf.tensor1d(logitValues);
        var label = tf.tensor1d(labelValues);
        var expected = getExpectedVal(labelValues, logitValues);
        var y = tf.sigmoidCrossEntropyWithLogits(label, logits);
        expect(y.shape).toEqual([3]);
        test_util_1.expectArraysClose(y, expected);
    });
    it('throws when passed labels as a non-tensor', function () {
        var e = /Argument 'labels' passed to 'sigmoidCrossEntropyWithLogits' must be a Tensor/;
        expect(function () { return tf.sigmoidCrossEntropyWithLogits({}, tf.tensor1d([
            1
        ])); }).toThrowError(e);
    });
    it('throws when passed logits as a non-tensor', function () {
        var e = /Argument 'logits' passed to 'sigmoidCrossEntropyWithLogits' must be a Tensor/;
        expect(function () {
            return tf.sigmoidCrossEntropyWithLogits(tf.tensor1d([1]), {});
        })
            .toThrowError(e);
    });
});
//# sourceMappingURL=sigmoid_cross_entropy_test.js.map