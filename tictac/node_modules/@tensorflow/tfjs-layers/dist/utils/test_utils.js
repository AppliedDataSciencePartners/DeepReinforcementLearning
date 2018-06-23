"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var jasmine_util_1 = require("@tensorflow/tfjs-core/dist/jasmine_util");
var tfjs_backend_1 = require("../backend/tfjs_backend");
var errors_1 = require("../errors");
function expectTensorsClose(actual, expected, epsilon) {
    if (actual == null) {
        throw new errors_1.ValueError('First argument to expectTensorsClose() is not defined.');
    }
    if (expected == null) {
        throw new errors_1.ValueError('Second argument to expectTensorsClose() is not defined.');
    }
    tfjs_core_1.test_util.expectArraysClose(actual, expected, epsilon);
}
exports.expectTensorsClose = expectTensorsClose;
function expectTensorsValuesInRange(actual, low, high) {
    if (actual == null) {
        throw new errors_1.ValueError('First argument to expectTensorsClose() is not defined.');
    }
    tfjs_core_1.test_util.expectValuesInRange(actual.dataSync(), low, high);
}
exports.expectTensorsValuesInRange = expectTensorsValuesInRange;
function describeMathCPUAndGPU(testName, tests) {
    jasmine_util_1.describeWithFlags(testName, tfjs_core_1.test_util.ALL_ENVS, function () {
        beforeEach(function () {
            tfjs_backend_1.disposeScalarCache();
        });
        tests();
    });
}
exports.describeMathCPUAndGPU = describeMathCPUAndGPU;
function describeMathCPU(testName, tests) {
    jasmine_util_1.describeWithFlags(testName, tfjs_core_1.test_util.CPU_ENVS, function () {
        beforeEach(function () {
            tfjs_backend_1.disposeScalarCache();
        });
        tests();
    });
}
exports.describeMathCPU = describeMathCPU;
function describeMathGPU(testName, tests) {
    jasmine_util_1.describeWithFlags(testName, tfjs_core_1.test_util.WEBGL_ENVS, function () {
        beforeEach(function () {
            tfjs_backend_1.disposeScalarCache();
        });
        tests();
    });
}
exports.describeMathGPU = describeMathGPU;
function expectNoLeakedTensors(testFunc, numNewTensors) {
    testFunc();
    var numTensorsBefore = tfjs_core_1.memory().numTensors;
    testFunc();
    var numTensorsAfter = tfjs_core_1.memory().numTensors;
    var actualNewTensors = numTensorsAfter - numTensorsBefore;
    if (actualNewTensors !== numNewTensors) {
        throw new errors_1.ValueError("Created an unexpected number of new " +
            ("Tensors.  Expected: " + numNewTensors + ", created : " + actualNewTensors + ". ") +
            "Please investigate the discrepency and/or use tidy.");
    }
}
exports.expectNoLeakedTensors = expectNoLeakedTensors;
//# sourceMappingURL=test_utils.js.map