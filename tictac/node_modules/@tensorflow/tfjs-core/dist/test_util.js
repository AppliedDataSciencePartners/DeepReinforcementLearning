"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var tensor_1 = require("./tensor");
var util = require("./util");
exports.WEBGL_ENVS = [
    {
        'BACKEND': 'test-webgl',
        'WEBGL_RENDER_FLOAT32_ENABLED': true,
        'WEBGL_DOWNLOAD_FLOAT_ENABLED': true,
        'WEBGL_VERSION': 1
    },
    {
        'BACKEND': 'test-webgl',
        'WEBGL_RENDER_FLOAT32_ENABLED': true,
        'WEBGL_DOWNLOAD_FLOAT_ENABLED': true,
        'WEBGL_VERSION': 2
    }
];
exports.CPU_ENVS = [{ 'BACKEND': 'test-cpu' }];
exports.CHROME_CPU_ENVS = [{ 'BACKEND': 'test-cpu', 'IS_CHROME': true }];
exports.NATIVE_ENV = {};
exports.BROWSER_ENVS = exports.WEBGL_ENVS.concat(exports.CPU_ENVS);
exports.ALL_ENVS = [exports.NATIVE_ENV].concat(exports.BROWSER_ENVS);
function expectArraysClose(actual, expected, epsilon) {
    if (epsilon == null) {
        epsilon = environment_1.ENV.get('TEST_EPSILON');
    }
    if (!(actual instanceof tensor_1.Tensor) && !(expected instanceof tensor_1.Tensor)) {
        var aType = actual.constructor.name;
        var bType = expected.constructor.name;
        if (aType !== bType) {
            throw new Error("Arrays are of different type actual: " + aType + " " +
                ("vs expected: " + bType));
        }
    }
    else if (actual instanceof tensor_1.Tensor && expected instanceof tensor_1.Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error("Arrays are of different type actual: " + actual.dtype + " " +
                ("vs expected: " + expected.dtype + "."));
        }
        if (!util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error("Arrays are of different shape actual: " + actual.shape + " " +
                ("vs expected: " + expected.shape + "."));
        }
    }
    var actualValues;
    var expectedValues;
    if (actual instanceof tensor_1.Tensor) {
        actualValues = actual.dataSync();
    }
    else {
        actualValues = actual;
    }
    if (expected instanceof tensor_1.Tensor) {
        expectedValues = expected.dataSync();
    }
    else {
        expectedValues = expected;
    }
    if (actualValues.length !== expectedValues.length) {
        throw new Error("Arrays have different lengths actual: " + actualValues.length + " vs " +
            ("expected: " + expectedValues.length + ".\n") +
            ("Actual:   " + actualValues + ".\n") +
            ("Expected: " + expectedValues + "."));
    }
    for (var i = 0; i < expectedValues.length; ++i) {
        var a = actualValues[i];
        var e = expectedValues[i];
        if (!areClose(a, Number(e), epsilon)) {
            throw new Error("Arrays differ: actual[" + i + "] = " + a + ", expected[" + i + "] = " + e + ".\n" +
                ("Actual:   " + actualValues + ".\n") +
                ("Expected: " + expectedValues + "."));
        }
    }
}
exports.expectArraysClose = expectArraysClose;
function expectPromiseToFail(fn, done) {
    fn().then(function () { return done.fail(); }, function () { return done(); });
}
exports.expectPromiseToFail = expectPromiseToFail;
function expectArraysEqual(actual, expected) {
    return expectArraysClose(actual, expected, 0);
}
exports.expectArraysEqual = expectArraysEqual;
function expectNumbersClose(a, e, epsilon) {
    if (epsilon == null) {
        epsilon = environment_1.ENV.get('TEST_EPSILON');
    }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
exports.expectNumbersClose = expectNumbersClose;
function areClose(a, e, epsilon) {
    if (isNaN(a) && isNaN(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
function expectValuesInRange(actual, low, high) {
    var actualVals;
    if (actual instanceof tensor_1.Tensor) {
        actualVals = actual.dataSync();
    }
    else {
        actualVals = actual;
    }
    for (var i = 0; i < actualVals.length; i++) {
        if (actualVals[i] < low || actualVals[i] > high) {
            throw new Error("Value out of range:" + actualVals[i] + " low: " + low + ", high: " + high);
        }
    }
}
exports.expectValuesInRange = expectValuesInRange;
function expectArrayBuffersEqual(actual, expected) {
    expect(new Float32Array(actual)).toEqual(new Float32Array(expected));
}
exports.expectArrayBuffersEqual = expectArrayBuffersEqual;
//# sourceMappingURL=test_util.js.map