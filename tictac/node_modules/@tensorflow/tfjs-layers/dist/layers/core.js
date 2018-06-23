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
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var activations_1 = require("../activations");
var K = require("../backend/tfjs_backend");
var constraints_1 = require("../constraints");
var topology_1 = require("../engine/topology");
var errors_1 = require("../errors");
var initializers_1 = require("../initializers");
var regularizers_1 = require("../regularizers");
var generic_utils = require("../utils/generic_utils");
var generic_utils_1 = require("../utils/generic_utils");
var math_utils = require("../utils/math_utils");
var Dropout = (function (_super) {
    __extends(Dropout, _super);
    function Dropout(config) {
        var _this = _super.call(this, config) || this;
        _this.rate = Math.max(Math.min(config.rate, 1), 0);
        _this.rateScalar = K.getScalar(_this.rate);
        _this.noiseShape = config.noiseShape;
        _this.seed = config.seed;
        if (_this.seed != null) {
            throw new errors_1.NotImplementedError('Non-default seed is not implemented in Dropout layer yet: ' +
                _this.seed);
        }
        _this.supportsMasking = true;
        return _this;
    }
    Dropout.prototype.getNoiseShape = function (input) {
        if (this.noiseShape == null) {
            return this.noiseShape;
        }
        var inputShape = input.shape;
        var noiseShape = [];
        for (var i = 0; i < this.noiseShape.length; ++i) {
            noiseShape.push(this.noiseShape[i] == null ? inputShape[i] : this.noiseShape[i]);
        }
        return noiseShape;
    };
    Dropout.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            var input = generic_utils.getExactlyOneTensor(inputs);
            if (_this.noiseShape != null &&
                !tfjs_core_1.util.arraysEqual(input.shape, _this.noiseShape)) {
                throw new errors_1.NotImplementedError('Non-default noise shape is not implemented in Dropout ' +
                    'layer yet: ' + JSON.stringify(_this.noiseShape));
            }
            if (0 < _this.rate && _this.rate < 1) {
                var training = kwargs['training'] == null ? false : kwargs['training'];
                var noiseShape_1 = _this.getNoiseShape(input);
                var output = K.inTrainPhase(function () { return K.dropout(input, _this.rateScalar, noiseShape_1, _this.seed); }, function () { return input; }, training);
                return output;
            }
            return inputs;
        });
    };
    Dropout.prototype.getConfig = function () {
        var config = {
            rate: this.rate,
            noiseShape: this.noiseShape,
            seed: this.seed,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Dropout.className = 'Dropout';
    return Dropout;
}(topology_1.Layer));
exports.Dropout = Dropout;
tfjs_core_1.serialization.SerializationMap.register(Dropout);
var Dense = (function (_super) {
    __extends(Dense, _super);
    function Dense(config) {
        var _this = _super.call(this, config) || this;
        _this.activation = null;
        _this.useBias = true;
        _this.kernel = null;
        _this.bias = null;
        _this.DEFAULT_KERNEL_INITIALIZER = 'glorotNormal';
        _this.DEFAULT_BIAS_INITIALIZER = 'zeros';
        if (config.batchInputShape == null && config.inputShape == null &&
            config.inputDim != null) {
            var batchSize = null;
            if (config.batchSize != null) {
                batchSize = config.batchSize;
            }
            _this.batchInputShape = [batchSize, config.inputDim];
        }
        _this.units = config.units;
        _this.activation = activations_1.getActivation(config.activation);
        if (config.useBias != null) {
            _this.useBias = config.useBias;
        }
        _this.kernelInitializer = initializers_1.getInitializer(config.kernelInitializer || _this.DEFAULT_KERNEL_INITIALIZER);
        _this.biasInitializer =
            initializers_1.getInitializer(config.biasInitializer || _this.DEFAULT_BIAS_INITIALIZER);
        _this.kernelConstraint = constraints_1.getConstraint(config.kernelConstraint);
        _this.biasConstraint = constraints_1.getConstraint(config.biasConstraint);
        _this.kernelRegularizer = regularizers_1.getRegularizer(config.kernelRegularizer);
        _this.biasRegularizer = regularizers_1.getRegularizer(config.biasRegularizer);
        _this.activityRegularizer = regularizers_1.getRegularizer(config.activityRegularizer);
        _this.inputSpec = [{ minNDim: 2 }];
        return _this;
    }
    Dense.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var inputLastDim = inputShape[inputShape.length - 1];
        if (this.kernel == null) {
            this.kernel = this.addWeight('kernel', [inputLastDim, this.units], null, this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
            if (this.useBias) {
                this.bias = this.addWeight('bias', [this.units], null, this.biasInitializer, this.biasRegularizer, true, this.biasConstraint);
            }
        }
        this.inputSpec = [{ minNDim: 2, axes: (_a = {}, _a[-1] = inputLastDim, _a) }];
        this.built = true;
        var _a;
    };
    Dense.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var outputShape = inputShape.slice();
        outputShape[outputShape.length - 1] = this.units;
        return outputShape;
    };
    Dense.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            var input = generic_utils.getExactlyOneTensor(inputs);
            var output = K.dot(input, _this.kernel.read());
            if (_this.bias != null) {
                output = K.biasAdd(output, _this.bias.read());
            }
            if (_this.activation != null) {
                output = _this.activation.apply(output);
            }
            return output;
        });
    };
    Dense.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint)
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Dense.className = 'Dense';
    return Dense;
}(topology_1.Layer));
exports.Dense = Dense;
tfjs_core_1.serialization.SerializationMap.register(Dense);
var Flatten = (function (_super) {
    __extends(Flatten, _super);
    function Flatten(config) {
        var _this = _super.call(this, config || {}) || this;
        _this.inputSpec = [{ minNDim: 3 }];
        return _this;
    }
    Flatten.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        for (var _i = 0, _a = inputShape.slice(1); _i < _a.length; _i++) {
            var dim = _a[_i];
            if (dim == null) {
                throw new errors_1.ValueError("The shape of the input to \"Flatten\" is not fully defined " +
                    ("(got " + inputShape.slice(1) + "). Make sure to pass a complete ") +
                    "\"input_shape\" or \"batch_input_shape\" argument to the first " +
                    "layer in your model.");
            }
        }
        return [inputShape[0], math_utils.arrayProd(inputShape, 1)];
    };
    Flatten.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            return K.batchFlatten(generic_utils.getExactlyOneTensor(inputs));
        });
    };
    Flatten.className = 'Flatten';
    return Flatten;
}(topology_1.Layer));
exports.Flatten = Flatten;
tfjs_core_1.serialization.SerializationMap.register(Flatten);
var Activation = (function (_super) {
    __extends(Activation, _super);
    function Activation(config) {
        var _this = _super.call(this, config) || this;
        _this.supportsMasking = true;
        _this.activation = activations_1.getActivation(config.activation);
        return _this;
    }
    Activation.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            var input = generic_utils.getExactlyOneTensor(inputs);
            return _this.activation.apply(input);
        });
    };
    Activation.prototype.getConfig = function () {
        var config = { activation: activations_1.serializeActivation(this.activation) };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Activation.className = 'Activation';
    return Activation;
}(topology_1.Layer));
exports.Activation = Activation;
tfjs_core_1.serialization.SerializationMap.register(Activation);
var RepeatVector = (function (_super) {
    __extends(RepeatVector, _super);
    function RepeatVector(config) {
        var _this = _super.call(this, config) || this;
        _this.n = config.n;
        _this.inputSpec = [{ ndim: 2 }];
        return _this;
    }
    RepeatVector.prototype.computeOutputShape = function (inputShape) {
        return [inputShape[0], this.n, inputShape[1]];
    };
    RepeatVector.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils_1.getExactlyOneTensor(inputs);
            return K.repeat(inputs, _this.n);
        });
    };
    RepeatVector.prototype.getConfig = function () {
        var config = {
            n: this.n,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    RepeatVector.className = 'RepeatVector';
    return RepeatVector;
}(topology_1.Layer));
exports.RepeatVector = RepeatVector;
tfjs_core_1.serialization.SerializationMap.register(RepeatVector);
var Reshape = (function (_super) {
    __extends(Reshape, _super);
    function Reshape(config) {
        var _this = _super.call(this, config) || this;
        _this.targetShape = config.targetShape;
        for (var i = 0; i < _this.targetShape.length; ++i) {
            if (_this.isUnknown(_this.targetShape[i])) {
                _this.targetShape[i] = null;
            }
        }
        return _this;
    }
    Reshape.prototype.isUnknown = function (dim) {
        return dim < 0 || dim == null;
    };
    Reshape.prototype.fixUnknownDimension = function (inputShape, outputShape) {
        var errorMsg = 'Total size of new array must be unchanged.';
        var finalShape = outputShape.slice();
        var known = 1;
        var unknown = null;
        for (var i = 0; i < finalShape.length; ++i) {
            var dim = finalShape[i];
            if (this.isUnknown(dim)) {
                if (unknown === null) {
                    unknown = i;
                }
                else {
                    throw new errors_1.ValueError('Can only specifiy one unknown dimension.');
                }
            }
            else {
                known *= dim;
            }
        }
        var originalSize = math_utils.arrayProd(inputShape);
        if (unknown !== null) {
            if (known === 0 || originalSize % known !== 0) {
                throw new errors_1.ValueError(errorMsg);
            }
            finalShape[unknown] = originalSize / known;
        }
        else if (originalSize !== known) {
            throw new errors_1.ValueError(errorMsg);
        }
        return finalShape;
    };
    Reshape.prototype.computeOutputShape = function (inputShape) {
        var anyUnknownDims = false;
        for (var i = 0; i < inputShape.length; ++i) {
            if (this.isUnknown(inputShape[i])) {
                anyUnknownDims = true;
                break;
            }
        }
        if (anyUnknownDims) {
            return inputShape.slice(0, 1).concat(this.targetShape);
        }
        else {
            return inputShape.slice(0, 1).concat(this.fixUnknownDimension(inputShape.slice(1), this.targetShape));
        }
    };
    Reshape.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            var input = generic_utils.getExactlyOneTensor(inputs);
            var inputShape = K.shape(input);
            var outputShape = inputShape.slice(0, 1).concat(_this.fixUnknownDimension(inputShape.slice(1), _this.targetShape));
            return input.reshape(outputShape);
        });
    };
    Reshape.prototype.getConfig = function () {
        var config = {
            targetShape: this.targetShape,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Reshape.className = 'Reshape';
    return Reshape;
}(topology_1.Layer));
exports.Reshape = Reshape;
tfjs_core_1.serialization.SerializationMap.register(Reshape);
//# sourceMappingURL=core.js.map