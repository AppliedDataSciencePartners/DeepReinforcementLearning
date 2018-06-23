"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
jasmine_util_1.describeWithFlags('AdadeltaOptimizer', test_util_1.ALL_ENVS, function () {
    it('basic', function () {
        var learningRate = .1;
        var rho = .95;
        var optimizer = tf.train.adadelta(learningRate, rho);
        var x = tf.tensor1d([1, 2]).variable();
        var f = function () { return x.square().sum(); };
        var numTensors = tf.memory().numTensors;
        var cost = optimizer.minimize(f, true);
        expect(tf.memory().numTensors).toBe(numTensors + 3);
        test_util_1.expectArraysClose(x, [0.8, 1.6]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, false);
        test_util_1.expectArraysClose(x, [0.64, 1.28]);
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        expect(tf.memory().numTensors).toBe(1);
    });
    it('serialization round-trip', function () {
        var originalOpt = tf.train.adadelta(0.1, 0.2, 2e-8);
        var reserialized = tf.AdadeltaOptimizer.fromConfig(tf.AdadeltaOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=adadelta_optimizer_test.js.map