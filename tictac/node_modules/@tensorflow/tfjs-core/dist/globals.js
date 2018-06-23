"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gradients_1 = require("./gradients");
var tracking_1 = require("./tracking");
exports.tidy = tracking_1.Tracking.tidy;
exports.keep = tracking_1.Tracking.keep;
exports.dispose = tracking_1.Tracking.dispose;
exports.time = tracking_1.Tracking.time;
exports.grad = gradients_1.Gradients.grad;
exports.valueAndGrad = gradients_1.Gradients.valueAndGrad;
exports.grads = gradients_1.Gradients.grads;
exports.valueAndGrads = gradients_1.Gradients.valueAndGrads;
exports.variableGrads = gradients_1.Gradients.variableGrads;
exports.customGrad = gradients_1.Gradients.customGrad;
//# sourceMappingURL=globals.js.map