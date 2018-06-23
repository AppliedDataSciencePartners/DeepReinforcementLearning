"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var generic_utils_1 = require("./generic_utils");
var math_utils_1 = require("./math_utils");
function normalizeArray(value, n, name) {
    if (typeof value === 'number') {
        return generic_utils_1.pyListRepeat(value, n);
    }
    else {
        if (value.length !== n) {
            throw new errors_1.ValueError("The " + name + " argument must be a tuple of " + n + " integers. Received: " +
                (value.length + " elements."));
        }
        for (var i = 0; i < n; ++i) {
            var singleValue = value[i];
            if (!math_utils_1.isInteger(singleValue)) {
                throw new errors_1.ValueError("The " + name + " argument must be a tuple of " + n + " integers. Received: " +
                    (JSON.stringify(value) + " including a non-integer number ") +
                    ("" + singleValue));
            }
        }
        return value;
    }
}
exports.normalizeArray = normalizeArray;
function convOutputLength(inputLength, filterSize, padding, stride, dilation) {
    if (dilation === void 0) { dilation = 1; }
    if (inputLength == null) {
        return inputLength;
    }
    var dilatedFilterSize = filterSize + (filterSize - 1) * (dilation - 1);
    var outputLength;
    if (padding === 'same') {
        outputLength = inputLength;
    }
    else {
        outputLength = inputLength - dilatedFilterSize + 1;
    }
    return Math.floor((outputLength + stride - 1) / stride);
}
exports.convOutputLength = convOutputLength;
function deconvLength(dimSize, strideSize, kernelSize, padding) {
    if (dimSize == null) {
        return null;
    }
    if (padding === 'valid') {
        dimSize = dimSize * strideSize + math_utils_1.max([kernelSize - strideSize, 0]);
    }
    else if (padding === 'same') {
        dimSize = dimSize * strideSize;
    }
    else {
        throw new errors_1.ValueError("Unsupport padding mode: " + padding + ".");
    }
    return dimSize;
}
exports.deconvLength = deconvLength;
//# sourceMappingURL=conv_utils.js.map