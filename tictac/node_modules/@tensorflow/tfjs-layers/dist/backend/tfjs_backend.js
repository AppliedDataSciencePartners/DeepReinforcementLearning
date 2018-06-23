"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var common_1 = require("../common");
var errors_1 = require("../errors");
var math_utils = require("../utils/math_utils");
var variables_1 = require("../variables");
var common_2 = require("./common");
var common_3 = require("./common");
var backend = 'webgl';
var DEFAULT_DTYPE = 'float32';
function disposeScalarCache() {
    for (var typeKey in scalarCache) {
        for (var key in scalarCache[typeKey]) {
            scalarCache[typeKey][key].dispose();
            delete scalarCache[typeKey][key];
        }
    }
}
exports.disposeScalarCache = disposeScalarCache;
function setBackend(requestedBackend) {
    tfc.setBackend(requestedBackend);
    backend = requestedBackend;
    disposeScalarCache();
}
exports.setBackend = setBackend;
function getBackend() {
    return backend;
}
exports.getBackend = getBackend;
var scalarCache = {
    float32: {},
    int32: {}
};
function getScalar(value, dtype) {
    if (dtype === undefined) {
        dtype = DEFAULT_DTYPE;
    }
    if (scalarCache[dtype][value] == null) {
        scalarCache[dtype][value] = tfjs_core_1.scalar(value, dtype);
        tfc.keep(scalarCache[dtype][value]);
    }
    return scalarCache[dtype][value];
}
exports.getScalar = getScalar;
exports.epsilon = common_2.epsilon;
function isBackendSymbolic() {
    return false;
}
exports.isBackendSymbolic = isBackendSymbolic;
function shape(x) {
    return x.shape;
}
exports.shape = shape;
function intShape(x) {
    return x.shape;
}
exports.intShape = intShape;
function dtype(x) {
    return (x instanceof tfjs_core_1.Tensor) ? DEFAULT_DTYPE : x.dtype;
}
exports.dtype = dtype;
function countParams(x) {
    var shape = x.shape;
    if (shape.length > 0) {
        return shape.reduce(function (a, b) { return a * b; });
    }
    else {
        return 1;
    }
}
exports.countParams = countParams;
function cast(x, dtype) {
    return x.asType(dtype);
}
exports.cast = cast;
function expandDims(x, axis) {
    if (axis === void 0) { axis = -1; }
    var outShape = shape(x).slice();
    if (axis < 0) {
        axis = outShape.length + axis + 1;
    }
    outShape.splice(axis, 0, 1);
    return x.reshape(outShape);
}
exports.expandDims = expandDims;
function repeat(x, n) {
    return tfjs_core_1.tidy(function () {
        if (x.shape.length !== 2) {
            throw new errors_1.ValueError("repeat() expects a rank-2 tensor, but received a " +
                ("rank-" + x.shape.length + " tensor."));
        }
        var y = expandDims(x, 1);
        return tile(y, [1, n, 1]);
    });
}
exports.repeat = repeat;
function flatten(x) {
    var newShape = [math_utils.arrayProd(x.shape)];
    return x.reshape(newShape);
}
exports.flatten = flatten;
function batchFlatten(x) {
    if (x.rank <= 1) {
        throw new errors_1.ValueError("batchFlatten requires a minimum rank of 2. Got rank: " + x.rank + ".");
    }
    var newShape = [x.shape[0], math_utils.arrayProd(x.shape, 1)];
    return x.reshape(newShape);
}
exports.batchFlatten = batchFlatten;
function sliceAlongFirstAxis(array, start, size) {
    return tfjs_core_1.tidy(function () {
        switch (array.rank) {
            case 1:
                return tfc.slice1d(array, start, size);
            case 2:
                return tfc.slice2d(array, [start, 0], [size, array.shape[1]]);
            case 3:
                return tfc.slice3d(array, [start, 0, 0], [size, array.shape[1], array.shape[2]]);
            case 4:
                return tfc.slice4d(array, [start, 0, 0, 0], [size, array.shape[1], array.shape[2], array.shape[3]]);
            default:
                throw new errors_1.ValueError("sliceAlongFirstAxis() received an unsupported tensor rank: " +
                    ("" + array.rank));
        }
    });
}
exports.sliceAlongFirstAxis = sliceAlongFirstAxis;
function sliceAlongLastAxis(array, start, size) {
    return tfjs_core_1.tidy(function () {
        switch (array.rank) {
            case 1:
                return tfc.slice1d(array, start, size);
            case 2:
                return tfc.slice2d(array, [0, start], [array.shape[0], size]);
            case 3:
                return tfc.slice3d(array, [0, 0, start], [array.shape[0], array.shape[1], size]);
            case 4:
                return tfc.slice4d(array, [0, 0, 0, start], [array.shape[0], array.shape[1], array.shape[2], size]);
            default:
                throw new errors_1.ValueError("sliceAlongLastAxis() received an unsupported tensor rank: " +
                    ("" + array.rank));
        }
    });
}
exports.sliceAlongLastAxis = sliceAlongLastAxis;
function sliceAlongAxis(array, start, size, axis) {
    return tfjs_core_1.tidy(function () {
        switch (array.rank) {
            case 1:
                return tfc.slice1d(array, start, size);
            case 2:
                switch (axis) {
                    case 1:
                        return sliceAlongFirstAxis(array, start, size);
                    case 2:
                        return sliceAlongLastAxis(array, start, size);
                    default:
                        throw new errors_1.ValueError("The axis is not within the rank of the tensor " +
                            ("" + axis));
                }
            case 3:
                switch (axis) {
                    case 1:
                        return sliceAlongFirstAxis(array, start, size);
                    case 2:
                        return tfc.slice3d(array, [0, start, 0], [array.shape[0], size, array.shape[2]]);
                    case 3:
                        return sliceAlongLastAxis(array, start, size);
                    default:
                        throw new errors_1.ValueError("The axis is not within the rank of the tensor " +
                            ("" + axis));
                }
            case 4:
                switch (axis) {
                    case 1:
                        return sliceAlongFirstAxis(array, start, size);
                    case 2:
                        return tfc.slice4d(array, [0, start, 0, 0], [array.shape[0], size, array.shape[2], array.shape[3]]);
                    case 3:
                        return tfc.slice4d(array, [0, 0, start, 0], [array.shape[0], array.shape[1], size, array.shape[3]]);
                    case 4:
                        return sliceAlongLastAxis(array, start, size);
                    default:
                        throw new errors_1.ValueError("The axis is not within the rank of the tensor " +
                            ("" + axis));
                }
            default:
                throw new errors_1.ValueError("sliceAlongLastAxis() received an unsupported tensor rank: " +
                    ("" + array.rank));
        }
    });
}
exports.sliceAlongAxis = sliceAlongAxis;
function concatenate(tensors, axis) {
    if (axis === void 0) { axis = -1; }
    var rank;
    if (axis < 0) {
        rank = tensors[0].rank;
        if (rank !== 0) {
            axis = rank;
        }
        else {
            axis = 0;
        }
    }
    if (axis === tensors[0].rank) {
        axis = -1;
    }
    return tfc.concat(tensors, axis);
}
exports.concatenate = concatenate;
function concatAlongFirstAxis(a, b) {
    switch (a.rank) {
        case 1:
            return tfc.concat1d([a, b]);
        case 2:
            return tfc.concat2d([a, b], 0);
        case 3:
            return tfc.concat3d([a, b], 0);
        case 4:
            return tfc.concat4d([a, b], 0);
        default:
            throw new errors_1.ValueError('concatAlongFirstAxis() received an unsupported tensor rank: ' +
                a.rank);
    }
}
exports.concatAlongFirstAxis = concatAlongFirstAxis;
function tile(x, n) {
    if (!Array.isArray(n)) {
        n = [n];
    }
    if (x.rank !== n.length) {
        throw new errors_1.ValueError("The length of input n (" + n.length + ") does not match " +
            ("the number of dimensions in input x (" + x.rank + ")"));
    }
    return tfc.tile(x, n);
}
exports.tile = tile;
function identity(x) {
    return x.clone();
}
exports.identity = identity;
function eyeVariable(size, dtype, name) {
    return new variables_1.LayerVariable(tfc.eye(size, size, null, dtype), dtype, name);
}
exports.eyeVariable = eyeVariable;
function scalarTimesArray(c, x) {
    return tfc.mul(c, x);
}
exports.scalarTimesArray = scalarTimesArray;
function scalarPlusArray(c, x) {
    return tfc.add(c, x);
}
exports.scalarPlusArray = scalarPlusArray;
function randomNormal(shape, mean, stddev, dtype, seed) {
    if (mean === void 0) { mean = 0.0; }
    if (stddev === void 0) { stddev = 1.0; }
    return tfc.randomNormal(shape, mean, stddev, dtype, seed);
}
exports.randomNormal = randomNormal;
function dot(x, y) {
    if (y.rank !== 2) {
        throw new errors_1.NotImplementedError("dot support for y other than rank 2 is not yet implemented: " +
            ("y shape = " + shape));
    }
    else {
        if (x.rank === 2) {
            return tfc.matMul(x, y);
        }
        else if (x.rank === 3) {
            var xShape0 = x.shape[0];
            var xShape1 = x.shape[1];
            var xShape2 = x.shape[2];
            x = x.reshape([xShape0 * xShape1, xShape2]);
            return tfc.matMul(x, y).reshape([
                xShape0, xShape1, y.shape[1]
            ]);
        }
        else {
            throw new errors_1.NotImplementedError("dot support for x of rank " + x.rank + " is not yet implemented: " +
                ("x shape = " + shape));
        }
    }
}
exports.dot = dot;
function sign(x) {
    return tfjs_core_1.tidy(function () {
        var zerosLikeX = tfjs_core_1.zerosLike(x);
        var onesLikeX = tfjs_core_1.onesLike(x);
        return tfjs_core_1.where(tfc.equal(x, zerosLikeX), zerosLikeX, tfjs_core_1.where(tfc.greater(x, tfjs_core_1.zerosLike(x)), onesLikeX, scalarTimesArray(getScalar(-1), onesLikeX)));
    });
}
exports.sign = sign;
function qr(x) {
    var _a = tfjs_core_1.tidy(function () {
        if (x.shape.length !== 2) {
            throw new errors_1.ValueError("qr() requires a 2D Tensor, but got a " + x.shape.length + "D Tensor.");
        }
        if (x.shape[0] < x.shape[1]) {
            throw new errors_1.ValueError("qr() requires x.shape[0] >= x.shape[1], but got shape: [" + x.shape + "]");
        }
        var m = x.shape[0];
        var n = x.shape[1];
        var q = tfc.eye(m);
        var r = x.clone();
        var one2D = tfjs_core_1.tensor2d([[1]], [1, 1]);
        var w = one2D.clone();
        var _loop_1 = function (j) {
            var rTemp = r;
            var wTemp = w;
            var qTemp = q;
            _a = tfjs_core_1.tidy(function () {
                var rjEnd1 = r.slice([j, j], [m - j, 1]);
                var normX = tfc.norm(rjEnd1);
                var rjj = r.slice([j, j], [1, 1]);
                var s = tfc.neg(sign(rjj));
                var u1 = rjj.sub(tfc.mul(s, normX));
                var wPre = tfc.div(rjEnd1, u1);
                if (wPre.shape[0] === 1) {
                    w = one2D.clone();
                }
                else {
                    w = one2D.concat(wPre.slice([1, 0], [wPre.shape[0] - 1, wPre.shape[1]]), 0);
                }
                var tau = tfc.neg(tfc.div(tfc.matMul(s, u1), normX));
                var rjEndAll = r.slice([j, 0], [m - j, n]);
                var tauTimesW = tau.mul(w);
                if (j === 0) {
                    r = rjEndAll.sub(tauTimesW.matMul(w.transpose().matMul(rjEndAll)));
                }
                else {
                    r = r.slice([0, 0], [j, n])
                        .concat(rjEndAll.sub(tauTimesW.matMul(w.transpose().matMul(rjEndAll))), 0);
                }
                var qAllJEnd = q.slice([0, j], [m, q.shape[1] - j]);
                if (j === 0) {
                    q = qAllJEnd.sub(qAllJEnd.matMul(w).matMul(tauTimesW.transpose()));
                }
                else {
                    q = q.slice([0, 0], [m, j])
                        .concat(qAllJEnd.sub(qAllJEnd.matMul(w).matMul(tauTimesW.transpose())), 1);
                }
                return [w, r, q];
            }), w = _a[0], r = _a[1], q = _a[2];
            tfjs_core_1.dispose([rTemp, wTemp, qTemp]);
            var _a;
        };
        for (var j = 0; j < n; ++j) {
            _loop_1(j);
        }
        return [q, r];
    }), qOuter = _a[0], rOuter = _a[1];
    return [qOuter, rOuter];
}
exports.qr = qr;
function oneHot(indices, numClasses) {
    return tfjs_core_1.tidy(function () {
        if (indices.rank !== 1) {
            throw new Error('Only 1D one-hot tensors are supported in the ' +
                'deeplearn backend, at present.');
        }
        indices = indices.toInt();
        return tfc.oneHot(indices, numClasses).toFloat();
    });
}
exports.oneHot = oneHot;
function gather(reference, indices, axis) {
    return tfjs_core_1.tidy(function () {
        if (Array.isArray(indices)) {
            indices = tfjs_core_1.tensor1d(indices, 'int32');
        }
        else {
            indices = indices.toInt();
        }
        return tfc.gather(reference, indices, axis);
    });
}
exports.gather = gather;
function square(x) {
    return tfc.mulStrict(x, x);
}
exports.square = square;
function pow(x, a) {
    return tfjs_core_1.tidy(function () {
        if (typeof (a) === 'number') {
            a = tfjs_core_1.scalar(Math.round(a), 'int32');
        }
        if (a.dtype !== 'int32') {
            throw new errors_1.NotImplementedError("Non-int32 dtype (" + a.dtype + ") is not supported by pow() yet");
        }
        return tfc.pow(x, a);
    });
}
exports.pow = pow;
function biasAdd(x, bias, dataFormat) {
    return tfjs_core_1.tidy(function () {
        if (dataFormat == null) {
            dataFormat = common_3.imageDataFormat();
        }
        common_1.checkDataFormat(dataFormat);
        if (bias.rank !== 1 && bias.rank !== x.rank) {
            throw new errors_1.ValueError('Unexpected bias dimensions: ' + bias.rank +
                '; expected it to be 1 or ' + x.rank);
        }
        var biasShape = bias.shape;
        var y;
        if (x.rank === 5) {
            if (dataFormat === 'channelsFirst') {
                if (biasShape.length === 1) {
                    y = x.add(bias.reshape([1, biasShape[0], 1, 1, 1]));
                }
                else {
                    y = x.add(bias.reshape([1, biasShape[3], biasShape[0], biasShape[1], biasShape[2]]));
                }
            }
            else if (dataFormat === 'channelsLast') {
                if (biasShape.length === 1) {
                    y = x.add(bias.reshape([1, 1, 1, 1, biasShape[0]]));
                }
                else {
                    y = x.add(bias.reshape([1].concat(biasShape)));
                }
            }
        }
        else if (x.rank === 4) {
            if (dataFormat === 'channelsFirst') {
                if (biasShape.length === 1) {
                    y = x.add(bias.reshape([1, biasShape[0], 1, 1]));
                }
                else {
                    y = x.add(bias.reshape([1, biasShape[2], biasShape[0], biasShape[1]]));
                }
            }
            else if (dataFormat === 'channelsLast') {
                if (biasShape.length === 1) {
                    y = x.add(bias.reshape([1, 1, 1, biasShape[0]]));
                }
                else {
                    y = x.add(bias.reshape([1].concat(biasShape)));
                }
            }
        }
        else if (x.rank === 3) {
            if (dataFormat === 'channelsFirst') {
                if (biasShape.length === 1) {
                    y = x.add(bias.reshape([1, biasShape[0], 1]));
                }
                else {
                    y = x.add(bias.reshape([1, biasShape[1], biasShape[0]]));
                }
            }
            else if (dataFormat === 'channelsLast') {
                if (biasShape.length === 1) {
                    y = x.add(bias.reshape([1, 1, biasShape[0]]));
                }
                else {
                    y = x.add(bias.reshape([1].concat(biasShape)));
                }
            }
        }
        else if (x.rank < 3) {
            y = x.add(bias);
        }
        else {
            throw new errors_1.ValueError("Unsupported input rank by biasAdd: " + x.rank);
        }
        return y;
    });
}
exports.biasAdd = biasAdd;
function elu(x, alpha) {
    if (alpha === void 0) { alpha = 1; }
    if (alpha !== 1) {
        throw new errors_1.NotImplementedError("Support for alpha values other than 1 (" + alpha + ") is not implemented " +
            "yet.");
    }
    return tfc.elu(x);
}
exports.elu = elu;
function softsign(x) {
    return tfjs_core_1.tidy(function () { return tfc.div(x, tfc.add(getScalar(1), tfc.abs(x))); });
}
exports.softsign = softsign;
function dropout(x, level, noiseShape, seed) {
    return tfjs_core_1.tidy(function () {
        if (noiseShape != null && !tfjs_core_1.util.arraysEqual(x.shape, noiseShape)) {
            throw new errors_1.NotImplementedError('Non-default noise shape is not implemented yet: ' +
                JSON.stringify(noiseShape));
        }
        if (seed != null) {
            throw new errors_1.NotImplementedError('seed is not implemented for dropout yet.');
        }
        var multiplier = tfc.step(tfc.add(tfc.neg(level), tfc.randomUniform(x.shape, 0, 1, 'float32')));
        multiplier = tfc.mul(tfc.div(getScalar(1), tfc.sub(getScalar(1), level)), multiplier);
        return tfc.mul(x, multiplier);
    });
}
exports.dropout = dropout;
function nameScope(name, fn) {
    return common_1.nameScope(name, fn);
}
exports.nameScope = nameScope;
function floatx() {
    return 'float32';
}
exports.floatx = floatx;
var _uidPrefixes = {};
function getUid(prefix) {
    if (prefix === void 0) { prefix = ''; }
    if (!(prefix in _uidPrefixes)) {
        _uidPrefixes[prefix] = 0;
    }
    _uidPrefixes[prefix] += 1;
    return prefix + _uidPrefixes[prefix].toString();
}
exports.getUid = getUid;
function hardSigmoid(x) {
    return tfjs_core_1.tidy(function () {
        var y = scalarPlusArray(getScalar(0.5), scalarTimesArray(getScalar(0.2), x));
        return tfc.clipByValue(y, 0, 1);
    });
}
exports.hardSigmoid = hardSigmoid;
function inTrainPhase(x, alt, training) {
    if (training === void 0) { training = false; }
    return training ? x() : alt();
}
exports.inTrainPhase = inTrainPhase;
function gradients(lossFn, variables) {
    var variableList = variables.map(function (variable) { return variable.read(); });
    var valudAndGrads = tfjs_core_1.variableGrads(lossFn, variableList);
    return variables.map(function (variable) { return valudAndGrads.grads[variable.name]; });
}
exports.gradients = gradients;
//# sourceMappingURL=tfjs_backend.js.map