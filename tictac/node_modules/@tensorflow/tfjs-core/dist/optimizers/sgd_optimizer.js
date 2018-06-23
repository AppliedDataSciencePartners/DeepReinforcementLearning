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
var SGDOptimizer = (function (_super) {
    __extends(SGDOptimizer, _super);
    function SGDOptimizer(learningRate) {
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.setLearningRate(learningRate);
        return _this;
    }
    SGDOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var varNames = Object.keys(variableGradients);
        varNames.forEach(function (varName) {
            var gradient = variableGradients[varName];
            var value = environment_1.ENV.engine.registeredVariables[varName];
            globals_1.tidy(function () {
                var newValue = _this.c.mul(gradient).add(value);
                value.assign(newValue);
            });
        });
    };
    SGDOptimizer.prototype.setLearningRate = function (learningRate) {
        this.learningRate = learningRate;
        if (this.c != null) {
            this.c.dispose();
        }
        this.c = globals_1.keep(ops_1.scalar(-learningRate));
    };
    SGDOptimizer.prototype.dispose = function () {
        this.c.dispose();
    };
    SGDOptimizer.prototype.getConfig = function () {
        return { learningRate: this.learningRate };
    };
    SGDOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate);
    };
    SGDOptimizer.className = 'SGDOptimizer';
    return SGDOptimizer;
}(optimizer_1.Optimizer));
exports.SGDOptimizer = SGDOptimizer;
serialization_1.SerializationMap.register(SGDOptimizer);
//# sourceMappingURL=sgd_optimizer.js.map