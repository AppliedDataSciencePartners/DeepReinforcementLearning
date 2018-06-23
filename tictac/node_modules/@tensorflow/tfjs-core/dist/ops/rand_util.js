"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var tensor_1 = require("../tensor");
var test_util_1 = require("../test_util");
function jarqueBeraNormalityTest(a) {
    var values;
    if (a instanceof tensor_1.Tensor) {
        values = a.dataSync();
    }
    else {
        values = a;
    }
    var n = values.length;
    var s = skewness(values);
    var k = kurtosis(values);
    var jb = n / 6 * (Math.pow(s, 2) + 0.25 * Math.pow(k - 3, 2));
    var CHI_SQUARE_2DEG = 5.991;
    if (jb > CHI_SQUARE_2DEG) {
        throw new Error("Invalid p-value for JB: " + jb);
    }
}
exports.jarqueBeraNormalityTest = jarqueBeraNormalityTest;
function expectArrayInMeanStdRange(actual, expectedMean, expectedStdDev, epsilon) {
    if (epsilon == null) {
        epsilon = environment_1.ENV.get('TEST_EPSILON');
    }
    var actualValues;
    if (actual instanceof tensor_1.Tensor) {
        actualValues = actual.dataSync();
    }
    else {
        actualValues = actual;
    }
    var actualMean = mean(actualValues);
    test_util_1.expectNumbersClose(actualMean, expectedMean, epsilon);
    test_util_1.expectNumbersClose(standardDeviation(actualValues, actualMean), expectedStdDev, epsilon);
}
exports.expectArrayInMeanStdRange = expectArrayInMeanStdRange;
function mean(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum / values.length;
}
function standardDeviation(values, mean) {
    var squareDiffSum = 0;
    for (var i = 0; i < values.length; i++) {
        var diff = values[i] - mean;
        squareDiffSum += diff * diff;
    }
    return Math.sqrt(squareDiffSum / values.length);
}
function kurtosis(values) {
    var valuesMean = mean(values);
    var n = values.length;
    var sum2 = 0;
    var sum4 = 0;
    for (var i = 0; i < n; i++) {
        var v = values[i] - valuesMean;
        sum2 += Math.pow(v, 2);
        sum4 += Math.pow(v, 4);
    }
    return (1 / n) * sum4 / Math.pow((1 / n) * sum2, 2);
}
function skewness(values) {
    var valuesMean = mean(values);
    var n = values.length;
    var sum2 = 0;
    var sum3 = 0;
    for (var i = 0; i < n; i++) {
        var v = values[i] - valuesMean;
        sum2 += Math.pow(v, 2);
        sum3 += Math.pow(v, 3);
    }
    return (1 / n) * sum3 / Math.pow((1 / (n - 1)) * sum2, 3 / 2);
}
//# sourceMappingURL=rand_util.js.map