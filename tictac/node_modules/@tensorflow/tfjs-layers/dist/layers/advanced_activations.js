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
var tfjs_backend_1 = require("../backend/tfjs_backend");
var tfjs_backend_2 = require("../backend/tfjs_backend");
var topology_1 = require("../engine/topology");
var errors_1 = require("../errors");
var generic_utils = require("../utils/generic_utils");
var LeakyReLU = (function (_super) {
    __extends(LeakyReLU, _super);
    function LeakyReLU(config) {
        var _this = _super.call(this, config == null ? {} : config) || this;
        _this.DEFAULT_ALPHA = 0.3;
        if (config == null) {
            config = {};
        }
        _this.alpha = config.alpha == null ? _this.DEFAULT_ALPHA : config.alpha;
        return _this;
    }
    LeakyReLU.prototype.call = function (inputs, kwargs) {
        var x = generic_utils.getExactlyOneTensor(inputs);
        return tfjs_core_1.leakyRelu(x, this.alpha);
    };
    LeakyReLU.prototype.computeOutputShape = function (inputShape) {
        return inputShape;
    };
    LeakyReLU.prototype.getConfig = function () {
        var config = { alpha: this.alpha };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    LeakyReLU.className = 'LeakyReLU';
    return LeakyReLU;
}(topology_1.Layer));
exports.LeakyReLU = LeakyReLU;
tfjs_core_1.serialization.SerializationMap.register(LeakyReLU);
var ELU = (function (_super) {
    __extends(ELU, _super);
    function ELU(config) {
        var _this = _super.call(this, config == null ? {} : config) || this;
        _this.DEFAULT_ALPHA = 1.0;
        if (config == null) {
            config = {};
        }
        if (config.alpha != null && config.alpha !== _this.DEFAULT_ALPHA) {
            throw new errors_1.NotImplementedError("Non-default alpha value (" + config.alpha + ") is not supported by the " +
                "ELU layer yet.");
        }
        _this.alpha = config.alpha == null ? _this.DEFAULT_ALPHA : config.alpha;
        return _this;
    }
    ELU.prototype.call = function (inputs, kwargs) {
        var x = generic_utils.getExactlyOneTensor(inputs);
        return tfjs_core_1.elu(x);
    };
    ELU.prototype.computeOutputShape = function (inputShape) {
        return inputShape;
    };
    ELU.prototype.getConfig = function () {
        var config = { alpha: this.alpha };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    ELU.className = 'ELU';
    return ELU;
}(topology_1.Layer));
exports.ELU = ELU;
tfjs_core_1.serialization.SerializationMap.register(ELU);
var ThresholdedReLU = (function (_super) {
    __extends(ThresholdedReLU, _super);
    function ThresholdedReLU(config) {
        var _this = _super.call(this, config == null ? {} : config) || this;
        _this.DEFAULT_THETA = 1.0;
        if (config == null) {
            config = {};
        }
        _this.theta = config.theta == null ? _this.DEFAULT_THETA : config.theta;
        _this.thetaTensor = tfjs_backend_2.getScalar(_this.theta);
        return _this;
    }
    ThresholdedReLU.prototype.call = function (inputs, kwargs) {
        var x = generic_utils.getExactlyOneTensor(inputs);
        return x.mul(tfjs_backend_1.cast(x.greater(this.thetaTensor), 'float32'));
    };
    ThresholdedReLU.prototype.computeOutputShape = function (inputShape) {
        return inputShape;
    };
    ThresholdedReLU.prototype.getConfig = function () {
        var config = { theta: this.theta };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    ThresholdedReLU.className = 'ThresholdedReLU';
    return ThresholdedReLU;
}(topology_1.Layer));
exports.ThresholdedReLU = ThresholdedReLU;
tfjs_core_1.serialization.SerializationMap.register(ThresholdedReLU);
var Softmax = (function (_super) {
    __extends(Softmax, _super);
    function Softmax(config) {
        var _this = _super.call(this, config == null ? {} : config) || this;
        _this.DEFAULT_AXIS = 1.0;
        if (config == null) {
            config = {};
        }
        _this.softmax = new activations_1.Softmax().apply;
        _this.axis = config.axis == null ? _this.DEFAULT_AXIS : config.axis;
        return _this;
    }
    Softmax.prototype.call = function (inputs, kwargs) {
        var x = generic_utils.getExactlyOneTensor(inputs);
        return this.softmax(x, this.axis);
    };
    Softmax.prototype.computeOutputShape = function (inputShape) {
        return inputShape;
    };
    Softmax.prototype.getConfig = function () {
        var config = { axis: this.axis };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Softmax.className = 'Softmax';
    return Softmax;
}(topology_1.Layer));
exports.Softmax = Softmax;
tfjs_core_1.serialization.SerializationMap.register(Softmax);
//# sourceMappingURL=advanced_activations.js.map