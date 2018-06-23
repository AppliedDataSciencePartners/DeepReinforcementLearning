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
var array_ops_1 = require("./array_ops");
var binary_ops_1 = require("./binary_ops");
var operation_1 = require("./operation");
var MovingAverageOps = (function () {
    function MovingAverageOps() {
    }
    MovingAverageOps.movingAverage = function (v, x, decay, step, zeroDebias) {
        if (zeroDebias === void 0) { zeroDebias = true; }
        util.assertArgumentsAreTensors({ v: v, x: x }, 'movingAverage');
        util.assertTypesMatch(v, x);
        util.assert(util.arraysEqual(v.shape, x.shape), 'Shape mismatch in v and x');
        var one = array_ops_1.ArrayOps.scalar(1);
        decay = typeof decay === 'number' ? array_ops_1.ArrayOps.scalar(decay) : decay;
        var oneMinusDecay = one.sub(decay);
        var update = x.sub(v).mul(oneMinusDecay);
        if (zeroDebias) {
            util.assert(step != null, 'When using zeroDebias: true, step is required.');
            step = typeof step === 'number' ? array_ops_1.ArrayOps.scalar(step) : step;
            update = update.div(one.sub(binary_ops_1.BinaryOps.pow(decay, step)));
        }
        return v.add(update);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Moving Average' }),
        operation_1.operation
    ], MovingAverageOps, "movingAverage", null);
    return MovingAverageOps;
}());
exports.MovingAverageOps = MovingAverageOps;
//# sourceMappingURL=moving_average.js.map