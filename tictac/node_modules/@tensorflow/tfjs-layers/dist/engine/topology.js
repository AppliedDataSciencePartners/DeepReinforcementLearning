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
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("../backend/tfjs_backend");
var errors_1 = require("../errors");
var serialization_1 = require("../layers/serialization");
var types_1 = require("../types");
var generic_utils = require("../utils/generic_utils");
var serialization_utils_1 = require("../utils/serialization_utils");
var variables_1 = require("../variables");
var version_1 = require("../version");
var InputSpec = (function () {
    function InputSpec(config) {
        this.dtype = config.dtype;
        this.shape = config.shape;
        if (config.shape != null) {
            this.ndim = config.shape.length;
        }
        else {
            this.ndim = config.ndim;
        }
        this.maxNDim = config.maxNDim;
        this.minNDim = config.minNDim;
        this.axes = config.axes || {};
    }
    return InputSpec;
}());
exports.InputSpec = InputSpec;
var _nextNodeID = 0;
var Node = (function () {
    function Node(config, callArgs) {
        this.callArgs = callArgs;
        this.id = _nextNodeID++;
        this.outboundLayer = config.outboundLayer;
        this.inboundLayers = config.inboundLayers;
        this.nodeIndices = config.nodeIndices;
        this.tensorIndices = config.tensorIndices;
        this.inputTensors = config.inputTensors;
        this.outputTensors = config.outputTensors;
        this.inputMasks = config.inputMasks;
        this.outputMasks = config.outputMasks;
        this.inputShapes = config.inputShapes;
        this.outputShapes = config.outputShapes;
        for (var _i = 0, _a = config.inboundLayers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (layer != null) {
                layer.outboundNodes.push(this);
            }
        }
        config.outboundLayer.inboundNodes.push(this);
    }
    Node.prototype.getConfig = function () {
        var inboundNames = [];
        for (var _i = 0, _a = this.inboundLayers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (layer != null) {
                inboundNames.push(layer.name);
            }
            else {
                inboundNames.push(null);
            }
        }
        return {
            outboundLayer: this.outboundLayer ? this.outboundLayer.name : null,
            inboundLayers: inboundNames,
            nodeIndices: this.nodeIndices,
            tensorIndices: this.tensorIndices
        };
    };
    return Node;
}());
exports.Node = Node;
var _nextLayerID = 0;
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer(config) {
        var _this = _super.call(this) || this;
        _this._callHook = null;
        _this._addedWeightNames = [];
        _this._stateful = false;
        _this.id = _nextLayerID++;
        _this.activityRegularizer = null;
        _this.inputSpec = null;
        _this.supportsMasking = false;
        _this._trainableWeights = [];
        _this._nonTrainableWeights = [];
        _this._losses = [];
        _this._updates = [];
        _this._built = false;
        _this.inboundNodes = [];
        _this.outboundNodes = [];
        var name = config.name;
        if (!name) {
            var prefix = _this.getClassName();
            name = generic_utils.toSnakeCase(prefix) + '_' + K.getUid(prefix);
        }
        _this.name = name;
        _this.trainable = config.trainable == null ? true : config.trainable;
        _this.updatable = config.updatable == null ? true : config.updatable;
        if (config.inputShape != null || config.batchInputShape != null) {
            var batchInputShape = void 0;
            if (config.batchInputShape != null) {
                batchInputShape = config.batchInputShape;
            }
            else if (config.inputShape != null) {
                var batchSize = null;
                if (config.batchSize != null) {
                    batchSize = config.batchSize;
                }
                batchInputShape = [batchSize].concat(config.inputShape);
            }
            _this.batchInputShape = batchInputShape;
            var dtype = config.dtype;
            if (dtype == null) {
                dtype = config.inputDType;
            }
            if (dtype == null) {
                dtype = K.floatx();
            }
            _this.dtype = dtype;
        }
        if (config.weights != null) {
            _this.initialWeights = config.weights;
        }
        else {
            _this.initialWeights = null;
        }
        return _this;
    }
    Layer.nodeKey = function (layer, nodeIndex) {
        return layer.name + '_ib-' + nodeIndex.toString();
    };
    Layer.prototype.getNodeAtIndex = function (nodeIndex, attrName) {
        if (this.inboundNodes.length === 0) {
            throw new errors_1.RuntimeError('The layer has never been called ' +
                ("and thus has no defined " + attrName + "."));
        }
        if (this.inboundNodes.length <= nodeIndex) {
            throw new errors_1.ValueError("Asked to get " + attrName + " at node " + nodeIndex + ", " +
                ("but the layer has only " + this.inboundNodes.length + " inbound nodes."));
        }
        return this.inboundNodes[nodeIndex];
    };
    Layer.prototype.getInputAt = function (nodeIndex) {
        return generic_utils.singletonOrArray(this.getNodeAtIndex(nodeIndex, 'input').inputTensors);
    };
    Layer.prototype.getOutputAt = function (nodeIndex) {
        return generic_utils.singletonOrArray(this.getNodeAtIndex(nodeIndex, 'output').outputTensors);
    };
    Object.defineProperty(Layer.prototype, "input", {
        get: function () {
            if (this.inboundNodes.length > 1) {
                throw new errors_1.AttributeError("Layer " + this.name +
                    ' has multiple inbound nodes, ' +
                    'hence the notion of "layer input" ' +
                    'is ill-defined. ' +
                    'Use `getInputAt(nodeIndex)` instead.');
            }
            else if (this.inboundNodes.length === 0) {
                throw new errors_1.AttributeError("Layer " + this.name +
                    ' is not connected, no input to return.');
            }
            return generic_utils.singletonOrArray(this.getNodeAtIndex(0, 'input').inputTensors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "output", {
        get: function () {
            if (this.inboundNodes.length === 0) {
                throw new errors_1.AttributeError("Layer " + this.name +
                    ' has no inbound nodes.');
            }
            if (this.inboundNodes.length > 1) {
                throw new errors_1.AttributeError("Layer " + this.name +
                    ' has multiple inbound nodes, ' +
                    'hence the notion of "layer output" ' +
                    'is ill-defined. ' +
                    'Use `getOutputAt(nodeIndex)` instead.');
            }
            return generic_utils.singletonOrArray(this.getNodeAtIndex(0, 'output').outputTensors);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "losses", {
        get: function () {
            return this._losses;
        },
        enumerable: true,
        configurable: true
    });
    Layer.prototype.calculateLosses = function () {
        return this.losses.map(function (lossFn) { return lossFn(); });
    };
    Object.defineProperty(Layer.prototype, "updates", {
        get: function () {
            return this._updates;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "built", {
        get: function () {
            return this._built;
        },
        set: function (built) {
            this._built = built;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "trainableWeights", {
        get: function () {
            if (this.trainable) {
                return this._trainableWeights;
            }
            else {
                return [];
            }
        },
        set: function (weights) {
            this._trainableWeights = weights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "nonTrainableWeights", {
        get: function () {
            if (!this.trainable) {
                return this._trainableWeights.concat(this._nonTrainableWeights);
            }
            else {
                return this._nonTrainableWeights;
            }
        },
        set: function (weights) {
            this._nonTrainableWeights = weights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "weights", {
        get: function () {
            return this.trainableWeights.concat(this.nonTrainableWeights);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "stateful", {
        get: function () {
            return this._stateful;
        },
        enumerable: true,
        configurable: true
    });
    Layer.prototype.assertInputCompatibility = function (inputs) {
        inputs = generic_utils.toList(inputs);
        if (this.inputSpec == null || this.inputSpec.length === 0) {
            return;
        }
        var inputSpec = generic_utils.toList(this.inputSpec);
        if (inputs.length !== inputSpec.length) {
            throw new errors_1.ValueError("Layer " + this.name + " expects " + inputSpec.length + " inputs, " +
                ("but it received " + inputs.length + " input tensors. ") +
                ("Input received: " + inputs));
        }
        for (var inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            var x = inputs[inputIndex];
            var spec = inputSpec[inputIndex];
            if (spec == null) {
                continue;
            }
            var ndim = x.rank;
            if (spec.ndim != null) {
                if (ndim !== spec.ndim) {
                    throw new errors_1.ValueError("Input " + inputIndex + " is incompatible with layer " + this.name + ": " +
                        ("expected ndim=" + spec.ndim + ", found ndim=" + ndim));
                }
            }
            if (spec.maxNDim != null) {
                if (ndim > spec.maxNDim) {
                    throw new errors_1.ValueError("Input " + inputIndex + " is incompatible with layer " + this.name +
                        (": expected max_ndim=" + spec.maxNDim + ", found ndim=" + ndim));
                }
            }
            if (spec.minNDim != null) {
                if (ndim < spec.minNDim) {
                    throw new errors_1.ValueError("Input " + inputIndex + " is incompatible with layer " + this.name +
                        (": expected min_ndim=" + spec.minNDim + ", found ndim=" + ndim + "."));
                }
            }
            if (spec.dtype != null) {
                if (K.dtype(x) !== spec.dtype) {
                    var xDType = K.dtype(x);
                    throw new errors_1.ValueError("Input " + inputIndex + " is incompatible with layer " + this.name + " " +
                        (": expected dtype=" + spec.dtype + ", found dtype=" + xDType + "."));
                }
            }
            if (spec.axes) {
                var xShape = K.intShape(x);
                for (var key in spec.axes) {
                    var axis = Number(key);
                    var value = spec.axes[key];
                    var xShapeAtAxis = axis >= 0 ? xShape[axis] : xShape[xShape.length + axis];
                    if (value != null && [value, null].indexOf(xShapeAtAxis) === -1) {
                        throw new errors_1.ValueError("Input " + inputIndex + " is incompatible with layer " +
                            (this.name + ": expected axis " + axis + " of input shape to ") +
                            ("have value " + value + " but got shape " + xShape + "."));
                    }
                }
            }
            if (spec.shape != null) {
                var xShape = K.intShape(x);
                for (var i = 0; i < spec.shape.length; ++i) {
                    var specDim = spec.shape[i];
                    var dim = xShape[i];
                    if (specDim != null && dim != null) {
                        if (specDim !== dim) {
                            throw new errors_1.ValueError("Input " + inputIndex + " is incompatible with layer " +
                                (this.name + ": expected shape=" + spec.shape + ", ") +
                                'found shape=${xShape}.');
                        }
                    }
                }
            }
        }
    };
    Layer.prototype.call = function (inputs, kwargs) {
        return inputs;
    };
    Layer.prototype.invokeCallHook = function (inputs, kwargs) {
        if (this._callHook != null) {
            this._callHook(inputs, kwargs);
        }
    };
    Layer.prototype.setCallHook = function (callHook) {
        this._callHook = callHook;
    };
    Layer.prototype.clearCallHook = function () {
        this._callHook = null;
    };
    Layer.prototype.apply = function (inputs, kwargs) {
        var _this = this;
        kwargs = kwargs || {};
        var inputsList = generic_utils.toList(inputs);
        var allAreSymbolic = true;
        for (var _i = 0, inputsList_1 = inputsList; _i < inputsList_1.length; _i++) {
            var input = inputsList_1[_i];
            if (!(input instanceof types_1.SymbolicTensor)) {
                allAreSymbolic = false;
                break;
            }
        }
        var noneAreSymbolic = true;
        for (var _a = 0, inputsList_2 = inputsList; _a < inputsList_2.length; _a++) {
            var input = inputsList_2[_a];
            if (input instanceof types_1.SymbolicTensor) {
                noneAreSymbolic = false;
                break;
            }
        }
        if (allAreSymbolic === noneAreSymbolic) {
            throw new errors_1.ValueError('Arguments to apply() must be all ' +
                'SymbolicTensors or all Tensors');
        }
        return K.nameScope(this.name, function () {
            if (!_this.built) {
                _this.assertInputCompatibility(inputs);
                var inputShapes = [];
                for (var _i = 0, _a = generic_utils.toList(inputs); _i < _a.length; _i++) {
                    var xElem = _a[_i];
                    inputShapes.push(K.intShape(xElem));
                }
                _this.build(generic_utils.singletonOrArray(inputShapes));
                _this.built = true;
                if (_this.initialWeights) {
                    _this.setWeights(_this.initialWeights);
                }
            }
            _this.assertInputCompatibility(inputs);
            if (noneAreSymbolic) {
                var output = _this.call(inputs, kwargs);
                var outputList = generic_utils.toList(output);
                var outputListCopy = [];
                for (var _b = 0, outputList_1 = outputList; _b < outputList_1.length; _b++) {
                    var x = outputList_1[_b];
                    if (inputsList.indexOf(x) !== -1) {
                        x = K.identity(x);
                    }
                    outputListCopy.push(x);
                }
                output = generic_utils.singletonOrArray(outputListCopy);
                if (_this.activityRegularizer != null) {
                    throw new errors_1.NotImplementedError('Layer invocation in the presence of activity ' +
                        'regularizer(s) is not supported yet.');
                }
                return output;
            }
            else {
                var inputShape = collectInputShape(inputs);
                var outputShape = _this.computeOutputShape(inputShape);
                var output = void 0;
                var outputDType_1 = guessOutputDType(inputs);
                if (outputShape != null && outputShape.length > 0 &&
                    Array.isArray(outputShape[0])) {
                    output = outputShape
                        .map(function (shape, index) { return new types_1.SymbolicTensor(outputDType_1, shape, _this, generic_utils.toList(inputs), kwargs, _this.name, index); });
                }
                else {
                    output = new types_1.SymbolicTensor(outputDType_1, outputShape, _this, generic_utils.toList(inputs), kwargs, _this.name);
                }
                _this.addInboundNode(inputs, output, null, null, inputShape, outputShape, kwargs);
                if (_this.activityRegularizer != null) {
                    throw new errors_1.NotImplementedError('Layer invocation in the presence of activity ' +
                        'regularizer(s) is not supported yet.');
                }
                return output;
            }
        });
    };
    Object.defineProperty(Layer.prototype, "outputShape", {
        get: function () {
            if (this.inboundNodes == null || this.inboundNodes.length === 0) {
                throw new errors_1.AttributeError("The layer " + this.name + " has never been called and thus has no " +
                    "defined output shape.");
            }
            var allOutputShapes = [];
            for (var _i = 0, _a = this.inboundNodes; _i < _a.length; _i++) {
                var node = _a[_i];
                var shapeString = JSON.stringify(node.outputShapes);
                if (allOutputShapes.indexOf(shapeString) === -1) {
                    allOutputShapes.push(shapeString);
                }
            }
            if (allOutputShapes.length === 1) {
                var outputShapes = this.inboundNodes[0].outputShapes;
                if (Array.isArray(outputShapes) && Array.isArray(outputShapes[0]) &&
                    outputShapes.length === 1) {
                    return outputShapes[0];
                }
                else {
                    return outputShapes;
                }
            }
            else {
                throw new errors_1.AttributeError("The layer " + this.name + " has multiple inbound nodes with different " +
                    "output shapes. Hence the notion of \"outut shape\" is ill-defined " +
                    "for the layer.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Layer.prototype.countParams = function () {
        if (!this.built) {
            throw new errors_1.RuntimeError("You tried to call countParams() on " + this.name + ", " +
                "but the layer is not built yet. Build it first by calling " +
                "build(batchInputShape).");
        }
        return generic_utils.countParamsInWeights(this.weights);
    };
    Layer.prototype.build = function (inputShape) {
        this.built = true;
    };
    Layer.prototype.getWeights = function (trainableOnly) {
        if (trainableOnly === void 0) { trainableOnly = false; }
        return variables_1.batchGetValue(trainableOnly ? this.trainableWeights : this.weights);
    };
    Layer.prototype.setWeights = function (weights) {
        var _this = this;
        tfjs_core_1.tidy(function () {
            var params = _this.weights;
            if (params.length !== weights.length) {
                throw new errors_1.ValueError("You called setWeights(weights) on layer \"" + _this.name + "\" " +
                    ("with a weight list of length " + weights.length + ", ") +
                    ("but the layer was expecting " + params.length + " weights. ") +
                    ("Provided weights: " + weights + "..."));
            }
            if (params.length === 0) {
                return;
            }
            var weightValueTuples = [];
            var paramValues = variables_1.batchGetValue(params);
            for (var i = 0; i < paramValues.length; ++i) {
                var pv = paramValues[i];
                var p = params[i];
                var w = weights[i];
                if (!tfjs_core_1.util.arraysEqual(pv.shape, w.shape)) {
                    throw new errors_1.ValueError("Layer weight shape " + pv.shape + " " +
                        ("not compatible with provided weight shape " + w.shape));
                }
                weightValueTuples.push([p, w]);
            }
            variables_1.batchSetValue(weightValueTuples);
        });
    };
    Layer.prototype.addWeight = function (name, shape, dtype, initializer, regularizer, trainable, constraint) {
        if (this._addedWeightNames.indexOf(name) !== -1) {
            throw new errors_1.ValueError("Duplicate weight name " + name + " for layer " + this.name);
        }
        this._addedWeightNames.push(name);
        if (dtype == null) {
            dtype = K.floatx();
        }
        var weight = new variables_1.LayerVariable(initializer.apply(shape, dtype), dtype, name, trainable, constraint);
        if (regularizer != null) {
            this.addLoss(function () { return regularizer.apply(weight.read()); });
        }
        if (trainable == null) {
            trainable = true;
        }
        if (trainable) {
            this._trainableWeights.push(weight);
        }
        else {
            this._nonTrainableWeights.push(weight);
        }
        return weight;
    };
    Layer.prototype.addLoss = function (losses) {
        if (losses == null || Array.isArray(losses) && losses.length === 0) {
            return;
        }
        losses = generic_utils.toList(losses);
        if (this._losses !== undefined && this._losses !== null) {
            (_a = this.losses).push.apply(_a, losses);
        }
        var _a;
    };
    Layer.prototype.computeOutputShape = function (inputShape) {
        return inputShape;
    };
    Layer.prototype.computeMask = function (inputs, mask) {
        var _this = this;
        if (!this.supportsMasking) {
            if (mask != null) {
                if (Array.isArray(mask)) {
                    mask.forEach(function (maskElement) {
                        if (maskElement != null) {
                            throw new TypeError("Layer " + _this.name + " does not support masking," +
                                'but was passed an inputMask.');
                        }
                    });
                }
                else {
                    throw new TypeError("Layer " + this.name + " does not support masking," +
                        'but was passed an inputMask.');
                }
            }
            return null;
        }
        return mask;
    };
    Layer.prototype.addInboundNode = function (inputTensors, outputTensors, inputMasks, outputMasks, inputShapes, outputShapes, kwargs) {
        if (kwargs === void 0) { kwargs = null; }
        var inputTensorList = generic_utils.toList(inputTensors);
        outputTensors = generic_utils.toList(outputTensors);
        inputMasks = generic_utils.toList(inputMasks);
        outputMasks = generic_utils.toList(outputMasks);
        inputShapes = generic_utils.normalizeShapeList(inputShapes);
        outputShapes = generic_utils.normalizeShapeList(outputShapes);
        var inboundLayers = [];
        var nodeIndices = [];
        var tensorIndices = [];
        for (var _i = 0, inputTensorList_1 = inputTensorList; _i < inputTensorList_1.length; _i++) {
            var x = inputTensorList_1[_i];
            inboundLayers.push(x.sourceLayer);
            nodeIndices.push(x.nodeIndex);
            tensorIndices.push(x.tensorIndex);
        }
        new Node({
            outboundLayer: this,
            inboundLayers: inboundLayers,
            nodeIndices: nodeIndices,
            tensorIndices: tensorIndices,
            inputTensors: inputTensorList,
            outputTensors: outputTensors,
            inputMasks: inputMasks,
            outputMasks: outputMasks,
            inputShapes: inputShapes,
            outputShapes: outputShapes
        }, kwargs);
        for (var i = 0; i < outputTensors.length; i++) {
            outputTensors[i].sourceLayer = this;
            outputTensors[i].nodeIndex = this.inboundNodes.length - 1;
            outputTensors[i].tensorIndex = i;
        }
    };
    Layer.prototype.getConfig = function () {
        var config = { name: this.name, trainable: this.trainable };
        if (this.batchInputShape != null) {
            config['batchInputShape'] = this.batchInputShape;
        }
        if (this.dtype != null) {
            config['dtype'] = this.dtype;
        }
        return config;
    };
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', 'subheading': 'Classes' })
    ], Layer.prototype, "apply", null);
    Layer = __decorate([
        tfjs_core_1.doc({ heading: 'Layers', subheading: 'Classes', namespace: 'layers' })
    ], Layer);
    return Layer;
}(tfjs_core_1.serialization.Serializable));
exports.Layer = Layer;
function collectInputShape(inputTensors) {
    inputTensors =
        generic_utils.toList(inputTensors);
    var shapes = [];
    for (var _i = 0, inputTensors_1 = inputTensors; _i < inputTensors_1.length; _i++) {
        var x = inputTensors_1[_i];
        shapes.push(K.intShape(x));
    }
    return generic_utils.singletonOrArray(shapes);
}
function guessOutputDType(inputTensors) {
    return 'float32';
}
var InputLayer = (function (_super) {
    __extends(InputLayer, _super);
    function InputLayer(config) {
        var _this = _super.call(this, {
            dtype: config.dtype,
            name: config.name != null ? config.name : K.getUid('input').toString()
        }) || this;
        if (config.batchSize == null) {
            config.batchSize = null;
        }
        if (config.sparse == null) {
            config.sparse = false;
        }
        _this.trainable = false;
        _this.built = true;
        _this.sparse = config.sparse;
        if (config.inputShape != null && config.batchInputShape != null) {
            throw new errors_1.ValueError('Only provide the inputShape OR ' +
                'batchInputShape argument to inputLayer, not both at the same time.');
        }
        var batchInputShape = config.batchInputShape;
        if (batchInputShape == null) {
            if (config.inputShape == null) {
                throw new errors_1.ValueError('An InputLayer should be passed either a ' +
                    '`batchInputShape` or an `inputShape`.');
            }
            else {
                batchInputShape = [config.batchSize].concat(config.inputShape);
            }
        }
        else {
            if (config.batchSize != null) {
                throw new errors_1.ValueError('Cannot specify batchSize if batchInputShape is' +
                    'specified when creating an InputLayer.');
            }
        }
        var dtype = config.dtype || K.floatx();
        _this.batchInputShape = batchInputShape;
        _this.dtype = dtype;
        _this.inputSpec = [{ shape: batchInputShape }];
        var inputTensor = new types_1.SymbolicTensor(_this.dtype, _this.batchInputShape, _this, [], {}, _this.name);
        inputTensor.nodeIndex = 0;
        inputTensor.tensorIndex = 0;
        new Node({
            outboundLayer: _this,
            inboundLayers: [],
            nodeIndices: [],
            tensorIndices: [],
            inputTensors: [inputTensor],
            outputTensors: [inputTensor],
            inputMasks: [null],
            outputMasks: [null],
            inputShapes: [batchInputShape],
            outputShapes: [batchInputShape]
        });
        return _this;
    }
    InputLayer.prototype.apply = function (inputs, kwargs) {
        throw new errors_1.ValueError('Cannot pass any input to an ' +
            ("InputLayer's apply() method. InputLayer name: " + this.name));
    };
    InputLayer.prototype.getConfig = function () {
        return {
            batchInputShape: this.batchInputShape,
            dtype: this.dtype,
            sparse: this.sparse,
            name: this.name
        };
    };
    InputLayer.className = 'InputLayer';
    return InputLayer;
}(Layer));
exports.InputLayer = InputLayer;
tfjs_core_1.serialization.SerializationMap.register(InputLayer);
function Input(config) {
    if (config.batchShape == null && config.shape == null) {
        throw new Error('Please provide to Input either a `shape`' +
            ' or a `batchShape` argument. Note that ' +
            '`shape` does not include the batch ' +
            'dimension.');
    }
    if (config.batchShape != null && config.shape != null) {
        throw new errors_1.ValueError('Please provide either a `shape` or `batchShape` ' +
            'argument to Input, but not both.');
    }
    var batchShape = config.batchShape;
    if (config.shape != null && batchShape == null) {
        batchShape = [null].concat(config.shape);
    }
    var dtype = config.dtype;
    if (dtype == null) {
        dtype = K.floatx();
    }
    var inputLayer = new InputLayer({
        batchInputShape: batchShape,
        name: config.name,
        dtype: dtype,
        sparse: config.sparse
    });
    var outputs = inputLayer.inboundNodes[0].outputTensors;
    return outputs[0];
}
exports.Input = Input;
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(config) {
        var _this = _super.call(this, {}) || this;
        _this.containerNodes = new Set();
        _this.name = config.name;
        if (_this.name == null) {
            var prefix = _this.getClassName().toLowerCase();
            _this.name = K.getUid(prefix);
        }
        _this.supportsMasking = false;
        _this.trainable = true;
        _this.updatable = true;
        if (Array.isArray(config.inputs)) {
            _this.inputs = config.inputs.slice();
        }
        else {
            _this.inputs = [config.inputs];
        }
        if (Array.isArray(config.outputs)) {
            _this.outputs = config.outputs.slice();
        }
        else {
            _this.outputs = [config.outputs];
        }
        if (generic_utils.unique(_this.inputs).length !== _this.inputs.length) {
            throw new errors_1.ValueError('The list of inputs passed to the model is ' +
                'redundant. All inputs should only appear once. Found: ' +
                _this.inputs.map(function (x) { return x.name; }));
        }
        if (generic_utils.unique(_this.outputs).length !== _this.outputs.length) {
            console.warn('The list of outputs passed to the model is redundant. ' +
                'All outputs should only appear once. Found: ' +
                _this.outputs.map(function (x) { return x.name; }));
        }
        _this.inputLayers = [];
        _this.inputLayersNodeIndices = [];
        _this.inputLayersTensorIndices = [];
        _this.outputLayers = [];
        _this.outputLayersNodeIndices = [];
        _this.outputLayersTensorIndices = [];
        _this.layers = [];
        for (var _i = 0, _a = _this.outputs; _i < _a.length; _i++) {
            var x = _a[_i];
            var layer = x.sourceLayer;
            var nodeIndex = x.nodeIndex;
            var tensorIndex = x.tensorIndex;
            _this.outputLayers.push(layer);
            _this.outputLayersNodeIndices.push(nodeIndex);
            _this.outputLayersTensorIndices.push(tensorIndex);
        }
        for (var _b = 0, _c = _this.inputs; _b < _c.length; _b++) {
            var x = _c[_b];
            var layer = x.sourceLayer;
            var nodeIndex = x.nodeIndex;
            var tensorIndex = x.tensorIndex;
            generic_utils.assert(nodeIndex === 0, 'input layer has >1 nodes');
            generic_utils.assert(tensorIndex === 0, 'input layer has >1 tensors');
            _this.inputLayers.push(layer);
            _this.inputLayersNodeIndices.push(nodeIndex);
            _this.inputLayersTensorIndices.push(tensorIndex);
        }
        _this.inputNames = [];
        _this.outputNames = [];
        _this.feedInputShapes = [];
        _this.feedInputNames = [];
        _this.feedOutputNames = [];
        for (var i = 0; i < _this.inputLayers.length; i++) {
            var layer = _this.inputLayers[i];
            if (!(layer instanceof InputLayer)) {
                throw new TypeError('Input layers to a Model must be InputLayer objects. ' +
                    ("Received inputs: " + config.inputs + ". ") +
                    ("Input " + i + " (0-based) originates ") +
                    ("from layer type " + layer.getClassName() + "."));
            }
            _this.inputNames.push(layer.name);
            _this.feedInputShapes.push(layer.batchInputShape);
            _this.feedInputNames.push(layer.name);
        }
        for (var _d = 0, _e = _this.outputLayers; _d < _e.length; _d++) {
            var layer = _e[_d];
            _this.outputNames.push(layer.name);
        }
        _this.internalInputShapes = _this.inputs.map(function (x) { return x.shape; });
        _this.internalOutputShapes = _this.outputs.map(function (x) { return x.shape; });
        var nodesDepths = {};
        var nodeIDToNode = {};
        var layersDepths = {};
        var layerIDToLayer = {};
        var layerIndices = {};
        var nodesInDecreasingDepth = [];
        var buildMapOfGraph = function (tensor, finishedNodes, nodesInProgress, layer, nodeIndex, tensorIndex) {
            if (layer == null || nodeIndex == null || tensorIndex == null) {
                layer = tensor.sourceLayer;
                nodeIndex = tensor.nodeIndex;
                tensorIndex = tensor.tensorIndex;
            }
            var node = layer.inboundNodes[nodeIndex];
            if (nodesInProgress.indexOf(node) !== -1) {
                throw new errors_1.RuntimeError("The tensor " + tensor.name + " at layer \"" + layer.name + "\" " +
                    'is part of a cycle.');
            }
            if (finishedNodes.indexOf(node) !== -1) {
                return;
            }
            _this.containerNodes.add(Container.nodeKey(layer, nodeIndex));
            if (!(layer.id in layerIndices)) {
                layerIndices[layer.id] = Object.keys(layerIndices).length;
            }
            if (nodesInProgress.indexOf(node) === -1) {
                nodesInProgress.push(node);
            }
            var numInboundLayers = node.inboundLayers.length;
            for (var i = 0; i < numInboundLayers; i++) {
                var x = node.inputTensors[i];
                var layer_1 = node.inboundLayers[i];
                var nodeIndex_1 = node.nodeIndices[i];
                var tensorIndex_1 = node.tensorIndices[i];
                buildMapOfGraph(x, finishedNodes, nodesInProgress, layer_1, nodeIndex_1, tensorIndex_1);
            }
            finishedNodes.push(node);
            while (nodesInProgress.indexOf(node) >= 0) {
                nodesInProgress.splice(nodesInProgress.indexOf(node), 1);
            }
            nodesInDecreasingDepth.push(node);
        };
        var finishedNodes = [];
        var nodesInProgress = [];
        for (var _f = 0, _g = _this.outputs; _f < _g.length; _f++) {
            var x = _g[_f];
            buildMapOfGraph(x, finishedNodes, nodesInProgress);
        }
        var reversedNodesInDecreasingDepth = nodesInDecreasingDepth.slice().reverse();
        for (var _h = 0, reversedNodesInDecreasingDepth_1 = reversedNodesInDecreasingDepth; _h < reversedNodesInDecreasingDepth_1.length; _h++) {
            var node = reversedNodesInDecreasingDepth_1[_h];
            nodeIDToNode[node.id] = node;
            if (!(node.id in nodesDepths)) {
                nodesDepths[node.id] = 0;
            }
            var depth = nodesDepths[node.id];
            var previousDepth = (layersDepths[node.outboundLayer.id] == null ?
                0 :
                layersDepths[node.outboundLayer.id]);
            depth = Math.max(depth, previousDepth);
            layersDepths[node.outboundLayer.id] = depth;
            layerIDToLayer[node.outboundLayer.id] = node.outboundLayer;
            nodesDepths[node.id] = depth;
            for (var i = 0; i < node.inboundLayers.length; i++) {
                var inboundLayer = node.inboundLayers[i];
                var nodeIndex = node.nodeIndices[i];
                var inboundNode = inboundLayer.inboundNodes[nodeIndex];
                var previousDepth_1 = (nodesDepths[inboundNode.id] == null ? 0 :
                    nodesDepths[inboundNode.id]);
                nodesDepths[inboundNode.id] = Math.max(depth + 1, previousDepth_1);
                nodeIDToNode[inboundNode.id] = inboundNode;
            }
        }
        var nodesByDepth = {};
        for (var nodeID in nodesDepths) {
            var depth = nodesDepths[nodeID];
            if (!(depth in nodesByDepth)) {
                nodesByDepth[depth] = [];
            }
            nodesByDepth[depth].push(nodeIDToNode[nodeID]);
        }
        var layersByDepth = {};
        for (var layerID in layersDepths) {
            var depth = layersDepths[layerID];
            if (!(depth in layersByDepth)) {
                layersByDepth[depth] = [];
            }
            layersByDepth[depth].push(layerIDToLayer[layerID]);
        }
        var depthKeys = Object.keys(layersByDepth)
            .map(function (x) { return parseInt(x, 10); })
            .sort(generic_utils.reverseNumberCompare);
        _this.layers = [];
        for (var _j = 0, depthKeys_1 = depthKeys; _j < depthKeys_1.length; _j++) {
            var depth = depthKeys_1[_j];
            var layersForDepth = layersByDepth[depth];
            layersForDepth.sort(function (a, b) {
                var aIndex = layerIndices[a.id];
                var bIndex = layerIndices[b.id];
                if (aIndex < bIndex) {
                    return -1;
                }
                if (aIndex > bIndex) {
                    return 1;
                }
                return 0;
            });
            for (var _k = 0, layersForDepth_1 = layersForDepth; _k < layersForDepth_1.length; _k++) {
                var layer = layersForDepth_1[_k];
                _this.layers.push(layer);
            }
        }
        _this.layersByDepth = layersByDepth;
        depthKeys = Object.keys(nodesByDepth)
            .map(function (x) { return parseInt(x, 10); })
            .sort(generic_utils.reverseNumberCompare);
        var computableTensors = _this.inputs.slice();
        var layersWithCompleteInput = [];
        for (var _l = 0, depthKeys_2 = depthKeys; _l < depthKeys_2.length; _l++) {
            var depth = depthKeys_2[_l];
            for (var _m = 0, _o = nodesByDepth[depth]; _m < _o.length; _m++) {
                var node = _o[_m];
                var layer = node.outboundLayer;
                if (layer != null) {
                    for (var _p = 0, _q = node.inputTensors; _p < _q.length; _p++) {
                        var x = _q[_p];
                        if (computableTensors.indexOf(x) === -1) {
                            throw new errors_1.RuntimeError("Graph disconnected: cannot obtain value for tensor " + x +
                                (" at layer \"" + layer.name + "\". ") +
                                'The following previous layers were accessed without ' +
                                ("issue: " + layersWithCompleteInput));
                        }
                    }
                    for (var _r = 0, _s = node.outputTensors; _r < _s.length; _r++) {
                        var x = _s[_r];
                        computableTensors.push(x);
                    }
                    layersWithCompleteInput.push(layer.name);
                }
            }
        }
        _this.nodesByDepth = nodesByDepth;
        var allNames = _this.layers.map(function (x) { return x.name; });
        var _loop_1 = function (name_1) {
            var numOccurrences = allNames.filter(function (x) { return x === name_1; }).length;
            if (numOccurrences !== 1) {
                throw new errors_1.RuntimeError("The name \"" + name_1 + "\" is used " + numOccurrences + " times " +
                    'in the model. All layer names should be unique. Layer names: ' +
                    JSON.stringify(allNames));
            }
        };
        for (var _t = 0, allNames_1 = allNames; _t < allNames_1.length; _t++) {
            var name_1 = allNames_1[_t];
            _loop_1(name_1);
        }
        _this.outboundNodes = [];
        _this.inboundNodes = [];
        new Node({
            outboundLayer: _this,
            inboundLayers: [],
            nodeIndices: [],
            tensorIndices: [],
            inputTensors: _this.inputs,
            outputTensors: _this.outputs,
            inputMasks: _this.inputs.map(function (x) { return null; }),
            outputMasks: _this.outputs.map(function (x) { return null; }),
            inputShapes: _this.inputs.map(function (x) { return x.shape; }),
            outputShapes: _this.outputs.map(function (x) { return x.shape; })
        });
        _this.built = true;
        return _this;
    }
    Object.defineProperty(Container.prototype, "trainableWeights", {
        get: function () {
            if (this._trainableWeights.length > 0) {
                throw new errors_1.ValueError('Container instance unexpectedly contains _trainableWeights.' +
                    'The trainable weights of a Container are a union of the ' +
                    'trainable weights of its consituent Layers. Its own ' +
                    '_trainableWeights must remain an empty Array.');
            }
            if (!this.trainable) {
                return [];
            }
            var weights = [];
            for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                weights = weights.concat(layer.trainableWeights);
            }
            return weights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "nonTrainableWeights", {
        get: function () {
            var weights = [];
            for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                weights.push.apply(weights, layer.nonTrainableWeights);
            }
            if (!this.trainable) {
                var trainableWeights = [];
                for (var _b = 0, _c = this.layers; _b < _c.length; _b++) {
                    var layer = _c[_b];
                    trainableWeights.push.apply(trainableWeights, layer.trainableWeights);
                }
                return trainableWeights.concat(weights);
            }
            return weights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "weights", {
        get: function () {
            return this.trainableWeights.concat(this.nonTrainableWeights);
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.loadWeights = function (weightsJSON, skipMismatch, isNamedTensorMap) {
        if (skipMismatch === void 0) { skipMismatch = false; }
        if (isNamedTensorMap === void 0) { isNamedTensorMap = false; }
        if (isNamedTensorMap) {
            loadWeightsFromNamedTensorMap(weightsJSON, this.layers);
        }
        else {
            loadWeightsFromJson(weightsJSON, this.layers, skipMismatch);
        }
    };
    Container.prototype.updatedConfig = function () {
        var theConfig = this.getConfig();
        var modelConfig = {
            className: this.getClassName(),
            config: theConfig,
            kerasVersion: "tfjs-layers " + version_1.version,
            backend: 'TensorFlow.js'
        };
        return modelConfig;
    };
    Container.prototype.toJSON = function (unused, returnString) {
        if (returnString === void 0) { returnString = true; }
        var modelConfig = serialization_utils_1.convertTsToPythonic(this.updatedConfig());
        return returnString ? JSON.stringify(modelConfig) : modelConfig;
    };
    Container.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils.toList(inputs);
            var masks;
            if ('mask' in kwargs) {
                masks = generic_utils.toList(kwargs['mask']);
            }
            else {
                masks = generic_utils.pyListRepeat(null, inputs.length);
            }
            return _this.runInternalGraph(inputs, masks)[0];
        });
    };
    Container.prototype.computeMask = function (inputs, mask) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils.toList(inputs);
            var masks;
            if (mask == null) {
                masks = generic_utils.pyListRepeat(null, inputs.length);
            }
            else {
                masks = generic_utils.toList(mask);
            }
            return _this.runInternalGraph(inputs, masks)[1];
        });
    };
    Container.prototype.computeOutputShape = function (inputShape) {
        var inputShapes = generic_utils.normalizeShapeList(inputShape);
        if (inputShapes.length !== this.inputLayers.length) {
            throw new errors_1.ValueError("Invalid inputShape argument " + inputShape + ": " +
                ("model has " + this.inputLayers.length + " tensor inputs."));
        }
        var layersToOutputShapes = {};
        for (var i = 0; i < inputShapes.length; i++) {
            var layer = this.inputLayers[i];
            var inputShape_1 = inputShapes[i];
            var shapeKey = layer.name + '_0_0';
            layersToOutputShapes[shapeKey] = inputShape_1;
        }
        var depthKeys = Object.keys(this.nodesByDepth)
            .map(function (x) { return parseInt(x, 10); })
            .sort(generic_utils.reverseNumberCompare);
        if (depthKeys.length > 1) {
            for (var _i = 0, depthKeys_3 = depthKeys; _i < depthKeys_3.length; _i++) {
                var depth = depthKeys_3[_i];
                var nodes = this.nodesByDepth[depth];
                for (var _a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
                    var node = nodes_1[_a];
                    var layer = node.outboundLayer;
                    if (this.inputLayers.map(function (x) { return x.id; }).indexOf(layer.id) !== -1) {
                        continue;
                    }
                    var inputShapes_1 = [];
                    for (var j = 0; j < node.inboundLayers.length; j++) {
                        var inboundLayer = node.inboundLayers[j];
                        var nodeIndex_2 = node.nodeIndices[j];
                        var tensorIndex = node.tensorIndices[j];
                        var shapeKey = inboundLayer.name + "_" + nodeIndex_2 + "_" + tensorIndex;
                        var inputShape_2 = layersToOutputShapes[shapeKey];
                        inputShapes_1.push(inputShape_2);
                    }
                    var outputShape = layer.computeOutputShape(generic_utils.singletonOrArray(inputShapes_1));
                    var outputShapes_1 = generic_utils.normalizeShapeList(outputShape);
                    var nodeIndex = layer.inboundNodes.indexOf(node);
                    for (var j = 0; j < outputShapes_1.length; j++) {
                        var shapeKey = layer.name + "_" + nodeIndex + "_" + j;
                        layersToOutputShapes[shapeKey] = outputShapes_1[j];
                    }
                }
            }
        }
        var outputShapes = [];
        var outputShapeKeys = [];
        for (var i = 0; i < this.outputLayers.length; i++) {
            var layer = this.outputLayers[i];
            var nodeIndex = this.outputLayersNodeIndices[i];
            var tensorIndex = this.outputLayersTensorIndices[i];
            var shapeKey = layer.name + "_" + nodeIndex + "_" + tensorIndex;
            outputShapeKeys.push(shapeKey);
        }
        for (var i = 0; i < outputShapeKeys.length; i++) {
            var key = outputShapeKeys[i];
            generic_utils.assert(key in layersToOutputShapes);
            outputShapes.push(layersToOutputShapes[key]);
        }
        return generic_utils.singletonOrArray(outputShapes);
    };
    Container.prototype.runInternalGraph = function (inputs, masks) {
        if (masks == null) {
            masks = generic_utils.pyListRepeat(null, inputs.length);
        }
        var tensorMap = {};
        for (var i = 0; i < this.inputs.length; ++i) {
            var x = this.inputs[i];
            var y = inputs[i];
            var mask = masks[i];
            tensorMap[x.id] = [y, mask];
        }
        var depthKeys = Object.keys(this.nodesByDepth)
            .map(function (x) { return parseInt(x, 10); })
            .sort(generic_utils.reverseNumberCompare);
        for (var _i = 0, depthKeys_4 = depthKeys; _i < depthKeys_4.length; _i++) {
            var depth = depthKeys_4[_i];
            var nodes = this.nodesByDepth[depth];
            for (var _a = 0, nodes_2 = nodes; _a < nodes_2.length; _a++) {
                var node = nodes_2[_a];
                var layer = node.outboundLayer;
                var referenceInputTensors = node.inputTensors;
                var referenceOutputTensors = node.outputTensors;
                var computedData = new Array();
                for (var _b = 0, referenceInputTensors_1 = referenceInputTensors; _b < referenceInputTensors_1.length; _b++) {
                    var x = referenceInputTensors_1[_b];
                    if (x.id in tensorMap) {
                        computedData.push(tensorMap[x.id]);
                    }
                }
                if (computedData.length === referenceInputTensors.length) {
                    var kwargs = {};
                    var computedTensors = void 0;
                    var computedMasks = void 0;
                    var outputTensors_1 = void 0;
                    var outputMasks_1 = void 0;
                    if (node.callArgs != null) {
                        kwargs = node.callArgs;
                    }
                    if (computedData.length === 1) {
                        var _c = computedData[0], computedTensor = _c[0], computedMask = _c[1];
                        if (kwargs.mask == null) {
                            kwargs['mask'] = computedMask;
                        }
                        outputTensors_1 =
                            generic_utils.toList(layer.call(computedTensor, kwargs));
                        outputMasks_1 = generic_utils.toList(layer.computeMask(computedTensor, computedMask));
                        computedTensors = [computedTensor];
                        computedMasks = [computedMask];
                    }
                    else {
                        computedTensors = computedData.map(function (x) { return x[0]; });
                        computedMasks = computedData.map(function (x) { return x[1]; });
                        if (kwargs.mask == null) {
                            kwargs['mask'] = computedMasks;
                        }
                        outputTensors_1 =
                            generic_utils.toList(layer.call(computedTensors, kwargs));
                        outputMasks_1 = generic_utils.toList(layer.computeMask(computedTensors, computedMasks));
                    }
                    if (layer.activityRegularizer) {
                        throw new errors_1.NotImplementedError('Model invocation with concrete Tensor value(s) in the ' +
                            'presence of activity regularizer(s) is not supported yet.');
                    }
                    for (var i = 0; i < referenceOutputTensors.length; ++i) {
                        var x = referenceOutputTensors[i];
                        var y = outputTensors_1[i];
                        var mask = outputMasks_1[i];
                        tensorMap[x.id] = [y, mask];
                    }
                }
            }
        }
        var outputTensors = [];
        var outputMasks = [];
        var outputShapes = [];
        for (var _d = 0, _e = this.outputs; _d < _e.length; _d++) {
            var x = _e[_d];
            generic_utils.assert(x.id in tensorMap, "Could not compute output " + x.name + " : " + x.id);
            var _f = tensorMap[x.id], tensor = _f[0], mask = _f[1];
            outputShapes.push(tensor.shape);
            outputTensors.push(tensor);
            outputMasks.push(mask);
        }
        return [outputTensors, outputMasks, outputShapes];
    };
    Container.prototype.buildNodeConversionMap = function (layers) {
        var nodeConversionMap = {};
        var keptNodes;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            keptNodes = layer instanceof Container ? 1 : 0;
            for (var originalNodeIndex = 0; originalNodeIndex < layer.inboundNodes.length; originalNodeIndex++) {
                var nodeKey = Container.nodeKey(layer, originalNodeIndex);
                if (nodeKey in this.containerNodes) {
                    nodeConversionMap[nodeKey] = keptNodes;
                    keptNodes += 1;
                }
            }
        }
        return nodeConversionMap;
    };
    Container.prototype.getLayer = function (name, index) {
        if (index != null) {
            if (this.layers.length <= index) {
                throw new errors_1.ValueError("Was asked to retrieve layer at index " + index + ", but model only " +
                    ("has " + this.layers.length + " layer(s)."));
            }
            else {
                return this.layers[index];
            }
        }
        else {
            if (name == null) {
                throw new errors_1.ValueError('Provide either a layer name or layer index');
            }
        }
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (layer.name === name) {
                return layer;
            }
        }
        throw new errors_1.ValueError("No such layer: " + name);
    };
    Container.prototype.calculateLosses = function () {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var losses = [];
            for (var _i = 0, _a = _this.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                for (var nodeIndex = 0; nodeIndex < layer.inboundNodes.length; ++nodeIndex) {
                    var nodeKey = Container.nodeKey(layer, nodeIndex);
                    if (_this.containerNodes.has(nodeKey)) {
                        losses.push.apply(losses, layer.calculateLosses());
                    }
                }
            }
            return losses;
        });
    };
    Container.prototype.getConfig = function () {
        var config = { name: this.name };
        var nodeConversionMap = this.buildNodeConversionMap(this.layers);
        var layerConfigs = [];
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            var layerClassName = layer.getClassName();
            var layerConfig = layer.getConfig();
            var filteredInboundNodes = [];
            for (var originalNodeIndex = 0; originalNodeIndex < layer.inboundNodes.length; originalNodeIndex++) {
                var node = layer.inboundNodes[originalNodeIndex];
                var nodeKey = Container.nodeKey(layer, originalNodeIndex);
                var kwargs = {};
                if (this.containerNodes.has(nodeKey)) {
                    if (node.callArgs) {
                        var testString = JSON.stringify(node.callArgs);
                        if (testString.indexOf('undefined') === -1) {
                            kwargs = node.callArgs;
                        }
                        else {
                            console.warn("Layer " + layer.name + " was passed " +
                                "non-serializable keyword arguments: " +
                                (node.callArgs + ". They will not be included ") +
                                "in the serialized model (and thus will be " +
                                "missing at deserialization time).");
                            kwargs = {};
                        }
                    }
                    if (node.inboundLayers.length > 0) {
                        var nodeData = [];
                        for (var i = 0; i < node.inboundLayers.length; i++) {
                            var inboundLayer = node.inboundLayers[i];
                            var nodeIndex = node.nodeIndices[i];
                            var tensorIndex = node.tensorIndices[i];
                            var nodeKey_1 = Container.nodeKey(inboundLayer, nodeIndex);
                            var newNodeIndex = nodeConversionMap[nodeKey_1];
                            if (newNodeIndex === null || newNodeIndex === undefined) {
                                newNodeIndex = 0;
                            }
                            nodeData.push([inboundLayer.name, newNodeIndex, tensorIndex, kwargs]);
                        }
                        filteredInboundNodes.push(nodeData);
                    }
                }
            }
            layerConfigs.push({
                name: layer.name,
                className: layerClassName,
                config: layerConfig,
                inboundNodes: filteredInboundNodes
            });
        }
        config['layers'] = layerConfigs;
        var modelInputs = [];
        for (var i = 0; i < this.inputLayers.length; i++) {
            var layer = this.inputLayers[i];
            var nodeIndex = this.inputLayersNodeIndices[i];
            var nodeKey = Container.nodeKey(layer, nodeIndex);
            if (!this.containerNodes.has(nodeKey)) {
                continue;
            }
            var newNodeIndex = nodeConversionMap[nodeKey];
            if (newNodeIndex === null || newNodeIndex === undefined) {
                newNodeIndex = 0;
            }
            var tensorIndex = this.inputLayersTensorIndices[i];
            modelInputs.push([layer.name, newNodeIndex, tensorIndex]);
        }
        config['inputLayers'] = modelInputs;
        var modelOutputs = [];
        for (var i = 0; i < this.outputLayers.length; i++) {
            var layer = this.outputLayers[i];
            var nodeIndex = this.outputLayersNodeIndices[i];
            var nodeKey = Container.nodeKey(layer, nodeIndex);
            if (!this.containerNodes.has(nodeKey)) {
                continue;
            }
            var newNodeIndex = nodeConversionMap[nodeKey];
            if (newNodeIndex === null || newNodeIndex === undefined) {
                newNodeIndex = 0;
            }
            var tensorIndex = this.outputLayersTensorIndices[i];
            modelOutputs.push([layer.name, newNodeIndex, tensorIndex]);
        }
        config['outputLayers'] = modelOutputs;
        return config;
    };
    Container.fromConfig = function (cls, config) {
        var createdLayers = {};
        var unprocessedNodes = {};
        function addUnprocessedNode(layer, nodeData) {
            if (!(layer.name in unprocessedNodes)) {
                unprocessedNodes[layer.name] = [nodeData];
            }
            else {
                unprocessedNodes[layer.name].push(nodeData);
            }
        }
        function processNode(layer, nodeData) {
            var inputTensors = [];
            var kwargs;
            for (var _i = 0, nodeData_1 = nodeData; _i < nodeData_1.length; _i++) {
                var inputData = nodeData_1[_i];
                var inboundLayerName = inputData[0];
                var inboundNodeIndex = inputData[1];
                var inboundTensorIndex = inputData[2];
                if (inputData.length === 3) {
                    kwargs = {};
                }
                else if (inputData.length === 4) {
                    kwargs = inputData[3];
                }
                else {
                    throw new errors_1.ValueError("Improperly formatted model config for layer " + JSON.stringify(layer) + ": " + JSON.stringify(inputData));
                }
                if (!(inboundLayerName in createdLayers)) {
                    addUnprocessedNode(layer, nodeData);
                    return;
                }
                var inboundLayer = createdLayers[inboundLayerName];
                if (inboundLayer.inboundNodes.length <= inboundNodeIndex) {
                    addUnprocessedNode(layer, nodeData);
                    return;
                }
                var inboundNode = inboundLayer.inboundNodes[inboundNodeIndex];
                inputTensors.push(inboundNode.outputTensors[inboundTensorIndex]);
            }
            if (inputTensors.length > 0) {
                layer.apply(generic_utils.singletonOrArray(inputTensors), kwargs);
            }
        }
        function processLayer(layerData) {
            var layerName = layerData.name;
            var layer = serialization_1.deserialize(layerData, config.customObjects != null ?
                config.customObjects :
                {});
            createdLayers[layerName] = layer;
            var inboundNodesData = layerData.inboundNodes;
            for (var _i = 0, inboundNodesData_1 = inboundNodesData; _i < inboundNodesData_1.length; _i++) {
                var nodeData = inboundNodesData_1[_i];
                if (!(nodeData instanceof Array)) {
                    throw new errors_1.ValueError("Corrupted configuration, expected array for nodeData: " + nodeData);
                }
                addUnprocessedNode(layer, nodeData);
            }
        }
        var name = config.name;
        var layersFromConfig = config.layers;
        for (var _i = 0, layersFromConfig_1 = layersFromConfig; _i < layersFromConfig_1.length; _i++) {
            var layerData = layersFromConfig_1[_i];
            processLayer(layerData);
        }
        while (!generic_utils.isObjectEmpty(unprocessedNodes)) {
            for (var _a = 0, layersFromConfig_2 = layersFromConfig; _a < layersFromConfig_2.length; _a++) {
                var layerData = layersFromConfig_2[_a];
                var layer = createdLayers[layerData.name];
                if (layer.name in unprocessedNodes) {
                    for (var _b = 0, _c = unprocessedNodes[layer.name]; _b < _c.length; _b++) {
                        var nodeData = _c[_b];
                        processNode(layer, nodeData);
                    }
                    delete unprocessedNodes[layer.name];
                }
            }
        }
        var inputTensors = [];
        var outputTensors = [];
        var inputLayersFromConfig = config.inputLayers;
        for (var _d = 0, inputLayersFromConfig_1 = inputLayersFromConfig; _d < inputLayersFromConfig_1.length; _d++) {
            var layerData = inputLayersFromConfig_1[_d];
            var layerName = layerData[0];
            var nodeIndex = layerData[1];
            var tensorIndex = layerData[2];
            generic_utils.assert(layerName in createdLayers);
            var layer = createdLayers[layerName];
            var layerOutputTensors = layer.inboundNodes[nodeIndex].outputTensors;
            inputTensors.push(layerOutputTensors[tensorIndex]);
        }
        var outputLayersFromConfig = config.outputLayers;
        for (var _e = 0, outputLayersFromConfig_1 = outputLayersFromConfig; _e < outputLayersFromConfig_1.length; _e++) {
            var layerData = outputLayersFromConfig_1[_e];
            var layerName = layerData[0];
            var nodeIndex = layerData[1];
            var tensorIndex = layerData[2];
            generic_utils.assert(layerName in createdLayers);
            var layer = createdLayers[layerName];
            var layerOutputTensors = layer.inboundNodes[nodeIndex].outputTensors;
            outputTensors.push(layerOutputTensors[tensorIndex]);
        }
        return new cls({ inputs: inputTensors, outputs: outputTensors, name: name });
    };
    Object.defineProperty(Container.prototype, "stateful", {
        get: function () {
            if (this._stateful) {
                throw new errors_1.ValueError('Container instance unexpectedly has _stateful = true. The ' +
                    'statefulness of a Container is determined by the Layers it ' +
                    'contains. Its _stateful property must remain the default false.');
            }
            for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.stateful) {
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Classes',
            namespace: 'layers',
            subclasses: ['Model']
        })
    ], Container.prototype, "getLayer", null);
    return Container;
}(Layer));
exports.Container = Container;
function getSourceInputs(tensor, layer, nodeIndex) {
    if (layer == null || (nodeIndex != null && nodeIndex > 0)) {
        layer = tensor.sourceLayer;
        nodeIndex = tensor.nodeIndex;
    }
    if (layer.inboundNodes.length === 0) {
        return [tensor];
    }
    else {
        var node = layer.inboundNodes[nodeIndex];
        if (node.inboundLayers.length === 0) {
            return node.inputTensors;
        }
        else {
            var sourceTensors = [];
            for (var i = 0; i < node.inboundLayers.length; i++) {
                var x = node.inputTensors[i];
                var layer_2 = node.inboundLayers[i];
                var nodeIndex_3 = node.nodeIndices[i];
                var previousSources = getSourceInputs(x, layer_2, nodeIndex_3);
                for (var _i = 0, previousSources_1 = previousSources; _i < previousSources_1.length; _i++) {
                    var x_1 = previousSources_1[_i];
                    if (sourceTensors.indexOf(x_1) === -1) {
                        sourceTensors.push(x_1);
                    }
                }
            }
            return sourceTensors;
        }
    }
}
exports.getSourceInputs = getSourceInputs;
function loadTensor(dtype, shape, value) {
    var dataType = generic_utils.stringToDType(dtype);
    return tfjs_core_1.Tensor.make(shape, { values: shape.length === 0 ? value : tfjs_core_1.util.flatten(value) }, dataType);
}
function preprocessWeightsForLoading(layer, weights, originalKerasVersion, originalBackend) {
    if (!originalKerasVersion.startsWith('2.')) {
        throw new errors_1.ValueError('Unsupported Keras version in weights being loaded: ' +
            originalKerasVersion);
    }
    return weights;
}
function loadWeightsFromNamedTensorMap(weights, layers) {
    var nameToWeight = {};
    var totalWeightsCount = 0;
    for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
        var layer = layers_1[_i];
        for (var _a = 0, _b = layer.weights; _a < _b.length; _a++) {
            var weight = _b[_a];
            if (nameToWeight[weight.originalName] != null) {
                throw new errors_1.ValueError("Duplicate weight name: " + weight.originalName);
            }
            nameToWeight[weight.originalName] = weight;
            totalWeightsCount++;
        }
    }
    var weightValueTuples = [];
    for (var name_2 in weights) {
        weightValueTuples.push([nameToWeight[name_2], weights[name_2]]);
        delete nameToWeight[name_2];
    }
    var unsetNames = [];
    for (var name_3 in nameToWeight) {
        unsetNames.push(name_3);
    }
    if (unsetNames.length > 0) {
        throw new errors_1.ValueError(unsetNames.length + " of " + totalWeightsCount + " weights are not set: " +
            ("" + unsetNames));
    }
    variables_1.batchSetValue(weightValueTuples);
}
exports.loadWeightsFromNamedTensorMap = loadWeightsFromNamedTensorMap;
function loadWeightsFromJson(weightsJSON, layers, skipMismatch) {
    if (skipMismatch === void 0) { skipMismatch = false; }
    var originalKerasVersion = weightsJSON['keras_version'];
    var originalBackend = weightsJSON['backend'];
    var layerNames = layers.map(function (layer) { return layer.name; });
    var index = {};
    for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
        var layer = layers_2[_i];
        if (layer.name != null) {
            if (index[layer.name] == null) {
                index[layer.name] = [];
            }
            index[layer.name].push(layer);
        }
    }
    var nameToWeights = weightsJSON['weights'];
    var weightValueTuples = [];
    for (var k = 0; k < layerNames.length; ++k) {
        var name_4 = layerNames[k];
        var layerWeights = nameToWeights[name_4];
        if (layerWeights == null) {
            layerWeights = [];
        }
        var weightValues = [];
        for (var n = 0; n < layerWeights.length; ++n) {
            var weightEntry = layerWeights[n];
            weightValues.push(new variables_1.LayerVariable(loadTensor(weightEntry['dtype'], weightEntry['shape'], weightEntry['value'])));
        }
        for (var _a = 0, _b = index[name_4]; _a < _b.length; _a++) {
            var layer = _b[_a];
            var symbolicWeights = layer.weights;
            weightValues = preprocessWeightsForLoading(layer, weightValues, originalKerasVersion, originalBackend);
            if (weightValues.length !== symbolicWeights.length) {
                if (skipMismatch) {
                    console.warn("Skipping loading of weights of layer " + layer.name + " " +
                        ("due to mismatch in number of weights: (" + weightValues.length + " ") +
                        ("vs " + symbolicWeights.length + ")."));
                }
                else {
                    throw new errors_1.ValueError("Layer #" + k + " (named \"" + layer.name + "\") expects " +
                        (symbolicWeights.length + " weight(s), but the saved weights ") +
                        ("have " + weightValues.length + " element(s)."));
                }
            }
            for (var i = 0; i < weightValues.length; ++i) {
                if (skipMismatch) {
                    if (!tfjs_core_1.util.arraysEqual(symbolicWeights[i].shape, weightValues[i].shape)) {
                        console.warn("Skipping loading of weights for layer " + layer.name + " due " +
                            ("to mismatch in shape (" + symbolicWeights[i].shape + " vs ") +
                            (weightValues[i].shape + ")"));
                        continue;
                    }
                }
                weightValueTuples.push([symbolicWeights[i], weightValues[i].read()]);
            }
        }
    }
    variables_1.batchSetValue(weightValueTuples);
}
exports.loadWeightsFromJson = loadWeightsFromJson;
//# sourceMappingURL=topology.js.map