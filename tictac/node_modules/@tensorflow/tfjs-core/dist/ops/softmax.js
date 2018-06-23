"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var globals_1 = require("../globals");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var ops = require("./ops");
var SoftmaxOps = (function () {
    function SoftmaxOps() {
    }
    SoftmaxOps.softmax = function (logits, dim) {
        if (dim === void 0) { dim = -1; }
        util.assertArgumentsAreTensors({ logits: logits }, 'softmax');
        if (dim === -1) {
            dim = logits.rank - 1;
        }
        if (dim !== logits.rank - 1) {
            throw Error('Softmax along a non-last dimension is not yet supported. ' +
                ("Logits was rank " + logits.rank + " and dim was " + dim));
        }
        var customOp = globals_1.customGrad(function (logits) {
            var keepDims = true;
            var lse = logits.logSumExp([dim], keepDims);
            var logResult = logits.toFloat().sub(lse);
            var y = logResult.exp();
            var gradFunc = function (dy) {
                var dyTimesY = dy.mul(y);
                var keepDims = true;
                return dyTimesY.sub(dyTimesY.sum([dim], keepDims).mul(y));
            };
            return { value: y, gradFunc: gradFunc };
        });
        return customOp(logits);
    };
    SoftmaxOps.softmaxCrossEntropy = function (labels, logits, dim) {
        if (dim === void 0) { dim = -1; }
        util.assertArgumentsAreTensors({ labels: labels, logits: logits }, 'softmaxCrossEntropy');
        util.assertShapesMatch(labels.shape, logits.shape, 'Error in softmaxCrossEntropy: ');
        if (dim === -1) {
            dim = logits.rank - 1;
        }
        if (dim !== logits.rank - 1) {
            throw Error("Softmax cross entropy along a non-last dimension is not yet " +
                ("supported. Labels / logits was rank " + logits.rank + " ") +
                ("and dim was " + dim));
        }
        var customOp = globals_1.customGrad(function (labels, logits) {
            var predictedProbs = logits.softmax(dim);
            var costVector = ops.scalar(1e-5).add(predictedProbs).log().mul(labels).neg();
            var value = costVector.sum([dim]);
            var gradFunc = function (dy) {
                var dyShape = axis_util.expandShapeToKeepDim(dy.shape, [dim]);
                return [
                    dy.reshape(dyShape).mul(labels.toFloat().sub(predictedProbs)),
                    dy.reshape(dyShape).mul(predictedProbs.sub(labels.toFloat())),
                ];
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(labels, logits);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation_1.operation
    ], SoftmaxOps, "softmax", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation_1.operation
    ], SoftmaxOps, "softmaxCrossEntropy", null);
    return SoftmaxOps;
}());
exports.SoftmaxOps = SoftmaxOps;
//# sourceMappingURL=softmax.js.map