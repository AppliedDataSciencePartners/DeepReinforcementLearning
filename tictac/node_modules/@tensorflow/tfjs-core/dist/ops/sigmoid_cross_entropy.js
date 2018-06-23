"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var util = require("../util");
var operation_1 = require("./operation");
var SigmoidCrossEntropyOps = (function () {
    function SigmoidCrossEntropyOps() {
    }
    SigmoidCrossEntropyOps.sigmoidCrossEntropyWithLogits = function (labels, logits) {
        util.assertArgumentsAreTensors({ labels: labels, logits: logits }, 'sigmoidCrossEntropyWithLogits');
        util.assertShapesMatch(labels.shape, logits.shape, 'Error in sigmoidCrossEntropyWithLogits: ');
        var maxOutput = logits.relu();
        var outputXTarget = logits.mul(labels);
        var sigmoidOutput = logits.abs().neg().exp().log1p();
        return maxOutput.sub(outputXTarget).add(sigmoidOutput);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Cross Entropy' }),
        operation_1.operation
    ], SigmoidCrossEntropyOps, "sigmoidCrossEntropyWithLogits", null);
    return SigmoidCrossEntropyOps;
}());
exports.SigmoidCrossEntropyOps = SigmoidCrossEntropyOps;
//# sourceMappingURL=sigmoid_cross_entropy.js.map