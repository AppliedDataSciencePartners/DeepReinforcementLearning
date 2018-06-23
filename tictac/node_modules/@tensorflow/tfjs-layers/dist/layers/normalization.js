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
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("../backend/tfjs_backend");
var constraints_1 = require("../constraints");
var topology_1 = require("../engine/topology");
var errors_1 = require("../errors");
var initializers_1 = require("../initializers");
var regularizers_1 = require("../regularizers");
var generic_utils = require("../utils/generic_utils");
var math_utils = require("../utils/math_utils");
function batchNormalization(x, mean, variance, beta, gamma, epsilon) {
    if (epsilon === void 0) { epsilon = 1e-3; }
    var out;
    if (x.rank === 2) {
        out = tfc.batchNormalization2d(x, mean, variance, epsilon, gamma, beta);
    }
    else if (x.rank === 3) {
        out = tfc.batchNormalization3d(x, mean, variance, epsilon, gamma, beta);
    }
    else if (x.rank === 4) {
        out = tfc.batchNormalization4d(x, mean, variance, epsilon, gamma, beta);
    }
    else {
        throw new errors_1.NotImplementedError("batchNormalization is not implememnted for array of rank " + x.rank + " " +
            "yet");
    }
    return out;
}
exports.batchNormalization = batchNormalization;
function regularNormalizeBatchInTraining(x, gamma, beta, reductionAxes, epsilon) {
    if (epsilon === void 0) { epsilon = 1e-3; }
    return tfjs_core_1.tidy(function () {
        var meanAndVariance = tfc.moments(x, reductionAxes);
        var mean = meanAndVariance.mean;
        var variance = meanAndVariance.variance;
        var normed = batchNormalization(x, mean, variance, beta, gamma, epsilon);
        return [normed, mean, variance];
    });
}
function broadcastNormalizeBatchInTraining(x, gamma, beta, reductionAxes, epsilon) {
    if (epsilon === void 0) { epsilon = 1e-3; }
    return tfjs_core_1.tidy(function () {
        var meanAndVariance = tfc.moments(x, reductionAxes);
        var mean = meanAndVariance.mean;
        var variance = meanAndVariance.variance;
        var targetShape = [];
        for (var _i = 0, _a = math_utils.range(0, x.rank); _i < _a.length; _i++) {
            var axis = _a[_i];
            if (reductionAxes.indexOf(axis) !== -1) {
                targetShape.push(1);
            }
            else {
                targetShape.push(x.shape[axis]);
            }
        }
        var broadcastMean = mean.reshape(targetShape);
        var broadcastVariance = variance.reshape(targetShape);
        var broadcastGamma = gamma == null ? null : gamma.reshape(targetShape);
        var broadcastBeta = beta == null ? null : beta.reshape(targetShape);
        var normed = batchNormalization(x, broadcastMean, broadcastVariance, broadcastBeta, broadcastGamma, epsilon);
        return [normed, mean, variance];
    });
}
function normalizeBatchInTraining(x, gamma, beta, reductionAxes, epsilon) {
    if (epsilon === void 0) { epsilon = 1e-3; }
    if (tfjs_core_1.util.arraysEqual(reductionAxes.slice().sort(), math_utils.range(0, x.rank - 1))) {
        return regularNormalizeBatchInTraining(x, gamma, beta, reductionAxes, epsilon);
    }
    else {
        return broadcastNormalizeBatchInTraining(x, gamma, beta, reductionAxes, epsilon);
    }
}
exports.normalizeBatchInTraining = normalizeBatchInTraining;
var BatchNormalization = (function (_super) {
    __extends(BatchNormalization, _super);
    function BatchNormalization(config) {
        var _this = _super.call(this, config) || this;
        _this.supportsMasking = true;
        _this.axis = config.axis == null ? -1 : config.axis;
        _this.momentum = config.momentum == null ? 0.99 : config.momentum;
        _this.epsilon = config.epsilon == null ? 1e-3 : config.epsilon;
        _this.center = config.center == null ? true : config.center;
        _this.scale = config.scale == null ? true : config.scale;
        _this.betaInitializer = initializers_1.getInitializer(config.betaInitializer || 'zeros');
        _this.gammaInitializer = initializers_1.getInitializer(config.gammaInitializer || 'ones');
        _this.movingMeanInitializer =
            initializers_1.getInitializer(config.movingMeanInitializer || 'zeros');
        _this.movingVarianceInitializer =
            initializers_1.getInitializer(config.movingVarianceInitializer || 'ones');
        _this.betaConstraint = constraints_1.getConstraint(config.betaConstraint);
        _this.gammaConstraint = constraints_1.getConstraint(config.gammaConstraint);
        _this.betaRegularizer = regularizers_1.getRegularizer(config.betaRegularizer);
        _this.gammaRegularizer = regularizers_1.getRegularizer(config.gammaRegularizer);
        _this.stepCount = 0;
        return _this;
    }
    BatchNormalization.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var axis = this.axis >= 0 ? this.axis : (this.axis + inputShape.length);
        var dim = inputShape[axis];
        if (dim == null) {
            throw new errors_1.ValueError("Axis " + axis + " of input tensor should have a defined dimension but " +
                "the layer received an input with shape " +
                (JSON.stringify(inputShape) + "."));
        }
        this.inputSpec =
            [new topology_1.InputSpec({ ndim: inputShape.length, axes: (_a = {}, _a[axis] = dim, _a) })];
        var shape = [dim];
        if (this.scale) {
            this.gamma = this.addWeight('gamma', shape, null, this.gammaInitializer, this.gammaRegularizer, true, this.gammaConstraint);
        }
        if (this.center) {
            this.beta = this.addWeight('beta', shape, null, this.betaInitializer, this.betaRegularizer, true, this.betaConstraint);
        }
        this.movingMean = this.addWeight('moving_mean', shape, null, this.movingMeanInitializer, null, false);
        this.movingVariance = this.addWeight('moving_variance', shape, null, this.movingVarianceInitializer, null, false);
        this.built = true;
        var _a;
    };
    BatchNormalization.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var training = kwargs['training'] == null ? false : kwargs['training'];
            var input = generic_utils.getExactlyOneTensor(inputs);
            var inputShape = K.shape(input);
            var ndim = inputShape.length;
            var reductionAxes = math_utils.range(0, ndim);
            var axis = _this.axis >= 0 ? _this.axis : (_this.axis + ndim);
            reductionAxes.splice(axis, 1);
            var broadcastShape = generic_utils.pyListRepeat(1, ndim);
            broadcastShape[axis] = inputShape[axis];
            var sortedReductionAxes = reductionAxes.slice();
            sortedReductionAxes.sort();
            var needsBroadcasting = !tfjs_core_1.util.arraysEqual(sortedReductionAxes, math_utils.range(0, ndim).slice(0, ndim - 1));
            var normalizeInference = function () {
                if (needsBroadcasting) {
                    var broadcastMovingMean = _this.movingMean.read().reshape(broadcastShape);
                    var broadcastMovingVariance = _this.movingVariance.read().reshape(broadcastShape);
                    var broadcastBeta = _this.center ? _this.beta.read().reshape(broadcastShape) : null;
                    var broadcastGamma = _this.scale ? _this.gamma.read().reshape(broadcastShape) : null;
                    return batchNormalization(input, broadcastMovingMean, broadcastMovingVariance, broadcastBeta, broadcastGamma, _this.epsilon);
                }
                else {
                    return batchNormalization(input, _this.movingMean.read(), _this.movingVariance.read(), _this.beta == null ? null : _this.beta.read(), _this.gamma == null ? null : _this.gamma.read(), _this.epsilon);
                }
            };
            if (!training) {
                return normalizeInference();
            }
            var _a = normalizeBatchInTraining(input, _this.gamma.read(), _this.beta.read(), reductionAxes, _this.epsilon), normedTraining = _a[0], mean = _a[1], variance = _a[2];
            var sampleSize = math_utils.arrayProd(reductionAxes.map(function (axis) { return input.shape[axis]; }));
            var varianceDebiased = variance.mul(K.getScalar(sampleSize / (sampleSize - (1 + _this.epsilon))));
            var updateMovingMeanAndVariance = function () {
                _this.stepCount++;
                var newMovingMean = tfc.movingAverage(_this.movingMean.read(), mean, _this.momentum, _this.stepCount);
                _this.movingMean.write(newMovingMean);
                var newMovingVariance = tfc.movingAverage(_this.movingVariance.read(), varianceDebiased, _this.momentum, _this.stepCount);
                _this.movingVariance.write(newMovingVariance);
            };
            updateMovingMeanAndVariance();
            return normedTraining;
        });
    };
    BatchNormalization.prototype.getConfig = function () {
        var config = {
            axis: this.axis,
            momentum: this.momentum,
            epsilon: this.epsilon,
            center: this.center,
            scale: this.scale,
            betaInitializer: initializers_1.serializeInitializer(this.betaInitializer),
            gammaInitializer: initializers_1.serializeInitializer(this.gammaInitializer),
            movingMeanInitializer: initializers_1.serializeInitializer(this.movingMeanInitializer),
            movingVarianceInitializer: initializers_1.serializeInitializer(this.movingVarianceInitializer),
            betaRegularizer: regularizers_1.serializeRegularizer(this.betaRegularizer),
            gammaRegularizer: regularizers_1.serializeRegularizer(this.gammaRegularizer),
            betaConstraint: constraints_1.serializeConstraint(this.betaConstraint),
            gammaConstraint: constraints_1.serializeConstraint(this.gammaConstraint)
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    BatchNormalization.className = 'BatchNormalization';
    return BatchNormalization;
}(topology_1.Layer));
exports.BatchNormalization = BatchNormalization;
tfjs_core_1.serialization.SerializationMap.register(BatchNormalization);
//# sourceMappingURL=normalization.js.map