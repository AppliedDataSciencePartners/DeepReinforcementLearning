"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
exports.PARALLELIZE_THRESHOLD = 30;
function computeOptimalWindowSize(inSize) {
    if (inSize <= exports.PARALLELIZE_THRESHOLD) {
        return inSize;
    }
    return util_1.nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
}
exports.computeOptimalWindowSize = computeOptimalWindowSize;
//# sourceMappingURL=reduce_util.js.map