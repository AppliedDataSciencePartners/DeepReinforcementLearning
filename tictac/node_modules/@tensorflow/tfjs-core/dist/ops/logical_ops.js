"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var types = require("../types");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var ops_1 = require("../ops/ops");
var LogicalOps = (function () {
    function LogicalOps() {
    }
    LogicalOps.logicalNot = function (x) {
        util.assertArgumentsAreTensors({ x: x }, 'logicalNot');
        util.assert(x.dtype === 'bool', 'Error Array must be of type bool.');
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalNot(x); }, { x: x });
    };
    LogicalOps.logicalAnd = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'logicalAnd');
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalAnd(a, b); }, { a: a, b: b });
    };
    LogicalOps.logicalOr = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'logicalOr');
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.logicalOr(a, b); }, { a: a, b: b });
    };
    LogicalOps.logicalXor = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'logicalXor');
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return LogicalOps.logicalOr(a, b).logicalAnd(LogicalOps.logicalAnd(a, b).logicalNot());
    };
    LogicalOps.where = function (condition, a, b) {
        util.assertArgumentsAreTensors({ condition: condition, a: a, b: b }, 'where');
        util.assert(condition.dtype === 'bool', 'Error Condition must be of type bool.');
        util.assertShapesMatch(a.shape, b.shape, 'Error in where: ');
        if (condition.rank === 1) {
            util.assert(condition.shape[0] === a.shape[0], 'The first dimension of `a` must match the size of `condition`.');
        }
        else {
            util.assertShapesMatch(condition.shape, b.shape, 'Error in where: ');
        }
        var dtype = types.upcastType(a.dtype, b.dtype);
        var grad = function (dy) { return ({
            condition: function () { return ops_1.zerosLike(condition); },
            a: function () { return dy.mul(condition.cast(a.dtype)); },
            b: function () { return dy.mul(condition.logicalNot().cast(b.dtype)); }
        }); };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.where(condition, a, b, dtype); }, { condition: condition, a: a, b: b }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalNot", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalAnd", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalOr", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "logicalXor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], LogicalOps, "where", null);
    return LogicalOps;
}());
exports.LogicalOps = LogicalOps;
//# sourceMappingURL=logical_ops.js.map