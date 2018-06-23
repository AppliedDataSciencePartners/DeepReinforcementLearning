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
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var ops = require("./ops");
var NormOps = (function () {
    function NormOps() {
    }
    NormOps.norm = function (x, ord, axis, keepDims) {
        if (ord === void 0) { ord = 'euclidean'; }
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        util.assertArgumentsAreTensors({ x: x }, 'norm');
        var norm = normImpl(x, ord, axis);
        var keepDimsShape = norm.shape;
        if (keepDims) {
            var axes = axis_util.parseAxisParam(axis, x.shape);
            keepDimsShape = axis_util.expandShapeToKeepDim(norm.shape, axes);
        }
        return norm.reshape(keepDimsShape);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation_1.operation
    ], NormOps, "norm", null);
    return NormOps;
}());
exports.NormOps = NormOps;
function normImpl(x, p, axis) {
    if (axis === void 0) { axis = null; }
    if (x.rank === 0) {
        return x.abs();
    }
    if (x.rank !== 1 && axis === null) {
        return normImpl(x.reshape([-1]), p, axis);
    }
    if (x.rank === 1 || typeof axis === 'number' ||
        axis instanceof Array && axis.length === 1) {
        if (p === 1) {
            return x.abs().sum(axis);
        }
        if (p === Infinity) {
            return x.abs().max(axis);
        }
        if (p === -Infinity) {
            return x.abs().min(axis);
        }
        if (p === 'euclidean' || p === 2) {
            return x.abs().pow(ops.scalar(2, 'int32')).sum(axis).sqrt();
        }
        throw new Error("Error in norm: invalid ord value: " + p);
    }
    if (axis instanceof Array && axis.length === 2) {
        if (p === 1) {
            return x.abs().sum(axis[0]).max(axis[1] - 1);
        }
        if (p === Infinity) {
            return x.abs().sum(axis[1]).max(axis[0]);
        }
        if (p === -Infinity) {
            return x.abs().sum(axis[1]).min(axis[0]);
        }
        if (p === 'fro' || p === 'euclidean') {
            return x.square().sum(axis).sqrt();
        }
        throw new Error("Error in norm: invalid ord value: " + p);
    }
    throw new Error("Error in norm: invalid axis: " + axis);
}
//# sourceMappingURL=norm.js.map