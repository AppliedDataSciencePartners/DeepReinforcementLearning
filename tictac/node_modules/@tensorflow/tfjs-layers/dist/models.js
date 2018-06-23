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
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("./backend/tfjs_backend");
var topology_1 = require("./engine/topology");
var training_1 = require("./engine/training");
var errors_1 = require("./errors");
var serialization_1 = require("./layers/serialization");
var generic_utils = require("./utils/generic_utils");
var serialization_utils_1 = require("./utils/serialization_utils");
function modelFromJSON(modelAndWeightsConfig, customObjects) {
    return __awaiter(this, void 0, void 0, function () {
        var modelTopology, tsConfig, model, weightValues, uniqueWeightValues, _i, _a, weight, skipMismatches, isNamedTensorMap;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    modelTopology = modelAndWeightsConfig.modelTopology;
                    if (modelTopology['model_config'] != null) {
                        modelTopology = modelTopology['model_config'];
                    }
                    tsConfig = serialization_utils_1.convertPythonicToTs(modelTopology);
                    model = serialization_1.deserialize(tsConfig, customObjects);
                    if (!(modelAndWeightsConfig.weightsManifest != null)) return [3, 2];
                    return [4, tfjs_core_1.io.loadWeights(modelAndWeightsConfig.weightsManifest, modelAndWeightsConfig.pathPrefix, model.weights.map(function (weight) { return weight.originalName; }))];
                case 1:
                    weightValues = _b.sent();
                    uniqueWeightValues = {};
                    for (_i = 0, _a = model.weights; _i < _a.length; _i++) {
                        weight = _a[_i];
                        uniqueWeightValues[weight.originalName] =
                            weightValues[weight.originalName];
                    }
                    skipMismatches = null;
                    isNamedTensorMap = true;
                    model.loadWeights(uniqueWeightValues, skipMismatches, isNamedTensorMap);
                    _b.label = 2;
                case 2: return [2, model];
            }
        });
    });
}
exports.modelFromJSON = modelFromJSON;
function loadModelInternal(pathOrIOHandler) {
    return __awaiter(this, void 0, void 0, function () {
        var handlers;
        return __generator(this, function (_a) {
            if (typeof pathOrIOHandler === 'string') {
                handlers = tfjs_core_1.io.getLoadHandlers(pathOrIOHandler);
                if (handlers.length === 0) {
                    handlers.push(tfjs_core_1.io.browserHTTPRequest(pathOrIOHandler));
                }
                else if (handlers.length > 1) {
                    throw new errors_1.ValueError("Found more than one (" + handlers.length + ") load handlers for " +
                        ("URL '" + pathOrIOHandler + "'"));
                }
                pathOrIOHandler = handlers[0];
            }
            return [2, loadModelFromIOHandler(pathOrIOHandler)];
        });
    });
}
exports.loadModelInternal = loadModelInternal;
function loadModelFromIOHandler(handler, customObjects) {
    return __awaiter(this, void 0, void 0, function () {
        var artifacts, modelTopology, model, skipMismatch, isNamedTensorMap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (handler.load == null) {
                        throw new errors_1.ValueError('Cannot proceed with model loading because the IOHandler provided ' +
                            'does not have the `load` method implemented.');
                    }
                    return [4, handler.load()];
                case 1:
                    artifacts = _a.sent();
                    modelTopology = artifacts.modelTopology;
                    if (modelTopology['model_config'] != null) {
                        modelTopology = modelTopology['model_config'];
                    }
                    model = serialization_1.deserialize(serialization_utils_1.convertPythonicToTs(modelTopology), customObjects);
                    if (artifacts.weightData != null) {
                        if (artifacts.weightSpecs == null) {
                            throw new errors_1.ValueError('Model artifacts contains weight data, but not weight specs. ' +
                                'Therefore loading of weights cannot proceed.');
                        }
                        skipMismatch = false;
                        isNamedTensorMap = true;
                        model.loadWeights(tfjs_core_1.io.decodeWeights(artifacts.weightData, artifacts.weightSpecs), skipMismatch, isNamedTensorMap);
                    }
                    return [2, model];
            }
        });
    });
}
exports.loadModelFromIOHandler = loadModelFromIOHandler;
var Sequential = (function (_super) {
    __extends(Sequential, _super);
    function Sequential(config) {
        var _this = _super.call(this, { inputs: [], outputs: [] }) || this;
        config = config || {};
        _this.trainable = true;
        _this._updatable = true;
        _this.built = false;
        _this.name = (config.name != null) ? config.name : K.getUid('sequential_');
        if (config.layers != null) {
            for (var _i = 0, _a = config.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                _this.add(layer);
            }
        }
        return _this;
    }
    Sequential_1 = Sequential;
    Sequential.prototype.add = function (layer) {
        var isLayerModelInstance = layer instanceof Sequential_1 || layer instanceof training_1.Model;
        var modelLayer;
        if (isLayerModelInstance) {
            modelLayer = layer;
            if (modelLayer.outputs.length !== 1) {
                throw new errors_1.ValueError('All layers in a Sequential model ' +
                    'should have a single output tensor. ' +
                    'For multi-output layers, ' +
                    'use the functional API.');
            }
            if (modelLayer.inputs.length !== 1) {
                throw new errors_1.ValueError('All layers in a Sequential model ' +
                    'should have a single input tensor. ' +
                    'For multi-input layers, ' +
                    'use the functional API.');
            }
        }
        if (this.outputs.length === 0) {
            if (layer.inboundNodes.length === 0) {
                if (layer.batchInputShape == null) {
                    throw new errors_1.ValueError('The first layer in a Sequential model must ' +
                        'get an `inputShape` or `batchInputShape` argument.');
                }
                var x = topology_1.Input({
                    batchShape: layer.batchInputShape,
                    dtype: layer.dtype,
                    name: layer.name + '_input'
                });
                layer.apply(x);
            }
            if (isLayerModelInstance) {
                this.outputs = modelLayer.outputs;
                this.inputs = modelLayer.inputs;
            }
            else {
                if (layer.inboundNodes.length !== 1) {
                    throw new errors_1.ValueError('A layer added to a Sequential model must not already be ' +
                        ("connected somewhere else. Model received layer " + layer.name + " ") +
                        ("which has " + layer.inboundNodes.length + " pre-existing inbound ") +
                        'connections.');
                }
                if (layer.inboundNodes[0].outputTensors.length !== 1) {
                    throw new errors_1.ValueError('All layers in a Sequential model ' +
                        'should have a single output tensor. ' +
                        'For multi-output layers, ' +
                        'use the functional API.');
                }
                this.outputs = [layer.inboundNodes[0].outputTensors[0]];
                this.inputs = topology_1.getSourceInputs(this.outputs[0]);
            }
            this.inboundNodes = [];
            new topology_1.Node({
                outboundLayer: this,
                inboundLayers: [],
                nodeIndices: [],
                tensorIndices: [],
                inputTensors: this.inputs,
                outputTensors: this.outputs,
                inputMasks: generic_utils.pyListRepeat(null, this.inputs.length),
                outputMasks: [null],
                inputShapes: this.inputs.map(function (x) { return x.shape; }),
                outputShapes: this.outputs[0].shape
            });
        }
        else {
            var outputTensor = layer.apply(this.outputs[0]);
            if (Array.isArray(outputTensor)) {
                throw new TypeError('All layers in a Sequential model ' +
                    'should have a single output tensor. ' +
                    'For multi-output layers, ' +
                    'use the functional API.');
            }
            this.outputs = [outputTensor];
            this.inboundNodes[0].outputTensors = this.outputs;
            this.inboundNodes[0].outputShapes = [this.outputs[0].shape];
        }
        this.layers.push(layer);
        this.built = false;
    };
    Sequential.prototype.pop = function () {
        if (this.layers.length === 0) {
            throw new TypeError('There are no layers in the model.');
        }
        this.layers.pop();
        if (this.layers.length === 0) {
            this.outputs = [];
            this.inboundNodes = [];
            this.outboundNodes = [];
        }
        else {
            var lastLayerIndex = this.layers.length - 1;
            this.layers[lastLayerIndex].outboundNodes = [];
            this.outputs = [this.layers[lastLayerIndex].output];
            this.inboundNodes[0].outputTensors = this.outputs;
            this.inboundNodes[0].outputShapes = [this.outputs[0].shape];
        }
    };
    Sequential.prototype.call = function (inputs, kwargs) {
        if (this.model == null) {
            this.build();
        }
        return this.model.call(inputs, kwargs);
    };
    Sequential.prototype.build = function (inputShape) {
        generic_utils.getExactlyOneShape(inputShape);
        if (this.inputs.length === 0 || this.outputs.length === 0) {
            throw new TypeError('Sequential model cannot be built: model is empty.' +
                ' Add some layers first.');
        }
        this.model = new training_1.Model({
            inputs: this.inputs,
            outputs: this.outputs[0],
            name: this.name + '_model'
        });
        this.model.trainable = this.trainable;
        this.model.updatable = this.updatable;
        this.supportsMasking = this.model.supportsMasking;
        this.inputLayers = this.model.inputLayers;
        this.inputLayersNodeIndices = this.model.inputLayersNodeIndices;
        this.inputLayersTensorIndices = this.model.inputLayersTensorIndices;
        this.outputLayers = this.model.outputLayers;
        this.outputLayersNodeIndices = this.model.outputLayersNodeIndices;
        this.outputLayersTensorIndices = this.model.outputLayersTensorIndices;
        this.nodesByDepth = this.model.nodesByDepth;
        this.containerNodes = this.model.containerNodes;
        this.outputNames = this.model.outputNames;
        this.inputNames = this.model.inputNames;
        this.built = true;
    };
    Sequential.prototype.countParams = function () {
        if (!this.built) {
            this.build();
        }
        return _super.prototype.countParams.call(this);
    };
    Sequential.prototype.summary = function (lineLength, positions, printFn) {
        if (printFn === void 0) { printFn = console.log; }
        if (!this.built) {
            this.build();
        }
        _super.prototype.summary.call(this, lineLength, positions, printFn);
    };
    Sequential.prototype.setWeights = function (weights) {
        if (this.model == null) {
            this.build();
        }
        this.model.setWeights(weights);
    };
    Object.defineProperty(Sequential.prototype, "updatable", {
        get: function () {
            return this._updatable;
        },
        set: function (value) {
            if (this.built) {
                this.model.updatable = value;
            }
            this._updatable = value;
        },
        enumerable: true,
        configurable: true
    });
    Sequential.prototype.evaluate = function (x, y, config) {
        if (config === void 0) { config = {}; }
        if (!this.built) {
            throw new errors_1.RuntimeError('The model needs to be compiled before being used.');
        }
        return this.model.evaluate(x, y, config);
    };
    Sequential.prototype.predict = function (x, config) {
        if (config === void 0) { config = {}; }
        if (this.model == null) {
            this.build();
        }
        return this.model.predict(x, config);
    };
    Sequential.prototype.predictOnBatch = function (x) {
        if (this.model == null) {
            this.build();
        }
        return this.model.predictOnBatch(x);
    };
    Sequential.prototype.compile = function (config) {
        this.build();
        this.model.compile(config);
        this.optimizer = this.model.optimizer;
        this.loss = this.model.loss;
        this.metrics = this.model.metrics;
        this.metricsTensors = this.model.metricsTensors;
        this.metricsNames = this.model.metricsNames;
    };
    Sequential.prototype.fit = function (x, y, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.built) {
                    throw new errors_1.RuntimeError('The model needs to be compiled before ' +
                        'being used.');
                }
                return [2, this.model.fit(x, y, config)];
            });
        });
    };
    Sequential.fromConfig = function (cls, config) {
        var model = new cls({});
        if (!(model instanceof Sequential_1)) {
            throw new errors_1.ValueError("Sequential.fromConfig called on non-Sequential input: " + model);
        }
        if (!(config instanceof Array)) {
            throw new errors_1.ValueError("Sequential.fromConfig called without an array of configs");
        }
        if (!(config[0].className != null) || config[0]['className'] === 'Merge') {
            throw new errors_1.ValueError('Legacy serialization format not supported yet.');
        }
        for (var _i = 0, _a = config; _i < _a.length; _i++) {
            var conf = _a[_i];
            var layer = serialization_1.deserialize(conf);
            model.add(layer);
        }
        return model;
    };
    Sequential.prototype.getConfig = function () {
        var config = [];
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            config.push({
                className: layer.getClassName(),
                config: layer.getConfig(),
            });
        }
        return config;
    };
    Sequential.className = 'Sequential';
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes' })
    ], Sequential.prototype, "add", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes' })
    ], Sequential.prototype, "summary", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [2] })
    ], Sequential.prototype, "evaluate", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [1] })
    ], Sequential.prototype, "predict", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes', configParamIndices: [2] })
    ], Sequential.prototype, "fit", null);
    Sequential = Sequential_1 = __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Classes' })
    ], Sequential);
    return Sequential;
    var Sequential_1;
}(training_1.Model));
exports.Sequential = Sequential;
tfjs_core_1.serialization.SerializationMap.register(Sequential);
//# sourceMappingURL=models.js.map