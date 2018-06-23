"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var array_ops_1 = require("./array_ops");
var binary_ops_1 = require("./binary_ops");
var compare_1 = require("./compare");
var logical_ops_1 = require("./logical_ops");
var operation_1 = require("./operation");
var SegmentOps = (function () {
    function SegmentOps() {
    }
    SegmentOps.unsortedSegmentSum = function (x, segmentIds, numSegments) {
        util.assertArgumentsAreTensors({ x: x, segmentIds: segmentIds }, 'unsortedSegmentSum');
        util.assert(segmentIds.dtype === 'int32', 'segmentIds must be of dtype `int32`');
        util.assert(util.isInt(numSegments), 'numSegments must be of dtype int');
        var gradFunc = function (dy) {
            var derX = function () {
                return gatherDropNegatives(dy, segmentIds);
            };
            return { x: derX };
        };
        return environment_1.ENV.engine.runKernel(function (backend) {
            return backend.unsortedSegmentSum(x, segmentIds, numSegments);
        }, { x: x }, gradFunc);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Segment' }),
        operation_1.operation
    ], SegmentOps, "unsortedSegmentSum", null);
    return SegmentOps;
}());
exports.SegmentOps = SegmentOps;
function gatherDropNegatives(x, indices) {
    var zeroClippedIndices = binary_ops_1.BinaryOps.maximum(indices, array_ops_1.ArrayOps.zerosLike(indices));
    var gathered = array_ops_1.ArrayOps.gather(x, zeroClippedIndices);
    var isPositive = compare_1.CompareOps.greaterEqual(indices, array_ops_1.ArrayOps.scalar(0, 'int32'));
    var numIters = gathered.rank - isPositive.rank;
    for (var i = 0; i < numIters; ++i) {
        isPositive = array_ops_1.ArrayOps.expandDims(isPositive, i + 1);
    }
    isPositive =
        logical_ops_1.LogicalOps.logicalAnd(isPositive, array_ops_1.ArrayOps.ones(gathered.shape, 'bool'));
    var zeroSlice = array_ops_1.ArrayOps.zerosLike(gathered);
    return logical_ops_1.LogicalOps.where(isPositive, gathered, zeroSlice);
}
//# sourceMappingURL=segment_ops.js.map