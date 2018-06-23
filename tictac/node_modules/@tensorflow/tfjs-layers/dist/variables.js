"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var tfjs_backend_1 = require("./backend/tfjs_backend");
var common_1 = require("./common");
var errors_1 = require("./errors");
var types_1 = require("./types");
var DEFAULT_VARIABLE_NAME_PREFIX = 'Variable';
var LayerVariable = (function () {
    function LayerVariable(val, dtype, name, trainable, constraint) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (name === void 0) { name = DEFAULT_VARIABLE_NAME_PREFIX; }
        if (trainable === void 0) { trainable = true; }
        if (constraint === void 0) { constraint = null; }
        this.dtype = dtype == null ? 'float32' : dtype;
        this.shape = val.shape;
        this.id = types_1.getNextUniqueTensorId();
        name = name == null ? DEFAULT_VARIABLE_NAME_PREFIX : name;
        this.originalName = common_1.getScopedTensorName(name);
        this.name = common_1.getUniqueTensorName(this.originalName);
        this.trainable = trainable;
        this.constraint = constraint;
        this.val = tfc.variable(val, this.trainable, this.name, this.dtype);
    }
    LayerVariable.prototype.read = function () {
        return this.val;
    };
    LayerVariable.prototype.write = function (newVal) {
        checkShapesMatch(this.val, newVal);
        this.val.assign(newVal);
        if (this.constraint != null) {
            this.val.assign(this.constraint.apply(this.val));
        }
        return this;
    };
    return LayerVariable;
}());
exports.LayerVariable = LayerVariable;
function checkShapesMatch(x, y) {
    if (x.shape.toString() !== y.shape.toString()) {
        throw new Error('Shape mismatch: ' + JSON.stringify(x.shape) + ' vs. ' +
            JSON.stringify(y.shape));
    }
}
function variable(x, dtype, name, constraint) {
    return new LayerVariable(x, dtype, name, true, constraint);
}
exports.variable = variable;
function zerosVariable(shape, dtype, name) {
    return new LayerVariable(tfc.zeros(shape), dtype, name);
}
exports.zerosVariable = zerosVariable;
function zerosLike(x, dtype, name) {
    return new LayerVariable(tfc.zerosLike(x), dtype, name);
}
exports.zerosLike = zerosLike;
function onesVariable(shape, dtype, name) {
    var allocated = tfc.ones(shape);
    return new LayerVariable(allocated, dtype, name);
}
exports.onesVariable = onesVariable;
function onesLike(x, dtype, name) {
    var allocated = tfc.onesLike(x);
    return new LayerVariable(allocated, dtype, name);
}
exports.onesLike = onesLike;
function eyeVariable(size, dtype, name) {
    return new LayerVariable(tfc.eye(size), dtype, name);
}
exports.eyeVariable = eyeVariable;
function randomUniformVariable(shape, minval, maxval, dtype, seed, name) {
    if (name === void 0) { name = 'randomUniform'; }
    return new LayerVariable(tfc.randomUniform(shape, minval, maxval, dtype), dtype, name);
}
exports.randomUniformVariable = randomUniformVariable;
function truncatedNormalVariable(shape, mean, stddev, dtype, seed, name) {
    if (mean === void 0) { mean = 0.0; }
    if (stddev === void 0) { stddev = 1.0; }
    if (name === void 0) { name = 'truncatedNormal'; }
    if (dtype === 'bool') {
        throw new errors_1.NotImplementedError("randomNormal does not support dType bool.");
    }
    return new LayerVariable(tfc.truncatedNormal(shape, mean, stddev, dtype, seed), dtype, name);
}
exports.truncatedNormalVariable = truncatedNormalVariable;
function randomNormalVariable(shape, mean, stddev, dtype, seed, name) {
    if (mean === void 0) { mean = 0.0; }
    if (stddev === void 0) { stddev = 1.0; }
    if (name === void 0) { name = 'randomNormal'; }
    if (dtype === 'bool') {
        throw new errors_1.NotImplementedError("randomNormalVariable does not support dType bool.");
    }
    return new LayerVariable(tfjs_backend_1.randomNormal(shape, mean, stddev, dtype, seed), dtype, name);
}
exports.randomNormalVariable = randomNormalVariable;
function update(x, xNew) {
    return x.write(xNew);
}
exports.update = update;
function updateAdd(x, increment) {
    return x.write(tfc.add(x.read(), increment));
}
exports.updateAdd = updateAdd;
function updateSub(x, decrement) {
    return x.write(tfc.sub(x.read(), decrement));
}
exports.updateSub = updateSub;
function batchGetValue(xs) {
    return xs.map(function (x) { return x.read(); });
}
exports.batchGetValue = batchGetValue;
function batchSetValue(variablesAndValues) {
    variablesAndValues.map(function (variableAndValue) {
        var variable = variableAndValue[0];
        variable.write(variableAndValue[1]);
    });
}
exports.batchSetValue = batchSetValue;
//# sourceMappingURL=variables.js.map