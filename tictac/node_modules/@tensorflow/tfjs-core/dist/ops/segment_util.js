"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var reduce_util_1 = require("./reduce_util");
function segOpComputeOptimalWindowSize(inSize, numSegments) {
    var done = false;
    var res;
    if (inSize <= reduce_util_1.PARALLELIZE_THRESHOLD) {
        res = inSize;
        done = true;
    }
    else {
        res = util_1.nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
    }
    while (!done) {
        if (res > numSegments || res === inSize) {
            done = true;
            break;
        }
        else {
            res = util_1.nearestDivisor(inSize, res + 1);
        }
    }
    return res;
}
exports.segOpComputeOptimalWindowSize = segOpComputeOptimalWindowSize;
function computeOutShape(aShape, axis, numSegments) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (dim !== axis) {
            outShape.push(aShape[dim]);
        }
        else {
            outShape.push(numSegments);
        }
    }
    return outShape;
}
exports.computeOutShape = computeOutShape;
//# sourceMappingURL=segment_util.js.map