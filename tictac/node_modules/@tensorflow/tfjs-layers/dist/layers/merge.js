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
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("../backend/tfjs_backend");
var topology_1 = require("../engine/topology");
var errors_1 = require("../errors");
var generic_utils = require("../utils/generic_utils");
var mathUtils = require("../utils/math_utils");
var Merge = (function (_super) {
    __extends(Merge, _super);
    function Merge(config) {
        var _this = _super.call(this, config || {}) || this;
        _this.supportsMasking = true;
        return _this;
    }
    Merge.prototype.mergeFunction = function (inputs) {
        throw new errors_1.NotImplementedError();
    };
    Merge.prototype.computeElementwiseOpOutputShape = function (shape1, shape2) {
        if (shape1 == null || shape2 == null) {
            return null;
        }
        else if (shape1.length < shape2.length) {
            return this.computeElementwiseOpOutputShape(shape2, shape1);
        }
        else if (shape2.length === 0) {
            return shape1;
        }
        var outputShape = shape1.slice(0, shape1.length - shape2.length);
        for (var k = 0; k < shape2.length; ++k) {
            var i = shape1[shape1.length - shape2.length + k];
            var j = shape2[k];
            if (i == null || j == null || i < 0 || j < 0) {
                outputShape.push(null);
            }
            else if (i === 1) {
                outputShape.push(j);
            }
            else if (j === 1) {
                outputShape.push(i);
            }
            else {
                if (i !== j) {
                    throw new errors_1.ValueError('Operands could not be broadcast together with shapes ' +
                        JSON.stringify(shape1) + ' ' + JSON.stringify(shape2));
                }
                outputShape.push(i);
            }
        }
        return outputShape;
    };
    Merge.prototype.build = function (inputShape) {
        if (Array.isArray(inputShape) && !Array.isArray(inputShape[0])) {
            inputShape = [generic_utils.getExactlyOneShape(inputShape)];
        }
        inputShape = inputShape;
        if (inputShape.length < 2) {
            throw new errors_1.ValueError('A merge layer should be called on an Array of at least 2 inputs.' +
                (" Got " + inputShape.length + " input(s)."));
        }
        var batchSizes = [];
        for (var _i = 0, inputShape_1 = inputShape; _i < inputShape_1.length; _i++) {
            var shape = inputShape_1[_i];
            if (shape != null && shape[0] !== null) {
                batchSizes.push(shape[0]);
            }
        }
        batchSizes = generic_utils.unique(batchSizes);
        if (batchSizes.length > 1) {
            throw new errors_1.ValueError("Can not merge tensors with different batch sizes. " +
                ("Got tensors with shapes: " + JSON.stringify(inputShape) + "."));
        }
        var outputShape = inputShape[0] == null ? null : inputShape[0].slice(1);
        for (var i = 1; i < inputShape.length; ++i) {
            var shape = inputShape[i] == null ? null : inputShape[i].slice(1);
            outputShape = this.computeElementwiseOpOutputShape(outputShape, shape);
        }
        var allRanks = inputShape.map(function (shape) { return shape.length; });
        if (inputShape.indexOf(null) === -1 &&
            generic_utils.unique(allRanks).length === 1) {
            this.reshapeRequired = false;
        }
        else {
            this.reshapeRequired = true;
        }
    };
    Merge.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = inputs;
            if (_this.reshapeRequired) {
                var reshapedInputs = [];
                var inputDims = inputs.map(function (input) { return input.rank; });
                if (inputDims.indexOf(null) === -1) {
                    var maxNDim = mathUtils.max(inputDims);
                    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                        var x = inputs_1[_i];
                        var xNDim = x.rank;
                        for (var k = 0; k < maxNDim - xNDim; ++k) {
                            x = K.expandDims(x, 1);
                        }
                        reshapedInputs.push(x);
                    }
                    return _this.mergeFunction(reshapedInputs);
                }
                else {
                    var transposed = false;
                    for (var _a = 0, inputs_2 = inputs; _a < inputs_2.length; _a++) {
                        var x = inputs_2[_a];
                        var xNDim = x.rank;
                        if (xNDim == null) {
                            var xShape = K.shape(x);
                            var batchSize = xShape[0];
                            var newShape = xShape.slice(1).concat([batchSize]);
                            var xTransposed = x.reshape([batchSize].concat(mathUtils.arrayProd(xShape.slice(1))));
                            xTransposed = tfc.transpose(xTransposed, [1, 0]);
                            xTransposed = xTransposed.reshape(newShape);
                            reshapedInputs.push(xTransposed);
                            transposed = true;
                        }
                        else if (xNDim > 1) {
                            var dims = mathUtils.range(1, xNDim).concat([0]);
                            reshapedInputs.push(tfc.transpose(x, dims));
                            transposed = true;
                        }
                        else {
                            reshapedInputs.push(x);
                        }
                    }
                    var y = _this.mergeFunction(reshapedInputs);
                    var yNDim = y.rank;
                    if (transposed) {
                        if (yNDim == null) {
                            var yShape = K.shape(y);
                            var yNDim_1 = yShape.length;
                            var batchSize = yShape[yNDim_1 - 1];
                            var newShape = [batchSize].concat(yShape.slice(0, yShape.length - 1));
                            y = tfc.transpose(y.reshape([-1, batchSize]), [1, 0])
                                .reshape(newShape);
                        }
                        else if (yNDim > 1) {
                            var dims = [yNDim - 1].concat(mathUtils.range(0, yNDim - 1));
                            y = tfc.transpose(y, dims);
                        }
                    }
                    return y;
                }
            }
            else {
                return _this.mergeFunction(inputs);
            }
        });
    };
    Merge.prototype.computeOutputShape = function (inputShape) {
        inputShape = inputShape;
        var outputShape;
        if (inputShape[0] == null) {
            outputShape = null;
        }
        else {
            outputShape = inputShape[0].slice(1);
        }
        for (var i = 1; i < inputShape.length; ++i) {
            var shape = inputShape[i] == null ? null : inputShape[i].slice(1);
            outputShape = this.computeElementwiseOpOutputShape(outputShape, shape);
        }
        var batchSizes = [];
        for (var _i = 0, inputShape_2 = inputShape; _i < inputShape_2.length; _i++) {
            var shape = inputShape_2[_i];
            if (shape != null && shape[0] !== null) {
                batchSizes.push(shape[0]);
            }
        }
        batchSizes = generic_utils.unique(batchSizes);
        if (batchSizes.length === 1) {
            outputShape = batchSizes.concat(outputShape);
        }
        else {
            outputShape = [null].concat(outputShape);
        }
        return outputShape;
    };
    return Merge;
}(topology_1.Layer));
exports.Merge = Merge;
var Add = (function (_super) {
    __extends(Add, _super);
    function Add(config) {
        return _super.call(this, config) || this;
    }
    Add.prototype.mergeFunction = function (inputs) {
        return tfjs_core_1.tidy(function () {
            var output = tfc.zeros(inputs[0].shape);
            for (var _i = 0, inputs_3 = inputs; _i < inputs_3.length; _i++) {
                var input = inputs_3[_i];
                output = tfc.add(output, input);
            }
            return output;
        });
    };
    Add.className = 'Add';
    return Add;
}(Merge));
exports.Add = Add;
tfjs_core_1.serialization.SerializationMap.register(Add);
function add(config) {
    if (Array.isArray(config)) {
        var layer = new Add({});
        return layer.apply(config);
    }
    else {
        return new Add(config);
    }
}
exports.add = add;
var Multiply = (function (_super) {
    __extends(Multiply, _super);
    function Multiply(config) {
        return _super.call(this, config) || this;
    }
    Multiply.prototype.mergeFunction = function (inputs) {
        return tfjs_core_1.tidy(function () {
            var output = tfc.ones(inputs[0].shape);
            for (var _i = 0, inputs_4 = inputs; _i < inputs_4.length; _i++) {
                var input = inputs_4[_i];
                output = tfc.mul(output, input);
            }
            return output;
        });
    };
    Multiply.className = 'Multiply';
    return Multiply;
}(Merge));
exports.Multiply = Multiply;
tfjs_core_1.serialization.SerializationMap.register(Multiply);
function multiply(config) {
    if (Array.isArray(config)) {
        var layer = new Multiply({});
        return layer.apply(config);
    }
    else {
        return new Multiply(config);
    }
}
exports.multiply = multiply;
var Average = (function (_super) {
    __extends(Average, _super);
    function Average(config) {
        return _super.call(this, config) || this;
    }
    Average.prototype.mergeFunction = function (inputs) {
        return tfjs_core_1.tidy(function () {
            var output = tfc.zeros(inputs[0].shape);
            for (var _i = 0, inputs_5 = inputs; _i < inputs_5.length; _i++) {
                var input = inputs_5[_i];
                output = tfc.add(output, input);
            }
            return K.scalarTimesArray(K.getScalar(1 / inputs.length), output);
        });
    };
    Average.className = 'Average';
    return Average;
}(Merge));
exports.Average = Average;
tfjs_core_1.serialization.SerializationMap.register(Average);
function average(config) {
    if (Array.isArray(config)) {
        var layer = new Average({});
        return layer.apply(config);
    }
    else {
        return new Average(config);
    }
}
exports.average = average;
var Maximum = (function (_super) {
    __extends(Maximum, _super);
    function Maximum(config) {
        return _super.call(this, config) || this;
    }
    Maximum.prototype.mergeFunction = function (inputs) {
        return tfjs_core_1.tidy(function () {
            var output = inputs[0];
            for (var i = 1; i < inputs.length; ++i) {
                output = tfc.maximum(output, inputs[i]);
            }
            return output;
        });
    };
    Maximum.className = 'Maximum';
    return Maximum;
}(Merge));
exports.Maximum = Maximum;
tfjs_core_1.serialization.SerializationMap.register(Maximum);
function maximum(config) {
    if (Array.isArray(config)) {
        var layer = new Maximum({});
        return layer.apply(config);
    }
    else {
        return new Maximum(config);
    }
}
exports.maximum = maximum;
var Minimum = (function (_super) {
    __extends(Minimum, _super);
    function Minimum(config) {
        return _super.call(this, config) || this;
    }
    Minimum.prototype.mergeFunction = function (inputs) {
        return tfjs_core_1.tidy(function () {
            var output = inputs[0];
            for (var i = 1; i < inputs.length; ++i) {
                output = tfc.minimum(output, inputs[i]);
            }
            return output;
        });
    };
    Minimum.className = 'Minimum';
    return Minimum;
}(Merge));
exports.Minimum = Minimum;
tfjs_core_1.serialization.SerializationMap.register(Minimum);
function minimum(config) {
    if (Array.isArray(config)) {
        var layer = new Minimum({});
        return layer.apply(config);
    }
    else {
        return new Minimum(config);
    }
}
exports.minimum = minimum;
var Concatenate = (function (_super) {
    __extends(Concatenate, _super);
    function Concatenate(config) {
        var _this = _super.call(this, config) || this;
        _this.DEFAULT_AXIS = -1;
        if (config == null) {
            config = {};
        }
        _this.axis = config.axis == null ? _this.DEFAULT_AXIS : config.axis;
        _this.supportsMasking = true;
        _this.reshapeRequired = false;
        return _this;
    }
    Concatenate.prototype.build = function (inputShape) {
        if (!(Array.isArray(inputShape) && Array.isArray(inputShape[0])) ||
            inputShape.length === 1) {
            throw new errors_1.ValueError('A `Concatenate` layer should be called on a list of at least 2 ' +
                'inputs');
        }
        inputShape = inputShape;
        var allNoneShape = true;
        for (var _i = 0, inputShape_3 = inputShape; _i < inputShape_3.length; _i++) {
            var shape = inputShape_3[_i];
            if (shape != null) {
                allNoneShape = false;
                break;
            }
        }
        if (allNoneShape) {
            return;
        }
        var shapeSet = [];
        for (var i = 0; i < inputShape.length; ++i) {
            var shapeWithoutConcatAxis = inputShape[i].slice();
            shapeWithoutConcatAxis.splice(this.axis, 1);
            var exists = false;
            for (var _a = 0, shapeSet_1 = shapeSet; _a < shapeSet_1.length; _a++) {
                var shape = shapeSet_1[_a];
                if (tfjs_core_1.util.arraysEqual(shape, shapeWithoutConcatAxis)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                shapeSet.push(shapeWithoutConcatAxis);
            }
        }
        if (shapeSet.length > 1) {
            throw new errors_1.ValueError('A `Concatenate` layer requires inputs with matching shapes ' +
                'except for the concat axis. Got input shapes: ' +
                JSON.stringify(inputShape));
        }
    };
    Concatenate.prototype.mergeFunction = function (inputs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            return K.concatenate(inputs, _this.axis);
        });
    };
    Concatenate.prototype.computeOutputShape = function (inputShape) {
        if (!(Array.isArray(inputShape) && Array.isArray(inputShape[0]))) {
            throw new errors_1.ValueError('A `Concatenate` layer should be called on a list of inputs.');
        }
        var inputShapes = inputShape;
        var outputShape = inputShapes[0].slice();
        var axis = this.axis < 0 ? outputShape.length + this.axis : this.axis;
        for (var _i = 0, _a = inputShapes.slice(1); _i < _a.length; _i++) {
            var shape = _a[_i];
            if (outputShape[axis] == null || shape[axis] == null) {
                outputShape[axis] = null;
                break;
            }
            outputShape[axis] += shape[axis];
        }
        return outputShape;
    };
    Concatenate.prototype.getConfig = function () {
        var config = {
            'axis': this.axis,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Concatenate.className = 'Concatenate';
    return Concatenate;
}(Merge));
exports.Concatenate = Concatenate;
tfjs_core_1.serialization.SerializationMap.register(Concatenate);
function concatenate(config) {
    if (Array.isArray(config)) {
        var layer = new Concatenate({});
        return layer.apply(config);
    }
    else {
        return new Concatenate(config);
    }
}
exports.concatenate = concatenate;
//# sourceMappingURL=merge.js.map