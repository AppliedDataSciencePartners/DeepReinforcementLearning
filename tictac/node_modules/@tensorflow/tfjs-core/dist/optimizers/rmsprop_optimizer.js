"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var ops_1 = require("../ops/ops");
var serialization_1 = require("../serialization");
var optimizer_1 = require("./optimizer");
var optimizer_utils = require("./optimizer_utils");
var RMSPropOptimizer = (function (_super) {
    __extends(RMSPropOptimizer, _super);
    function RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered) {
        if (decay === void 0) { decay = 0.9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = null; }
        if (centered === void 0) { centered = false; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.decay = decay;
        _this.momentum = momentum;
        _this.epsilon = epsilon;
        _this.accumulatedMeanSquares = {};
        _this.accumulatedMeanGrads = {};
        _this.accumulatedMoments = {};
        _this.c = globals_1.keep(ops_1.scalar(learningRate));
        _this.decayScalar = globals_1.keep(ops_1.scalar(decay));
        _this.momentumScalar = globals_1.keep(ops_1.scalar(momentum));
        _this.oneMinusDecay = globals_1.keep(ops_1.scalar(1 - decay));
        _this.centered = centered;
        if (epsilon === null) {
            epsilon = optimizer_utils.getOptimizerDefaultEpsilonValue();
        }
        _this.epsilonScalar = globals_1.keep(ops_1.scalar(epsilon));
        return _this;
    }
    RMSPropOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedMeanSquares[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMeanSquares[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedMeanGrads[variableName] == null && this_1.centered) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMeanGrads[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            if (this_1.accumulatedMoments[variableName] == null) {
                var trainable_3 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMoments[variableName] =
                        ops_1.zerosLike(value).variable(trainable_3);
                });
            }
            var accumulatedMeanSquare = this_1.accumulatedMeanSquares[variableName];
            var accumulatedMeanGrad = this_1.accumulatedMeanGrads[variableName];
            var accumulatedMoments = this_1.accumulatedMoments[variableName];
            var gradient = variableGradients[variableName];
            globals_1.tidy(function () {
                var newAccumulatedMeanSquare = _this.decayScalar.mul(accumulatedMeanSquare)
                    .add(_this.oneMinusDecay.mul(gradient.square()));
                if (_this.centered) {
                    var newAccumulatedMeanGrad = _this.decayScalar.mul(accumulatedMeanGrad)
                        .add(_this.oneMinusDecay.mul(gradient));
                    var newAccumulatedMoments = _this.momentumScalar.mul(accumulatedMoments)
                        .add(_this.c.mul(gradient).div(newAccumulatedMeanSquare
                        .sub(newAccumulatedMeanGrad.square().add(_this.epsilonScalar))
                        .sqrt()));
                    _this.accumulatedMeanSquares[variableName].assign(newAccumulatedMeanSquare);
                    _this.accumulatedMeanGrads[variableName].assign(newAccumulatedMeanGrad);
                    _this.accumulatedMoments[variableName].assign(newAccumulatedMoments);
                    var newValue = value.sub(newAccumulatedMoments);
                    value.assign(newValue);
                }
                else {
                    var newAccumulatedMeanSquare_1 = _this.decayScalar.mul(accumulatedMeanSquare)
                        .add(_this.oneMinusDecay.mul(gradient.square()));
                    var newAccumulatedMoments = _this.momentumScalar.mul(accumulatedMoments)
                        .add(_this.c.mul(gradient).div(newAccumulatedMeanSquare_1.add(_this.epsilonScalar).sqrt()));
                    _this.accumulatedMeanSquares[variableName].assign(newAccumulatedMeanSquare_1);
                    _this.accumulatedMoments[variableName].assign(newAccumulatedMoments);
                    var newValue = value.sub(newAccumulatedMoments);
                    value.assign(newValue);
                }
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    RMSPropOptimizer.prototype.dispose = function () {
        var _this = this;
        this.c.dispose();
        this.epsilonScalar.dispose();
        this.decayScalar.dispose();
        this.momentumScalar.dispose();
        this.oneMinusDecay.dispose();
        if (this.accumulatedMeanSquares != null) {
            Object.keys(this.accumulatedMeanSquares)
                .forEach(function (name) { return _this.accumulatedMeanSquares[name].dispose(); });
        }
        if (this.accumulatedMeanGrads != null && this.centered) {
            Object.keys(this.accumulatedMeanGrads)
                .forEach(function (name) { return _this.accumulatedMeanGrads[name].dispose(); });
        }
        if (this.accumulatedMoments != null) {
            Object.keys(this.accumulatedMoments)
                .forEach(function (name) { return _this.accumulatedMoments[name].dispose(); });
        }
    };
    RMSPropOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            decay: this.decay,
            momentum: this.momentum,
            epsilon: this.epsilon,
            centered: this.centered
        };
    };
    RMSPropOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.decay, config.momentum, config.epsilon, config.centered);
    };
    RMSPropOptimizer.className = 'RMSPropOptimizer';
    return RMSPropOptimizer;
}(optimizer_1.Optimizer));
exports.RMSPropOptimizer = RMSPropOptimizer;
serialization_1.SerializationMap.register(RMSPropOptimizer);
//# sourceMappingURL=rmsprop_optimizer.js.map