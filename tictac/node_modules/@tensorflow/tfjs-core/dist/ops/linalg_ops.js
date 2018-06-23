"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var tracking_1 = require("../tracking");
var util_1 = require("../util");
var operation_1 = require("./operation");
var ops_1 = require("./ops");
var LinalgOps = (function () {
    function LinalgOps() {
    }
    LinalgOps.gramSchmidt = function (xs) {
        var inputIsTensor2D;
        if (Array.isArray(xs)) {
            inputIsTensor2D = false;
            util_1.assert(xs != null && xs.length > 0, 'Gram-Schmidt process: input must not be null, undefined, or empty');
            var dim = xs[0].shape[0];
            for (var i = 1; i < xs.length; ++i) {
                util_1.assert(xs[i].shape[0] === dim, 'Gram-Schmidt: Non-unique lengths found in the input vectors: ' +
                    ("(" + xs[i].shape[0] + " vs. " + dim + ")"));
            }
        }
        else {
            inputIsTensor2D = true;
            xs = ops_1.split(xs, xs.shape[0], 0).map(function (x) { return ops_1.squeeze(x, [0]); });
        }
        util_1.assert(xs.length <= xs[0].shape[0], "Gram-Schmidt: Number of vectors (" + xs.length + ") exceeds " +
            ("number of dimensions (" + xs[0].shape[0] + ")."));
        var ys = [];
        var xs1d = xs;
        var _loop_1 = function (i) {
            ys.push(tracking_1.Tracking.tidy(function () {
                var x = xs1d[i];
                if (i > 0) {
                    for (var j = 0; j < i; ++j) {
                        var proj = ops_1.sum(ys[j].mulStrict(x)).mul(ys[j]);
                        x = x.sub(proj);
                    }
                }
                return x.div(ops_1.norm(x, 'euclidean'));
            }));
        };
        for (var i = 0; i < xs.length; ++i) {
            _loop_1(i);
        }
        if (inputIsTensor2D) {
            return ops_1.stack(ys, 0);
        }
        else {
            return ys;
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Linear Algebra' }),
        operation_1.operation
    ], LinalgOps, "gramSchmidt", null);
    return LinalgOps;
}());
exports.LinalgOps = LinalgOps;
//# sourceMappingURL=linalg_ops.js.map