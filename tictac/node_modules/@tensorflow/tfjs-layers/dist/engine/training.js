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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("../backend/tfjs_backend");
var callbacks_1 = require("../callbacks");
var errors_1 = require("../errors");
var losses = require("../losses");
var Metrics = require("../metrics");
var optimizers = require("../optimizers");
var generic_utils_1 = require("../utils/generic_utils");
var layer_utils_1 = require("../utils/layer_utils");
var math_utils_1 = require("../utils/math_utils");
var executor_1 = require("./executor");
var topology_1 = require("./topology");
function isDataTensor(x) {
    return x instanceof tfjs_core_1.Tensor;
}
exports.isDataTensor = isDataTensor;
function isDataArray(x) {
    return Array.isArray(x);
}
exports.isDataArray = isDataArray;
function isDataDict(x) {
    return !isDataTensor(x) && !isDataArray(x);
}
exports.isDataDict = isDataDict;
function standardizeInputData(data, names, shapes, checkBatchAxis, exceptionPrefix) {
    if (checkBatchAxis === void 0) { checkBatchAxis = true; }
    if (exceptionPrefix === void 0) { exceptionPrefix = ''; }
    if (names == null || names.length === 0) {
        if (data != null) {
            var gotUnexpectedData = false;
            if (isDataArray(data) && data.length > 0) {
                gotUnexpectedData = true;
            }
            else if (isDataDict(data)) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        gotUnexpectedData = true;
                        break;
                    }
                }
            }
            else {
                gotUnexpectedData = true;
            }
            if (gotUnexpectedData) {
                throw new errors_1.ValueError("Error when checking model " + exceptionPrefix + " expected no data, " +
                    ("but got " + data));
            }
        }
        return [];
    }
    if (data == null) {
        return names.map(function (name) { return null; });
    }
    var arrays;
    if (isDataDict(data)) {
        data = data;
        arrays = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            if (data[name_1] == null) {
                throw new errors_1.ValueError("No data provided for \"" + name_1 + "\". Need data for each key in: " +
                    ("" + names));
            }
            arrays.push(data[name_1]);
        }
    }
    else if (isDataArray(data)) {
        data = data;
        if (data.length !== names.length) {
            throw new errors_1.ValueError("Error when checking model " + exceptionPrefix + ": the Array of " +
                "Tensors that you are passing to your model is not the size the " +
                ("model expected. Expected to see " + names.length + " Tensor(s), but ") +
                ("instead got the following list of Tensor(s): " + data));
        }
        arrays = data;
    }
    else {
        data = data;
        if (names.length > 1) {
            throw new errors_1.ValueError("The model " + exceptionPrefix + " expects " + names.length + " Tensor(s), " +
                ("but only received one Tensor. Found: Tensor with shape " + data.shape));
        }
        arrays = [data];
    }
    for (var i = 0; i < names.length; ++i) {
        var array = arrays[i];
        if (array.shape.length === 1) {
            arrays[i] = K.expandDims(array, 1);
        }
    }
    if (shapes != null) {
        for (var i = 0; i < names.length; ++i) {
            if (shapes[i] == null) {
                continue;
            }
            var array = arrays[i];
            if (array.shape.length !== shapes[i].length) {
                throw new errors_1.ValueError("Error when checking " + exceptionPrefix + ": expected " + names[i] + " " +
                    ("to have " + shapes[i].length + " dimension(s). but got array with ") +
                    ("shape " + array.shape));
            }
            for (var j = 0; j < shapes[i].length; ++j) {
                if (j === 0 && !checkBatchAxis) {
                    continue;
                }
                var dim = array.shape[j];
                var refDim = shapes[i][j];
                if (refDim != null && refDim >= 0 && dim !== refDim) {
                    throw new errors_1.ValueError("Error when checking " + exceptionPrefix + ": expected " + names[i] + " " +
                        ("to have shape [" + shapes[i] + "], but got array with shape ") +
                        ("[" + array.shape + "]."));
                }
            }
        }
    }
    return arrays;
}
exports.standardizeInputData = standardizeInputData;
function checkArrayLengths(inputs, targets, weights) {
    var setX = generic_utils_1.unique(inputs.map(function (input) { return input.shape[0]; }));
    setX.sort();
    var setY = generic_utils_1.unique(targets.map(function (target) { return target.shape[0]; }));
    setY.sort();
    if (setX.length > 1) {
        throw new errors_1.ValueError("All input Tensors (x) should have the same number of samples. " +
            "Got array shapes: " +
            ("" + JSON.stringify(inputs.map(function (input) { return input.shape; }))));
    }
    if (setY.length > 1) {
        throw new errors_1.ValueError("All target Tensors (y) should have the same number of samples. " +
            "Got array shapes: " +
            ("" + JSON.stringify(targets.map(function (target) { return target.shape; }))));
    }
    if (setX.length > 0 && setY.length > 0 && !tfjs_core_1.util.arraysEqual(setX, setY)) {
        throw new errors_1.ValueError("Input Tensors should have the same number of samples as target " +
            ("Tensors. Found " + setX[0] + " input sample(s) and " + setY[0] + " target ") +
            "sample(s).");
    }
}
exports.checkArrayLengths = checkArrayLengths;
function checkLossAndTargetCompatibility(targets, lossFns, outputShapes) {
    var keyLosses = [
        losses.meanSquaredError, losses.binaryCrossentropy,
        losses.categoricalCrossentropy
    ];
    for (var i = 0; i < targets.length; ++i) {
        var y = targets[i];
        var loss = lossFns[i];
        var shape = outputShapes[i];
        if (loss == null) {
            continue;
        }
        if (loss === losses.categoricalCrossentropy) {
            if (y.shape[y.shape.length - 1] === 1) {
                throw new errors_1.ValueError("You are passing a target array of shape " + y.shape + " while using " +
                    "a loss 'categorical_crossentropy'. 'categorical_crossentropy'" +
                    "expects targets to be binary matrices (1s and 0s) of shape " +
                    "[samples, classes].");
            }
        }
        if (keyLosses.indexOf(loss) !== -1) {
            var slicedYShape = y.shape.slice(1);
            var slicedShape = shape.slice(1);
            for (var j = 0; j < slicedYShape.length; ++j) {
                var targetDim = slicedYShape[j];
                var outDim = slicedShape[j];
                if (outDim != null && targetDim !== outDim) {
                    throw new errors_1.ValueError("A target Tensor with shape " + y.shape + " was passed for an " +
                        ("output of shape " + shape + ", while using a loss function that ") +
                        "expects targets to have the same shape as the output.");
                }
            }
        }
    }
}
function makeBatches(size, batchSize) {
    var output = [];
    var batchStart = 0;
    var batchEnd = null;
    while (batchStart < size) {
        batchEnd = batchStart + batchSize;
        if (batchEnd >= size) {
            batchEnd = size;
        }
        output.push([batchStart, batchEnd]);
        batchStart = batchEnd;
    }
    return output;
}
exports.makeBatches = makeBatches;
function sliceArrays(arrays, start, stop) {
    if (arrays == null) {
        return [null];
    }
    else if (Array.isArray(arrays)) {
        return arrays.map(function (array) { return K.sliceAlongFirstAxis(array, start, stop - start); });
    }
    else {
        return K.sliceAlongFirstAxis(arrays, start, stop - start);
    }
}
function sliceArraysByIndices(arrays, indices) {
    return tfc.tidy(function () {
        if (arrays == null) {
            return null;
        }
        else if (Array.isArray(arrays)) {
            return arrays.map(function (array) { return sliceArraysByIndices(array, indices); });
        }
        else {
            return K.gather(arrays, indices.dtype === 'int32' ? indices : indices.toInt());
        }
    });
}
exports.sliceArraysByIndices = sliceArraysByIndices;
function checkInputData(data, names, shapes, checkBatchAxis, exceptionPrefix) {
    if (checkBatchAxis === void 0) { checkBatchAxis = true; }
    if (exceptionPrefix === void 0) { exceptionPrefix = ''; }
    var arrays;
    if (Array.isArray(data)) {
        if (data.length !== names.length) {
            throw new errors_1.ValueError("Error when checking model " + exceptionPrefix + ": the Array of " +
                "Tensors that you are passing to your model is not the size the " +
                ("the model expected. Expected to see " + names.length + " Tensor(s),") +
                (" but instead got " + data.length + " Tensors(s)."));
        }
        arrays = data;
    }
    else {
        if (names.length > 1) {
            throw new errors_1.ValueError("The model expects " + names.length + " " + exceptionPrefix + " Tensors, " +
                "but only received one Tensor. Found: array with shape " +
                (JSON.stringify(data.shape) + "."));
        }
        arrays = [data];
    }
    if (shapes != null) {
        for (var i = 0; i < names.length; ++i) {
            if (shapes[i] == null) {
                continue;
            }
            var array = arrays[i];
            if (array.shape.length !== shapes[i].length) {
                throw new errors_1.ValueError("Error when checking " + exceptionPrefix + ": expected " + names[i] + " " +
                    ("to have " + shapes[i].length + " dimension(s), but got array with ") +
                    ("shape " + JSON.stringify(array.shape)));
            }
            for (var j = 0; j < shapes[i].length; ++j) {
                if (j === 0 && !checkBatchAxis) {
                    continue;
                }
                var dim = array.shape[j];
                var refDim = shapes[i][j];
                if (refDim != null) {
                    if (refDim !== dim) {
                        throw new errors_1.ValueError("Error when checking " + exceptionPrefix + ": expected " +
                            (names[i] + " to have shape " + JSON.stringify(shapes[i]) + " but ") +
                            ("got array with shape " + JSON.stringify(array.shape) + "."));
                    }
                }
            }
        }
    }
}
function collectMetrics(metrics, outputNames) {
    if (metrics == null || Array.isArray(metrics) && metrics.length === 0) {
        return outputNames.map(function (name) { return []; });
    }
    if (Array.isArray(metrics)) {
        return outputNames.map(function (name) { return metrics; });
    }
    else if (metrics != null) {
        var nestedMetrics = [];
        for (var _i = 0, outputNames_1 = outputNames; _i < outputNames_1.length; _i++) {
            var name_2 = outputNames_1[_i];
            var outputMetrics = metrics.hasOwnProperty(name_2) ? metrics[name_2] : [];
            if (!Array.isArray(outputMetrics)) {
                outputMetrics = [outputMetrics];
            }
            nestedMetrics.push(outputMetrics);
        }
        return nestedMetrics;
    }
    else {
        throw new TypeError('Type of metrics argument not understood. Expected an Array or ' +
            'Object, found: ' + metrics);
    }
}
var ModelLoggingVerbosity;
(function (ModelLoggingVerbosity) {
    ModelLoggingVerbosity[ModelLoggingVerbosity["SILENT"] = 0] = "SILENT";
    ModelLoggingVerbosity[ModelLoggingVerbosity["VERBOSE"] = 1] = "VERBOSE";
})(ModelLoggingVerbosity = exports.ModelLoggingVerbosity || (exports.ModelLoggingVerbosity = {}));
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(config) {
        return _super.call(this, config) || this;
    }
    Model.prototype.summary = function (lineLength, positions, printFn) {
        if (printFn === void 0) { printFn = console.log; }
        if (!this.built) {
            throw new errors_1.ValueError("This model has never been called, thus its weights have not been " +
                "created yet. So no summary can be displayed. Build the model " +
                "first (e.g., by calling it on some test data).");
        }
        layer_utils_1.printSummary(this, lineLength, positions, printFn);
    };
    Model.prototype.compile = function (config) {
        var _this = this;
        if (config.loss == null) {
            config.loss = [];
        }
        this.loss = config.loss;
        if (typeof config.optimizer === 'string') {
            this.optimizer = optimizers.getOptimizer(config.optimizer);
        }
        else {
            if (!(config.optimizer instanceof tfjs_core_1.Optimizer)) {
                throw new errors_1.ValueError("User-defined optimizer must be an instance of tf.Optimizer.");
            }
            this.optimizer = config.optimizer;
        }
        var lossFunctions = [];
        if (!Array.isArray(config.loss) && typeof config.loss !== 'string' &&
            typeof config.loss !== 'function') {
            config.loss = config.loss;
            for (var name_3 in config.loss) {
                if (this.outputNames.indexOf(name_3) === -1) {
                    throw new errors_1.ValueError("Unknown entry in loss dictionary: \"" + name_3 + "\". Only expect the " +
                        ("following keys: " + this.outputNames));
                }
            }
            for (var name_4 in this.outputNames) {
                if (config.loss[name_4] == null) {
                    console.warn("Output \"" + name_4 + "\" is missing from loss dictionary. We assume " +
                        "this was done on purpose, and we will not be expecting data " +
                        ("to be passed to " + name_4 + " during training"));
                }
                lossFunctions.push(losses.get(config.loss[name_4]));
            }
        }
        else if (Array.isArray(config.loss)) {
            if (config.loss.length !== this.outputs.length) {
                throw new errors_1.ValueError("When passing an Array as loss, it should have one entry per " +
                    ("model output. The model has " + this.outputs.length + " output(s), ") +
                    ("but you passed loss=" + config.loss + "."));
            }
            var theLosses = config.loss;
            lossFunctions = theLosses.map(function (l) { return losses.get(l); });
        }
        else {
            var lossFunction_1 = losses.get(config.loss);
            this.outputs.map(function (layer) {
                lossFunctions.push(lossFunction_1);
            });
        }
        this.lossFunctions = lossFunctions;
        this.feedOutputNames = [];
        this.feedOutputShapes = [];
        this.feedLossFns = [];
        for (var i = 0; i < this.outputs.length; ++i) {
            var shape = this.internalOutputShapes[i];
            var name_5 = this.outputNames[i];
            this.feedOutputNames.push(name_5);
            this.feedOutputShapes.push(shape);
            this.feedLossFns.push(this.lossFunctions[i]);
        }
        var skipTargetIndices = [];
        this.metrics = config.metrics;
        this.metricsNames = ['loss'];
        this.metricsTensors = [];
        K.nameScope('loss', function () {
            for (var i = 0; i < _this.outputs.length; ++i) {
                if (skipTargetIndices.indexOf(i) !== -1) {
                    continue;
                }
                var weightedLoss = _this.lossFunctions[i];
                if (_this.outputs.length > 1) {
                    _this.metricsTensors.push([weightedLoss, i]);
                    _this.metricsNames.push(_this.outputNames[i] + '_loss');
                }
            }
        });
        var nestedMetrics = collectMetrics(config.metrics, this.outputNames);
        var appendMetric = function (outputIndex, metricName, metricTensor) {
            if (_this.outputNames.length > 1) {
                metricName = _this.outputNames[outputIndex] + '_' + metricName;
            }
            _this.metricsNames.push(metricName);
            _this.metricsTensors.push([metricTensor, outputIndex]);
        };
        K.nameScope('metric', function () {
            var _loop_1 = function (i) {
                if (skipTargetIndices.indexOf(i) !== -1) {
                    return "continue";
                }
                var outputMetrics = nestedMetrics[i];
                var handleMetrics = function (metrics) {
                    var metricNamePrefix = '';
                    var metricName;
                    var accFn;
                    var weightedMetricFn;
                    var _loop_2 = function (metric) {
                        if (['accuracy', 'acc', 'crossentropy', 'ce'].indexOf(metric) !==
                            -1) {
                            var outputShape = _this.internalOutputShapes[i];
                            if (outputShape[outputShape.length - 1] === 1 ||
                                _this.lossFunctions[i] === losses.binaryCrossentropy) {
                                if (['accuracy', 'acc'].indexOf(metric) !== -1) {
                                    accFn = Metrics.binaryAccuracy;
                                }
                                else if (['crossentropy', 'ce'].indexOf(metric) !== -1) {
                                    accFn = Metrics.binaryCrossentropy;
                                }
                            }
                            else if (_this.lossFunctions[i] ===
                                losses.sparseCategoricalCrossentropy) {
                                if (['accuracy', 'acc'].indexOf(metric) !== -1) {
                                    accFn = Metrics.sparseCategoricalAccuracy;
                                }
                                else if (['crossentropy', 'ce'].indexOf(metric) !== -1) {
                                    accFn = Metrics.sparseCategoricalCrossentropy;
                                }
                            }
                            else {
                                if (['accuracy', 'acc'].indexOf(metric) !== -1) {
                                    accFn = Metrics.categoricalAccuracy;
                                }
                                else if (['crossentropy', 'ce'].indexOf(metric) !== -1) {
                                    accFn = Metrics.categoricalCrossentropy;
                                }
                            }
                            var suffix = void 0;
                            if (['accuracy', 'acc'].indexOf(metric) !== -1) {
                                suffix = 'acc';
                            }
                            else if (['crossentropy', 'ce'].indexOf(metric) !== -1) {
                                suffix = 'ce';
                            }
                            weightedMetricFn = accFn;
                            metricName = metricNamePrefix + suffix;
                        }
                        else {
                            var metricFn = Metrics.get(metric);
                            weightedMetricFn = metricFn;
                            metricName = metricNamePrefix + metric;
                        }
                        var metricResult;
                        K.nameScope(metricName, function () {
                            metricResult = weightedMetricFn;
                        });
                        appendMetric(i, metricName, metricResult);
                    };
                    for (var _i = 0, metrics_1 = metrics; _i < metrics_1.length; _i++) {
                        var metric = metrics_1[_i];
                        _loop_2(metric);
                    }
                };
                handleMetrics(outputMetrics);
            };
            for (var i = 0; i < _this.outputs.length; ++i) {
                _loop_1(i);
            }
        });
        this.collectedTrainableWeights = this.trainableWeights;
    };
    Model.prototype.checkTrainableWeightsConsistency = function () {
        if (this.collectedTrainableWeights == null) {
            return;
        }
        if (this.trainableWeights.length !==
            this.collectedTrainableWeights.length) {
            console.warn('Discrepancy between trainableweights and collected trainable ' +
                'weights. Did you set `model.trainable` without calling ' +
                '`model.compile()` afterwards?');
        }
    };
    Model.prototype.evaluate = function (x, y, config) {
        if (config === void 0) { config = {}; }
        var batchSize = config.batchSize == null ? 32 : config.batchSize;
        var standardizedOuts = this.standardizeUserData(x, y, true, batchSize);
        var ins = standardizedOuts[0].concat(standardizedOuts[1]);
        this.makeTestFunction();
        var f = this.testFunction;
        var testOuts = this.testLoop(f, ins, batchSize, config.verbose, config.steps);
        return generic_utils_1.singletonOrArray(testOuts);
    };
    Model.prototype.checkNumSamples = function (ins, batchSize, steps, stepsName) {
        if (stepsName === void 0) { stepsName = 'steps'; }
        var numSamples;
        if (steps != null) {
            numSamples = null;
            if (batchSize != null) {
                throw new errors_1.ValueError("If " + stepsName + " is set, batchSize must be null or undefined." +
                    ("Got batchSize = " + batchSize));
            }
        }
        else if (ins != null) {
            if (Array.isArray(ins)) {
                numSamples = ins[0].shape[0];
            }
            else {
                numSamples = ins.shape[0];
            }
        }
        else {
            throw new errors_1.ValueError("Either the input data should have a defined shape, or " +
                (stepsName + " shoud be specified."));
        }
        return numSamples;
    };
    Model.prototype.execute = function (inputs, outputs) {
        if (Array.isArray(outputs) && outputs.length === 0) {
            throw new errors_1.ValueError('`outputs` is an empty Array, which is not allowed.');
        }
        var outputsIsArray = Array.isArray(outputs);
        var outputNames = (outputsIsArray ? outputs :
            [outputs]);
        var outputSymbolicTensors = this.retrieveSymbolicTensors(outputNames);
        var feedDict = new executor_1.FeedDict();
        if (inputs instanceof tfjs_core_1.Tensor) {
            inputs = [inputs];
        }
        if (Array.isArray(inputs)) {
            if (inputs.length !== this.inputs.length) {
                throw new errors_1.ValueError("The number of inputs provided (" + inputs.length + ") " +
                    "does not match the number of inputs of this model " +
                    ("(" + this.inputs.length + ")."));
            }
            for (var i = 0; i < this.inputs.length; ++i) {
                feedDict.add(this.inputs[i], inputs[i]);
            }
        }
        else {
            for (var _i = 0, _a = this.inputs; _i < _a.length; _i++) {
                var input = _a[_i];
                var tensorValue = inputs[input.name];
                if (tensorValue == null) {
                    throw new errors_1.ValueError("No value is provided for the model's input " + input.name);
                }
                feedDict.add(input, tensorValue);
            }
        }
        var executeOutputs = executor_1.execute(outputSymbolicTensors, feedDict);
        return outputsIsArray ? executeOutputs : executeOutputs[0];
    };
    Model.prototype.retrieveSymbolicTensors = function (symbolicTensorNames) {
        var outputSymbolicTensors = generic_utils_1.pyListRepeat(null, symbolicTensorNames.length);
        var outputsRemaining = symbolicTensorNames.length;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            var layerOutputs = Array.isArray(layer.output) ?
                layer.output :
                [layer.output];
            var layerOutputNames = layerOutputs.map(function (output) { return output.name; });
            for (var i = 0; i < symbolicTensorNames.length; ++i) {
                var index = layerOutputNames.indexOf(symbolicTensorNames[i]);
                if (index !== -1) {
                    outputSymbolicTensors[i] = layerOutputs[index];
                    outputsRemaining--;
                }
                if (outputsRemaining === 0) {
                    break;
                }
            }
            if (outputsRemaining === 0) {
                break;
            }
        }
        if (outputsRemaining > 0) {
            var remainingNames_1 = [];
            outputSymbolicTensors.forEach(function (tensor, i) {
                if (tensor == null) {
                    remainingNames_1.push(symbolicTensorNames[i]);
                }
            });
            throw new errors_1.ValueError("Cannot find SymbolicTensors for output name(s): " +
                ("" + JSON.stringify(remainingNames_1)));
        }
        return outputSymbolicTensors;
    };
    Model.prototype.predictLoop = function (ins, batchSize, verbose) {
        var _this = this;
        if (batchSize === void 0) { batchSize = 32; }
        if (verbose === void 0) { verbose = false; }
        var numSamples = this.checkNumSamples(ins);
        if (verbose) {
            throw new errors_1.NotImplementedError('Verbose predictLoop() is not implemented yet.');
        }
        var batches = makeBatches(numSamples, batchSize);
        var outs = [];
        var _loop_3 = function (batchIndex) {
            var batchOuts = tfc.tidy(function () {
                var batchStart = batches[batchIndex][0];
                var batchEnd = batches[batchIndex][1];
                var insBatch = sliceArrays(ins, batchStart, batchEnd);
                var feeds = [];
                if (Array.isArray(insBatch)) {
                    for (var i = 0; i < insBatch.length; ++i) {
                        feeds.push({ key: _this.inputs[i], value: insBatch[i] });
                    }
                }
                else {
                    feeds.push({ key: _this.inputs[0], value: insBatch });
                }
                var feedDict = new executor_1.FeedDict(feeds);
                return executor_1.execute(_this.outputs, feedDict);
            });
            if (batchIndex === 0) {
                for (var _i = 0, batchOuts_1 = batchOuts; _i < batchOuts_1.length; _i++) {
                    var batchOut = batchOuts_1[_i];
                    outs.push(batchOut);
                }
            }
            else {
                for (var i = 0; i < batchOuts.length; ++i) {
                    outs[i] = K.concatAlongFirstAxis(outs[i], batchOuts[i]);
                }
            }
        };
        for (var batchIndex = 0; batchIndex < batches.length; ++batchIndex) {
            _loop_3(batchIndex);
        }
        return generic_utils_1.singletonOrArray(outs);
    };
    Model.prototype.predict = function (x, config) {
        if (config === void 0) { config = {}; }
        checkInputData(x, this.inputNames, this.feedInputShapes, false);
        var batchSize = config.batchSize == null ? 32 : config.batchSize;
        return this.predictLoop(x, batchSize);
    };
    Model.prototype.predictOnBatch = function (x) {
        checkInputData(x, this.inputNames, this.feedInputShapes, true);
        return this.predictLoop(x, x.shape[0]);
    };
    Model.prototype.standardizeUserData = function (x, y, checkBatchAxis, batchSize) {
        if (checkBatchAxis === void 0) { checkBatchAxis = true; }
        if (this.optimizer == null) {
            throw new errors_1.RuntimeError('You must compile a model before training/testing. Use ' +
                'Model.compile(modelCompileConfig).');
        }
        var outputShapes = [];
        for (var i = 0; i < this.feedOutputShapes.length; ++i) {
            var outputShape = this.feedOutputShapes[i];
            var lossFn = this.feedLossFns[i];
            if (lossFn === losses.sparseCategoricalCrossentropy) {
                outputShapes.push(outputShape.slice(0, outputShape.length - 1).concat([1]));
            }
            else {
                outputShapes.push(outputShape);
            }
        }
        x = standardizeInputData(x, this.feedInputNames, this.feedInputShapes, false, 'input');
        y = standardizeInputData(y, this.feedOutputNames, outputShapes, false, 'target');
        checkArrayLengths(x, y, null);
        checkLossAndTargetCompatibility(y, this.feedLossFns, this.feedOutputShapes);
        if (this.stateful && batchSize != null && batchSize > 0) {
            if (x[0].shape[0] % batchSize !== 0) {
                throw new errors_1.ValueError("In a stateful network, you should only pass inputs with a " +
                    "number of samples that is divisible by the batch size " +
                    (batchSize + ". Found: " + x[0].shape[0] + " sample(s)."));
            }
        }
        return [x, y, null];
    };
    Model.prototype.fitLoop = function (f, ins, outLabels, batchSize, epochs, verbose, callbacks, valF, valIns, shuffle, callbackMetrics, initialEpoch, stepsPerEpoch, validationSteps) {
        if (initialEpoch === void 0) { initialEpoch = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var doValidation, numTrainSamples, indexArray, callbackList, _loop_4, this_1, epoch, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (batchSize == null) {
                            batchSize = 32;
                        }
                        if (epochs == null) {
                            epochs = 1;
                        }
                        if (shuffle == null) {
                            shuffle = true;
                        }
                        if (initialEpoch == null) {
                            initialEpoch = 0;
                        }
                        doValidation = false;
                        if (valF != null && valIns != null) {
                            doValidation = true;
                        }
                        if (validationSteps != null) {
                            doValidation = true;
                            if (stepsPerEpoch == null) {
                                throw new errors_1.ValueError('Can only use `validationSteps` when doing step-wise training, ' +
                                    'i.e., `stepsPerEpoch` must be set.');
                            }
                        }
                        numTrainSamples = this.checkNumSamples(ins, batchSize, stepsPerEpoch, 'steps_per_epoch');
                        if (numTrainSamples != null) {
                            indexArray = math_utils_1.range(0, numTrainSamples);
                        }
                        this.history = new callbacks_1.History();
                        if (callbacks == null) {
                            callbacks = [new callbacks_1.BaseLogger()];
                        }
                        else {
                            callbacks = [new callbacks_1.BaseLogger()].concat(callbacks);
                        }
                        callbacks = callbacks.concat([this.history]);
                        if (verbose > 0) {
                            throw new errors_1.NotImplementedError('Verbose mode is not implemented yet.');
                        }
                        callbackList = new callbacks_1.CallbackList(callbacks);
                        callbackList.setModel(this);
                        callbackList.setParams({
                            epochs: epochs,
                            steps: stepsPerEpoch,
                            verbose: verbose,
                            doValidation: doValidation,
                            metrics: callbackMetrics,
                        });
                        return [4, callbackList.onTrainBegin()];
                    case 1:
                        _a.sent();
                        this.stopTraining = false;
                        _loop_4 = function (epoch) {
                            var epochLogs, epochIndexArray1D_1, batches_1, _loop_5, batchIndex, state_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, callbackList.onEpochBegin(epoch)];
                                    case 1:
                                        _a.sent();
                                        epochLogs = {};
                                        if (!(stepsPerEpoch != null)) return [3, 2];
                                        throw new errors_1.NotImplementedError('stepsPerEpoch mode is not implemented yet.');
                                    case 2:
                                        if (shuffle === 'batch') {
                                            throw new errors_1.NotImplementedError('batch shuffling is not implemneted yet');
                                        }
                                        else if (shuffle) {
                                            tfjs_core_1.util.shuffle(indexArray);
                                        }
                                        epochIndexArray1D_1 = tfjs_core_1.tensor1d(indexArray);
                                        batches_1 = makeBatches(numTrainSamples, batchSize);
                                        _loop_5 = function (batchIndex) {
                                            var batchLogs;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        batchLogs = {};
                                                        return [4, callbackList.onBatchBegin(batchIndex, batchLogs)];
                                                    case 1:
                                                        _a.sent();
                                                        tfc.tidy(function () {
                                                            var batchStart = batches_1[batchIndex][0];
                                                            var batchEnd = batches_1[batchIndex][1];
                                                            var batchIds = K.sliceAlongFirstAxis(epochIndexArray1D_1, batchStart, batchEnd - batchStart);
                                                            batchLogs['batch'] = batchIndex;
                                                            batchLogs['size'] = batchEnd - batchStart;
                                                            var insBatch = sliceArraysByIndices(ins, batchIds);
                                                            var outs = f(insBatch);
                                                            for (var i = 0; i < outLabels.length; ++i) {
                                                                var label = outLabels[i];
                                                                var out = outs[i];
                                                                batchLogs[label] = out;
                                                                tfc.keep(out);
                                                            }
                                                            if (batchIndex === batches_1.length - 1) {
                                                                if (doValidation) {
                                                                    var valOuts = _this.testLoop(valF, valIns, batchSize);
                                                                    for (var i = 0; i < outLabels.length; ++i) {
                                                                        var label = outLabels[i];
                                                                        var out = valOuts[i];
                                                                        tfc.keep(out);
                                                                        epochLogs['val_' + label] = out;
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        return [4, callbackList.onBatchEnd(batchIndex, batchLogs)];
                                                    case 2:
                                                        _a.sent();
                                                        callbacks_1.disposeTensorsInLogs(batchLogs);
                                                        if (this_1.stopTraining) {
                                                            return [2, "break"];
                                                        }
                                                        return [2];
                                                }
                                            });
                                        };
                                        batchIndex = 0;
                                        _a.label = 3;
                                    case 3:
                                        if (!(batchIndex < batches_1.length)) return [3, 6];
                                        return [5, _loop_5(batchIndex)];
                                    case 4:
                                        state_2 = _a.sent();
                                        if (state_2 === "break")
                                            return [3, 6];
                                        _a.label = 5;
                                    case 5:
                                        ++batchIndex;
                                        return [3, 3];
                                    case 6:
                                        epochIndexArray1D_1.dispose();
                                        _a.label = 7;
                                    case 7: return [4, callbackList.onEpochEnd(epoch, epochLogs)];
                                    case 8:
                                        _a.sent();
                                        if (this_1.stopTraining) {
                                            return [2, "break"];
                                        }
                                        return [2];
                                }
                            });
                        };
                        this_1 = this;
                        epoch = initialEpoch;
                        _a.label = 2;
                    case 2:
                        if (!(epoch < epochs)) return [3, 5];
                        return [5, _loop_4(epoch)];
                    case 3:
                        state_1 = _a.sent();
                        if (state_1 === "break")
                            return [3, 5];
                        _a.label = 4;
                    case 4:
                        ++epoch;
                        return [3, 2];
                    case 5: return [4, callbackList.onTrainEnd()];
                    case 6:
                        _a.sent();
                        return [4, this.history.syncData()];
                    case 7:
                        _a.sent();
                        return [2, this.history];
                }
            });
        });
    };
    Model.prototype.testLoop = function (f, ins, batchSize, verbose, steps) {
        if (verbose === void 0) { verbose = 0; }
        var numSamples = this.checkNumSamples(ins, batchSize, steps, 'steps');
        var outs = [];
        if (verbose === 1) {
            throw new errors_1.NotImplementedError('Verbose mode is not implemented yet.');
        }
        if (steps != null) {
            throw new errors_1.NotImplementedError('steps mode in testLoop() is not implemented yet');
        }
        else {
            var batches = makeBatches(numSamples, batchSize);
            var indexArray = tfjs_core_1.tensor1d(math_utils_1.range(0, numSamples));
            for (var batchIndex = 0; batchIndex < batches.length; ++batchIndex) {
                var batchStart = batches[batchIndex][0];
                var batchEnd = batches[batchIndex][1];
                var batchIds = K.sliceAlongFirstAxis(indexArray, batchStart, batchEnd - batchStart);
                var insBatch = sliceArraysByIndices(ins, batchIds);
                var batchOuts = f(insBatch);
                if (batchIndex === 0) {
                    for (var i = 0; i < batchOuts.length; ++i) {
                        outs.push(K.getScalar(0));
                    }
                }
                for (var i = 0; i < batchOuts.length; ++i) {
                    var batchOut = batchOuts[i];
                    outs[i] =
                        tfc.add(outs[i], K.scalarTimesArray(K.getScalar(batchEnd - batchStart), batchOut));
                }
            }
            for (var i = 0; i < outs.length; ++i) {
                outs[i] = tfc.div(outs[i], K.getScalar(numSamples));
            }
        }
        return outs;
    };
    Model.prototype.getDedupedMetricsNames = function () {
        var outLabels = this.metricsNames;
        var dedupedOutLabels = [];
        for (var i = 0; i < outLabels.length; ++i) {
            var label = outLabels[i];
            var newLabel = label;
            if (generic_utils_1.count(outLabels, label) > 1) {
                var dupIndex = generic_utils_1.count(outLabels.slice(0, i), label);
                newLabel += "_" + dupIndex;
            }
            dedupedOutLabels.push(newLabel);
        }
        return dedupedOutLabels;
    };
    Model.prototype.makeTestFunction = function () {
        var _this = this;
        this.testFunction = function (data) {
            return tfc.tidy(function () {
                var valOutputs = [];
                var totalLoss;
                var inputs = data.slice(0, _this.inputs.length);
                var targets = data.slice(_this.inputs.length, _this.inputs.length + _this.outputs.length);
                var feeds = [];
                for (var i = 0; i < _this.inputs.length; ++i) {
                    feeds.push({ key: _this.inputs[i], value: inputs[i] });
                }
                var feedDict = new executor_1.FeedDict(feeds);
                var outputs = executor_1.execute(_this.outputs, feedDict);
                for (var i = 0; i < _this.lossFunctions.length; ++i) {
                    var lossFunction = _this.lossFunctions[i];
                    var loss = tfc.mean(lossFunction(targets[i], outputs[i]));
                    if (i === 0) {
                        totalLoss = loss;
                    }
                    else {
                        totalLoss = tfc.add(totalLoss, loss);
                    }
                    valOutputs.push(totalLoss);
                }
                for (var i = 0; i < _this.metricsTensors.length; ++i) {
                    var metric = _this.metricsTensors[i][0];
                    var outputIndex = _this.metricsTensors[i][1];
                    var meanMetric = tfc.mean(metric(targets[outputIndex], outputs[outputIndex]));
                    valOutputs.push(meanMetric);
                }
                return valOutputs;
            });
        };
    };
    Model.prototype.fit = function (x, y, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var batchSize, standardizedOuts, inputs, targets, doValidation, valX, valY, valIns, needValidationDisposal, valStandardized, splitAt, originalBatchSize, ins, trainFunction, outLabels, valFunction, callbackMetrics, callbacks, out;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        batchSize = config.batchSize == null ? 32 : config.batchSize;
                        standardizedOuts = this.standardizeUserData(x, y, false, batchSize);
                        inputs = standardizedOuts[0];
                        targets = standardizedOuts[1];
                        doValidation = false;
                        needValidationDisposal = false;
                        if (config.validationData != null && config.validationData.length > 0) {
                            doValidation = true;
                            if (config.validationData.length === 2) {
                                valX = config.validationData[0];
                                valY = config.validationData[1];
                            }
                            else if (config.validationData.length === 3) {
                                throw new errors_1.NotImplementedError('validationData including sample weights is not supported yet.');
                            }
                            else {
                                throw new errors_1.ValueError("When passing validation data, it must contain 2 (valX, valY) " +
                                    "or 3 (valX, valY, valSampleWeight) items; " +
                                    (config.validationData + " is invalid."));
                            }
                            valStandardized = this.standardizeUserData(valX, valY, true, batchSize);
                            valX = valStandardized[0];
                            valY = valStandardized[1];
                            valIns = valX.concat(valY);
                        }
                        else if (config.validationSplit != null && config.validationSplit > 0 &&
                            config.validationSplit < 1) {
                            doValidation = true;
                            splitAt = Math.floor(inputs[0].shape[0] * (1 - config.validationSplit));
                            originalBatchSize = inputs[0].shape[0];
                            valX = sliceArrays(inputs, splitAt, originalBatchSize);
                            inputs = sliceArrays(inputs, 0, splitAt);
                            valY = sliceArrays(targets, splitAt, originalBatchSize);
                            targets = sliceArrays(targets, 0, splitAt);
                            needValidationDisposal = true;
                            valIns = valX.concat(valY);
                        }
                        else if (config.validationSteps != null) {
                            doValidation = true;
                        }
                        ins = inputs.concat(targets);
                        this.checkTrainableWeightsConsistency();
                        trainFunction = function (data) {
                            var losses = [];
                            var lossValues = [];
                            var inputs = data.slice(0, _this.inputs.length);
                            var targets = data.slice(_this.inputs.length, _this.inputs.length + _this.outputs.length);
                            var metricsValues = [];
                            var totalLossFunction = function () {
                                var feeds = [];
                                for (var i = 0; i < _this.inputs.length; ++i) {
                                    feeds.push({ key: _this.inputs[i], value: inputs[i] });
                                }
                                var feedDict = new executor_1.FeedDict(feeds);
                                var outputs = executor_1.execute(_this.outputs, feedDict, { 'training': true });
                                var totalLoss;
                                for (var i = 0; i < _this.lossFunctions.length; ++i) {
                                    var lossFunction = _this.lossFunctions[i];
                                    var loss = lossFunction(targets[i], outputs[i]);
                                    losses.push(loss);
                                    var meanLoss = tfc.mean(loss);
                                    lossValues.push(meanLoss);
                                    if (i === 0) {
                                        totalLoss = loss;
                                    }
                                    else {
                                        totalLoss = tfc.add(totalLoss, loss);
                                    }
                                }
                                for (var i = 0; i < _this.metricsTensors.length; ++i) {
                                    var metric = _this.metricsTensors[i][0];
                                    var outputIndex = _this.metricsTensors[i][1];
                                    var meanMetric = tfc.mean(metric(targets[outputIndex], outputs[outputIndex]));
                                    tfc.keep(meanMetric);
                                    metricsValues.push(meanMetric);
                                }
                                totalLoss = tfc.mean(totalLoss);
                                _this.calculateLosses().forEach(function (regularizerLoss) {
                                    totalLoss = tfc.add(totalLoss, regularizerLoss);
                                });
                                return totalLoss;
                            };
                            var variables = _this.collectedTrainableWeights.map(function (param) { return param.read(); });
                            var returnCost = true;
                            var totalLossValue = _this.optimizer.minimize(totalLossFunction, returnCost, variables);
                            return [totalLossValue].concat(metricsValues);
                        };
                        outLabels = this.getDedupedMetricsNames();
                        if (doValidation) {
                            this.makeTestFunction();
                            valFunction = this.testFunction;
                            callbackMetrics =
                                outLabels.slice().concat(outLabels.map(function (n) { return 'val_' + n; }));
                        }
                        else {
                            valFunction = null;
                            valIns = [];
                            callbackMetrics = outLabels.slice();
                        }
                        callbacks = callbacks_1.standardizeCallbacks(config.callbacks);
                        return [4, this.fitLoop(trainFunction, ins, outLabels, batchSize, config.epochs, config.verbose, callbacks, valFunction, valIns, config.shuffle, callbackMetrics, null, null, null)];
                    case 1:
                        out = _a.sent();
                        if (needValidationDisposal) {
                            valIns.forEach(function (tensor) { return tensor.dispose(); });
                            inputs.forEach(function (tensor) { return tensor.dispose(); });
                            targets.forEach(function (tensor) { return tensor.dispose(); });
                        }
                        return [2, out];
                }
            });
        });
    };
    Model.prototype.getNamedWeights = function (config) {
        var namedWeights = {};
        var trainableOnly = config != null && config.trainableOnly;
        var weights = trainableOnly ? this.trainableWeights : this.weights;
        var weightValues = this.getWeights(trainableOnly);
        for (var i = 0; i < weights.length; ++i) {
            if (trainableOnly && !weights[i].trainable) {
                continue;
            }
            namedWeights[weights[i].originalName] = weightValues[i];
        }
        return namedWeights;
    };
    Model.prototype.save = function (handlerOrURL, config) {
        return __awaiter(this, void 0, void 0, function () {
            var handlers, weightDataAndSpecs, returnString, unusedArg, modelConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof handlerOrURL === 'string') {
                            handlers = tfjs_core_1.io.getSaveHandlers(handlerOrURL);
                            if (handlers.length === 0) {
                                throw new errors_1.ValueError("Cannot find any save handlers for URL '" + handlerOrURL + "'");
                            }
                            else if (handlers.length > 1) {
                                throw new errors_1.ValueError("Found more than one (" + handlers.length + ") save handlers for " +
                                    ("URL '" + handlerOrURL + "'"));
                            }
                            handlerOrURL = handlers[0];
                        }
                        if (handlerOrURL.save == null) {
                            throw new errors_1.ValueError('Model.save() cannot proceed because the IOHandler provided does ' +
                                'not have the `save` attribute defined.');
                        }
                        return [4, tfjs_core_1.io.encodeWeights(this.getNamedWeights(config))];
                    case 1:
                        weightDataAndSpecs = _a.sent();
                        returnString = false;
                        unusedArg = null;
                        modelConfig = this.toJSON(unusedArg, returnString);
                        return [2, handlerOrURL.save({
                                modelTopology: modelConfig,
                                weightData: weightDataAndSpecs.data,
                                weightSpecs: weightDataAndSpecs.specs
                            })];
                }
            });
        });
    };
    Model.className = 'Model';
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes' })
    ], Model.prototype, "summary", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [0] })
    ], Model.prototype, "compile", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [2] })
    ], Model.prototype, "evaluate", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [1] })
    ], Model.prototype, "predict", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes' })
    ], Model.prototype, "predictOnBatch", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [2] })
    ], Model.prototype, "fit", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [1] })
    ], Model.prototype, "save", null);
    Model = __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes' })
    ], Model);
    return Model;
}(topology_1.Container));
exports.Model = Model;
tfjs_core_1.serialization.SerializationMap.register(Model);
//# sourceMappingURL=training.js.map