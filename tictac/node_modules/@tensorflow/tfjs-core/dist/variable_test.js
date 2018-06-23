"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("./index");
var tensor_1 = require("./tensor");
var test_util_1 = require("./test_util");
var jasmine_util_1 = require("./jasmine_util");
jasmine_util_1.describeWithFlags('variable', test_util_1.ALL_ENVS, function () {
    it('simple assign', function () {
        var v = tensor_1.variable(tf.tensor1d([1, 2, 3]));
        test_util_1.expectArraysClose(v, [1, 2, 3]);
        v.assign(tf.tensor1d([4, 5, 6]));
        test_util_1.expectArraysClose(v, [4, 5, 6]);
    });
    it('simple chain assign', function () {
        var v = tf.tensor1d([1, 2, 3]).variable();
        test_util_1.expectArraysClose(v, [1, 2, 3]);
        v.assign(tf.tensor1d([4, 5, 6]));
        test_util_1.expectArraysClose(v, [4, 5, 6]);
    });
    it('default names are unique', function () {
        var v = tensor_1.variable(tf.tensor1d([1, 2, 3]));
        expect(v.name).not.toBeNull();
        var v2 = tensor_1.variable(tf.tensor1d([1, 2, 3]));
        expect(v2.name).not.toBeNull();
        expect(v.name).not.toBe(v2.name);
    });
    it('user provided name', function () {
        var v = tensor_1.variable(tf.tensor1d([1, 2, 3]), true, 'myName');
        expect(v.name).toBe('myName');
    });
    it('if name already used, throw error', function () {
        tensor_1.variable(tf.tensor1d([1, 2, 3]), true, 'myName');
        expect(function () { return tensor_1.variable(tf.tensor1d([1, 2, 3]), true, 'myName'); })
            .toThrowError();
    });
    it('ops can take variables', function () {
        var value = tf.tensor1d([1, 2, 3]);
        var v = tensor_1.variable(value);
        var res = tf.sum(v);
        test_util_1.expectArraysClose(res, [6]);
    });
    it('chained variables works', function () {
        var v = tf.tensor1d([1, 2, 3]).variable();
        var res = tf.sum(v);
        test_util_1.expectArraysClose(res, [6]);
    });
    it('variables are not affected by tidy', function () {
        var v;
        expect(tf.memory().numTensors).toBe(0);
        tf.tidy(function () {
            var value = tf.tensor1d([1, 2, 3], 'float32');
            expect(tf.memory().numTensors).toBe(1);
            v = tensor_1.variable(value);
            expect(tf.memory().numTensors).toBe(2);
        });
        expect(tf.memory().numTensors).toBe(1);
        test_util_1.expectArraysClose(v, [1, 2, 3]);
        v.dispose();
        expect(tf.memory().numTensors).toBe(0);
    });
    it('constructor does not dispose', function () {
        var a = tf.scalar(2);
        var v = tf.variable(a);
        expect(tf.memory().numTensors).toBe(2);
        expect(tf.memory().numDataBuffers).toBe(1);
        test_util_1.expectArraysClose(v, [2]);
        test_util_1.expectArraysClose(a, [2]);
    });
    it('variables are assignable to tensors', function () {
        var x0 = null;
        var y0 = x0;
        expect(y0).toBeNull();
        var x1 = null;
        var y1 = x1;
        expect(y1).toBeNull();
        var x2 = null;
        var y2 = x2;
        expect(y2).toBeNull();
        var x3 = null;
        var y3 = x3;
        expect(y3).toBeNull();
        var x4 = null;
        var y4 = x4;
        expect(y4).toBeNull();
        var xh = null;
        var yh = xh;
        expect(yh).toBeNull();
    });
    it('assign does not dispose old data', function () {
        var v;
        v = tensor_1.variable(tf.tensor1d([1, 2, 3]));
        expect(tf.memory().numTensors).toBe(2);
        expect(tf.memory().numDataBuffers).toBe(1);
        test_util_1.expectArraysClose(v, [1, 2, 3]);
        var secondArray = tf.tensor1d([4, 5, 6]);
        expect(tf.memory().numTensors).toBe(3);
        expect(tf.memory().numDataBuffers).toBe(2);
        v.assign(secondArray);
        test_util_1.expectArraysClose(v, [4, 5, 6]);
        expect(tf.memory().numTensors).toBe(3);
        expect(tf.memory().numDataBuffers).toBe(2);
        v.dispose();
        expect(tf.memory().numTensors).toBe(2);
        expect(tf.memory().numDataBuffers).toBe(2);
    });
    it('shape must match', function () {
        var v = tensor_1.variable(tf.tensor1d([1, 2, 3]));
        expect(function () { return v.assign(tf.tensor1d([1, 2])); }).toThrowError();
        expect(function () { return v.assign(tf.tensor2d([3, 4], [1, 2])); }).toThrowError();
    });
    it('dtype must match', function () {
        var v = tensor_1.variable(tf.tensor1d([1, 2, 3]));
        expect(function () { return v.assign(tf.tensor1d([1, 1, 1], 'int32')); })
            .toThrowError();
        expect(function () { return v.assign(tf.tensor1d([true, false, true], 'bool')); })
            .toThrowError();
    });
});
//# sourceMappingURL=variable_test.js.map