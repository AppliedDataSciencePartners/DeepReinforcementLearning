"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var adadelta_optimizer_1 = require("./adadelta_optimizer");
var adagrad_optimizer_1 = require("./adagrad_optimizer");
var adam_optimizer_1 = require("./adam_optimizer");
var adamax_optimizer_1 = require("./adamax_optimizer");
var momentum_optimizer_1 = require("./momentum_optimizer");
var rmsprop_optimizer_1 = require("./rmsprop_optimizer");
var sgd_optimizer_1 = require("./sgd_optimizer");
var OptimizerConstructors = (function () {
    function OptimizerConstructors() {
    }
    OptimizerConstructors.sgd = function (learningRate) {
        return new sgd_optimizer_1.SGDOptimizer(learningRate);
    };
    OptimizerConstructors.momentum = function (learningRate, momentum, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        return new momentum_optimizer_1.MomentumOptimizer(learningRate, momentum, useNesterov);
    };
    OptimizerConstructors.rmsprop = function (learningRate, decay, momentum, epsilon, centered) {
        if (decay === void 0) { decay = .9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = null; }
        if (centered === void 0) { centered = false; }
        return new rmsprop_optimizer_1.RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered);
    };
    OptimizerConstructors.adam = function (learningRate, beta1, beta2, epsilon) {
        if (learningRate === void 0) { learningRate = 0.001; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = null; }
        return new adam_optimizer_1.AdamOptimizer(learningRate, beta1, beta2, epsilon);
    };
    OptimizerConstructors.adadelta = function (learningRate, rho, epsilon) {
        if (learningRate === void 0) { learningRate = .001; }
        if (rho === void 0) { rho = .95; }
        if (epsilon === void 0) { epsilon = null; }
        return new adadelta_optimizer_1.AdadeltaOptimizer(learningRate, rho, epsilon);
    };
    OptimizerConstructors.adamax = function (learningRate, beta1, beta2, epsilon, decay) {
        if (learningRate === void 0) { learningRate = 0.002; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = null; }
        if (decay === void 0) { decay = 0.0; }
        return new adamax_optimizer_1.AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay);
    };
    OptimizerConstructors.adagrad = function (learningRate, initialAccumulatorValue) {
        if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
        return new adagrad_optimizer_1.AdagradOptimizer(learningRate, initialAccumulatorValue);
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "sgd", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "momentum", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "rmsprop", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adam", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adadelta", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adamax", null);
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adagrad", null);
    return OptimizerConstructors;
}());
exports.OptimizerConstructors = OptimizerConstructors;
//# sourceMappingURL=optimizer_constructors.js.map