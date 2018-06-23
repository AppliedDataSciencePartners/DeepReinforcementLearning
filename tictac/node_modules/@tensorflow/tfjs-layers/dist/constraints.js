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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("./backend/tfjs_backend");
var generic_utils_1 = require("./utils/generic_utils");
function calcL2Norms(w, axis) {
    return tfjs_core_1.tidy(function () { return tfc.sqrt(tfc.sum(K.square(w), axis, true)); });
}
var Constraint = (function (_super) {
    __extends(Constraint, _super);
    function Constraint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Constraint.prototype.getConfig = function () {
        return {};
    };
    Constraint = __decorate([
        tfjs_core_1.doc({ heading: 'Constraints', subheading: 'Classes', namespace: 'constraints' })
    ], Constraint);
    return Constraint;
}(tfjs_core_1.serialization.Serializable));
exports.Constraint = Constraint;
var MaxNorm = (function (_super) {
    __extends(MaxNorm, _super);
    function MaxNorm(config) {
        var _this = _super.call(this) || this;
        _this.defaultMaxValue = 2;
        _this.defaultAxis = 0;
        _this.maxValue =
            config.maxValue != null ? config.maxValue : _this.defaultMaxValue;
        _this.axis = config.axis != null ? config.axis : _this.defaultAxis;
        return _this;
    }
    MaxNorm.prototype.apply = function (w) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var norms = calcL2Norms(w, _this.axis);
            var desired = tfc.clipByValue(norms, 0, _this.maxValue);
            return tfc.mul(w, tfc.div(desired, K.scalarPlusArray(K.getScalar(K.epsilon()), norms)));
        });
    };
    MaxNorm.prototype.getConfig = function () {
        return { maxValue: this.maxValue, axis: this.axis };
    };
    MaxNorm.className = 'MaxNorm';
    return MaxNorm;
}(Constraint));
exports.MaxNorm = MaxNorm;
tfjs_core_1.serialization.SerializationMap.register(MaxNorm);
var UnitNorm = (function (_super) {
    __extends(UnitNorm, _super);
    function UnitNorm(config) {
        var _this = _super.call(this) || this;
        _this.defaultAxis = 0;
        _this.axis = config.axis != null ? config.axis : _this.defaultAxis;
        return _this;
    }
    UnitNorm.prototype.apply = function (w) {
        var _this = this;
        return tfjs_core_1.tidy(function () { return tfc.div(w, K.scalarPlusArray(K.getScalar(K.epsilon()), calcL2Norms(w, _this.axis))); });
    };
    UnitNorm.prototype.getConfig = function () {
        return { axis: this.axis };
    };
    UnitNorm.className = 'UnitNorm';
    return UnitNorm;
}(Constraint));
exports.UnitNorm = UnitNorm;
tfjs_core_1.serialization.SerializationMap.register(UnitNorm);
var NonNeg = (function (_super) {
    __extends(NonNeg, _super);
    function NonNeg() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonNeg.prototype.apply = function (w) {
        return tfc.relu(w);
    };
    NonNeg.className = 'NonNeg';
    return NonNeg;
}(Constraint));
exports.NonNeg = NonNeg;
tfjs_core_1.serialization.SerializationMap.register(NonNeg);
var MinMaxNorm = (function (_super) {
    __extends(MinMaxNorm, _super);
    function MinMaxNorm(config) {
        var _this = _super.call(this) || this;
        _this.defaultMinValue = 0.0;
        _this.defaultMaxValue = 1.0;
        _this.defaultRate = 1.0;
        _this.defaultAxis = 0;
        _this.minValue =
            config.minValue != null ? config.minValue : _this.defaultMinValue;
        _this.maxValue =
            config.maxValue != null ? config.maxValue : _this.defaultMaxValue;
        _this.rate = config.rate != null ? config.rate : _this.defaultRate;
        _this.axis = config.axis != null ? config.axis : _this.defaultAxis;
        return _this;
    }
    MinMaxNorm.prototype.apply = function (w) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var norms = calcL2Norms(w, _this.axis);
            var desired = tfc.add(K.scalarTimesArray(K.getScalar(_this.rate), tfc.clipByValue(norms, _this.minValue, _this.maxValue)), K.scalarTimesArray(K.getScalar(1.0 - _this.rate), norms));
            return tfc.mul(w, tfc.div(desired, K.scalarPlusArray(K.getScalar(K.epsilon()), norms)));
        });
    };
    MinMaxNorm.prototype.getConfig = function () {
        return {
            minValue: this.minValue,
            maxValue: this.maxValue,
            rate: this.rate,
            axis: this.axis
        };
    };
    MinMaxNorm.className = 'MinMaxNorm';
    return MinMaxNorm;
}(Constraint));
exports.MinMaxNorm = MinMaxNorm;
tfjs_core_1.serialization.SerializationMap.register(MinMaxNorm);
exports.CONSTRAINT_IDENTIFIER_REGISTRY_SYMBOL_MAP = {
    'maxNorm': 'MaxNorm',
    'minMaxNorm': 'MinMaxNorm',
    'nonNeg': 'NonNeg',
    'unitNorm': 'UnitNorm'
};
function serializeConstraint(constraint) {
    return generic_utils_1.serializeKerasObject(constraint);
}
exports.serializeConstraint = serializeConstraint;
function deserializeConstraint(config, customObjects) {
    if (customObjects === void 0) { customObjects = {}; }
    return generic_utils_1.deserializeKerasObject(config, tfjs_core_1.serialization.SerializationMap.getMap().classNameMap, customObjects, 'constraint');
}
exports.deserializeConstraint = deserializeConstraint;
function getConstraint(identifier) {
    if (identifier == null) {
        return null;
    }
    if (typeof identifier === 'string') {
        var className = identifier in exports.CONSTRAINT_IDENTIFIER_REGISTRY_SYMBOL_MAP ?
            exports.CONSTRAINT_IDENTIFIER_REGISTRY_SYMBOL_MAP[identifier] :
            identifier;
        var config = { className: className, config: {} };
        return deserializeConstraint(config);
    }
    else if (identifier instanceof Constraint) {
        return identifier;
    }
    else {
        return deserializeConstraint(identifier);
    }
}
exports.getConstraint = getConstraint;
//# sourceMappingURL=constraints.js.map