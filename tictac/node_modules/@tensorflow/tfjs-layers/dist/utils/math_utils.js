"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var errors_1 = require("../errors");
function isInteger(x) {
    return x === parseInt(x.toString(), 10);
}
exports.isInteger = isInteger;
function arrayProd(array, begin, end) {
    if (begin == null) {
        begin = 0;
    }
    if (end == null) {
        end = array.length;
    }
    var prod = 1;
    for (var i = begin; i < end; ++i) {
        prod *= array[i];
    }
    return prod;
}
exports.arrayProd = arrayProd;
function toArray1D(array) {
    array = Array.isArray(array) ? new Float32Array(array) : array;
    return tfjs_core_1.tensor1d(array);
}
function min(array) {
    return tfc.min(toArray1D(array)).dataSync()[0];
}
exports.min = min;
function max(array) {
    return tfc.max(toArray1D(array)).dataSync()[0];
}
exports.max = max;
function sum(array) {
    return tfc.sum(toArray1D(array)).dataSync()[0];
}
exports.sum = sum;
function mean(array) {
    return sum(array) / array.length;
}
exports.mean = mean;
function variance(array) {
    var demeaned = tfc.sub(toArray1D(array), tfjs_core_1.scalar(mean(array)));
    var sumSquare = tfc.sum(tfc.mulStrict(demeaned, demeaned)).dataSync()[0];
    return sumSquare / array.length;
}
exports.variance = variance;
function median(array) {
    var arraySorted = array.slice().sort(function (a, b) { return a - b; });
    var lowIdx = Math.floor((arraySorted.length - 1) / 2);
    var highIdx = Math.ceil((arraySorted.length - 1) / 2);
    if (lowIdx === highIdx) {
        return arraySorted[lowIdx];
    }
    return (arraySorted[lowIdx] + arraySorted[highIdx]) / 2;
}
exports.median = median;
function range(begin, end) {
    if (end < begin) {
        throw new errors_1.ValueError("end (" + end + ") < begin (" + begin + ") is forbidden.");
    }
    var out = [];
    for (var i = begin; i < end; ++i) {
        out.push(i);
    }
    return out;
}
exports.range = range;
//# sourceMappingURL=math_utils.js.map