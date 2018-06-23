"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
jasmine_util_1.describeWithFlags('SGDOptimizer', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var learningRate = .1;
        var optimizer = tf.train.sgd(learningRate);
        var x = tf.scalar(4).variable();
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(function () { return x.square(); }, true);
        expect(tf.memory().numTensors).toBe(numTensors + 1);
        var expectedValue1 = -2 * 4 * learningRate + 4;
        test_util_1.expectArraysClose(x, [expectedValue1]);
        test_util_1.expectArraysClose(cost, [Math.pow(4, 2)]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(function () { return x.square(); }, false);
        expect(tf.memory().numTensors).toBe(numTensors);
        var expectedValue2 = -2 * expectedValue1 * learningRate + expectedValue1;
        test_util_1.expectArraysClose(x, [expectedValue2]);
        expect(cost).toBe(null);
        optimizer.dispose();
        x.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('serialization round-trip', function () {
        var learningRate = .1;
        var originalOpt = tf.train.sgd(learningRate);
        var reserialized = tf.SGDOptimizer.fromConfig(tf.SGDOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=sgd_optimizer_test.js.map