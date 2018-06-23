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
var tfc = require("@tensorflow/tfjs-core");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var activations_1 = require("../activations");
var K = require("../backend/tfjs_backend");
var constraints_1 = require("../constraints");
var topology_1 = require("../engine/topology");
var topology_2 = require("../engine/topology");
var errors_1 = require("../errors");
var initializers_1 = require("../initializers");
var regularizers_1 = require("../regularizers");
var types_1 = require("../types");
var generic_utils = require("../utils/generic_utils");
var math_utils = require("../utils/math_utils");
var variables_1 = require("../variables");
var serialization_1 = require("./serialization");
function rnn(stepFunction, inputs, initialStates, goBackwards, mask, constants, unroll, inputLength) {
    if (goBackwards === void 0) { goBackwards = false; }
    if (unroll === void 0) { unroll = false; }
    var ndim = inputs.shape.length;
    if (ndim < 3) {
        throw new errors_1.ValueError("Input should be at least 3D, but is " + ndim + "D.");
    }
    var axes = [1, 0].concat(math_utils.range(2, ndim));
    inputs = tfc.transpose(inputs, axes);
    if (mask != null) {
        throw new errors_1.NotImplementedError('The rnn() function of the deeplearn.js backend does not support ' +
            'masking yet.');
    }
    if (constants != null) {
        throw new errors_1.NotImplementedError('The rnn() functoin of the deeplearn.js backend does not support ' +
            'constants yet.');
    }
    if (unroll) {
        console.warn('Backend rnn(): the unroll = true option is not applicable to the ' +
            'imperative deeplearn.js backend.');
    }
    if (goBackwards) {
        inputs = tfc.reverse(inputs, 0);
    }
    var outputs;
    var lastOutput;
    var states = initialStates;
    var timeSteps = inputs.shape[0];
    for (var t = 0; t < timeSteps; ++t) {
        var currentInput = K.sliceAlongFirstAxis(inputs, t, 1);
        currentInput = currentInput.reshape(currentInput.shape.slice(1));
        var stepOutputs = stepFunction(currentInput, states);
        lastOutput = stepOutputs[0];
        if (t === 0) {
            outputs = lastOutput.reshape([1].concat(lastOutput.shape));
        }
        else {
            outputs = K.concatAlongFirstAxis(outputs, lastOutput.reshape([1].concat(lastOutput.shape)));
        }
        states = stepOutputs[1];
    }
    return [
        lastOutput,
        tfc.transpose(outputs, [1, 0].concat(math_utils.range(2, outputs.shape.length))),
        states
    ];
}
exports.rnn = rnn;
var RNN = (function (_super) {
    __extends(RNN, _super);
    function RNN(config) {
        var _this = _super.call(this, config) || this;
        var cell;
        if (config.cell == null) {
            throw new errors_1.ValueError('cell property is missing for the constructor of RNN.');
        }
        else if (Array.isArray(config.cell)) {
            cell = new StackedRNNCells({ cells: config.cell });
        }
        else {
            cell = config.cell;
        }
        if (cell.stateSize == null) {
            throw new errors_1.ValueError('The RNN cell should have an attribute `stateSize` (tuple of ' +
                'integers, one integer per RNN state).');
        }
        _this.cell = cell;
        _this.returnSequences =
            config.returnSequences == null ? false : config.returnSequences;
        _this.returnState = config.returnState == null ? false : config.returnState;
        _this.goBackwards = config.goBackwards == null ? false : config.goBackwards;
        _this._stateful = config.stateful == null ? false : config.stateful;
        _this.unroll = config.unroll == null ? false : config.unroll;
        _this.supportsMasking = true;
        _this.inputSpec = [new topology_1.InputSpec({ ndim: 3 })];
        _this.stateSpec = null;
        _this.states = null;
        _this.numConstants = null;
        return _this;
    }
    RNN.prototype.getStates = function () {
        if (this.states == null) {
            var numStates = Array.isArray(this.cell.stateSize) ? this.cell.stateSize.length : 1;
            return math_utils.range(0, numStates).map(function (x) { return null; });
        }
        else {
            return this.states;
        }
    };
    RNN.prototype.setStates = function (states) {
        this.states = states;
    };
    RNN.prototype.computeOutputShape = function (inputShape) {
        if (generic_utils.isArrayOfShapes(inputShape)) {
            inputShape = inputShape[0];
        }
        inputShape = inputShape;
        var stateSize = this.cell.stateSize;
        if (!Array.isArray(stateSize)) {
            stateSize = [stateSize];
        }
        var outputDim = stateSize[0];
        var outputShape;
        if (this.returnSequences) {
            outputShape = [inputShape[0], inputShape[1], outputDim];
        }
        else {
            outputShape = [inputShape[0], outputDim];
        }
        if (this.returnState) {
            var stateShape = [];
            for (var _i = 0, stateSize_1 = stateSize; _i < stateSize_1.length; _i++) {
                var dim = stateSize_1[_i];
                stateShape.push([inputShape[0], dim]);
            }
            return [outputShape].concat(stateShape);
        }
        else {
            return outputShape;
        }
    };
    RNN.prototype.computeMask = function (inputs, mask) {
        throw new errors_1.NotImplementedError('computeMask has not been implemented for RNN yet');
    };
    RNN.prototype.build = function (inputShape) {
        var constantShape = null;
        if (this.numConstants != null) {
            throw new errors_1.NotImplementedError('Constants support is not implemented in RNN yet.');
        }
        if (generic_utils.isArrayOfShapes(inputShape)) {
            inputShape = inputShape[0];
        }
        inputShape = inputShape;
        var batchSize = this.stateful ? inputShape[0] : null;
        var inputDim = inputShape[inputShape.length - 1];
        this.inputSpec[0] = new topology_1.InputSpec({ shape: [batchSize, null, inputDim] });
        var stepInputShape = [inputShape[0]].concat(inputShape.slice(2));
        if (constantShape != null) {
            throw new errors_1.NotImplementedError('Constants support is not implemented in RNN yet.');
        }
        else {
            this.cell.build(stepInputShape);
        }
        var stateSize;
        if (Array.isArray(this.cell.stateSize)) {
            stateSize = this.cell.stateSize;
        }
        else {
            stateSize = [this.cell.stateSize];
        }
        if (this.stateSpec != null) {
            if (!tfjs_core_1.util.arraysEqual(this.stateSpec.map(function (spec) { return spec.shape[spec.shape.length - 1]; }), stateSize)) {
                throw new errors_1.ValueError("An initialState was passed that is not compatible with " +
                    ("cell.stateSize. Received stateSpec=" + this.stateSpec + "; ") +
                    ("However cell.stateSize is " + this.cell.stateSize));
            }
        }
        else {
            this.stateSpec =
                stateSize.map(function (dim) { return new topology_1.InputSpec({ shape: [null, dim] }); });
        }
        if (this.stateful) {
            throw new errors_1.NotImplementedError('stateful RNN layer is not implemented yet');
        }
    };
    RNN.prototype.resetStates = function (states) {
        var _this = this;
        tfjs_core_1.tidy(function () {
            if (!_this.stateful) {
                throw new errors_1.AttributeError('Cannot call resetState() on an RNN Layer that is not stateful.');
            }
            var batchSize = _this.inputSpec[0].shape[0];
            if (batchSize == null) {
                throw new errors_1.ValueError('If an RNN is stateful, it needs to know its batch size. Specify ' +
                    'the batch size of your input tensors: \n' +
                    '- If using a Sequential model, specify the batch size by ' +
                    'passing a `batchInputShape` option to your first layer.\n' +
                    '- If using the functional API, specify the batch size by ' +
                    'passing a `batchShape` option to your Input layer.');
            }
            if (_this.states == null) {
                if (Array.isArray(_this.cell.stateSize)) {
                    _this.states =
                        _this.cell.stateSize.map(function (dim) { return tfc.zeros([batchSize, dim]); });
                }
                else {
                    _this.states = [tfc.zeros([batchSize, _this.cell.stateSize])];
                }
            }
            else if (states == null) {
                if (Array.isArray(_this.cell.stateSize)) {
                    _this.states =
                        _this.cell.stateSize.map(function (dim) { return tfc.zeros([batchSize, dim]); });
                }
                else {
                    _this.states[0] = tfc.zeros([batchSize, _this.cell.stateSize]);
                }
            }
            else {
                if (!Array.isArray(states)) {
                    states = [states];
                }
                if (states.length !== _this.states.length) {
                    throw new errors_1.ValueError("Layer " + _this.name + " expects " + _this.states.length + " state(s), " +
                        ("but it received " + states.length + " state value(s). Input ") +
                        ("received: " + states));
                }
                for (var index = 0; index < _this.states.length; ++index) {
                    var value = states[index];
                    var dim = Array.isArray(_this.cell.stateSize) ?
                        _this.cell.stateSize[index] :
                        _this.cell.stateSize;
                    var expectedShape = [batchSize, dim];
                    if (!tfjs_core_1.util.arraysEqual(value.shape, expectedShape)) {
                        throw new errors_1.ValueError("State " + index + " is incompatible with layer " + _this.name + ": " +
                            ("expected shape=" + expectedShape + ", received shape=" + value.shape));
                    }
                    _this.states[index] = value;
                }
            }
        });
    };
    RNN.prototype.standardizeArgs = function (inputs, initialState, constants) {
        if (Array.isArray(inputs)) {
            if (initialState != null || constants != null) {
                throw new errors_1.ValueError('When inputs is an array, neither initialState or constants ' +
                    'should be provided');
            }
            if (this.numConstants != null) {
                constants =
                    inputs.slice(inputs.length - this.numConstants, inputs.length);
                inputs = inputs.slice(0, inputs.length - this.numConstants);
            }
            if (inputs.length > 1) {
                initialState = inputs.slice(1, inputs.length);
            }
            inputs = inputs[0];
        }
        function toListOrNull(x) {
            if (x == null || Array.isArray(x)) {
                return x;
            }
            else {
                return [x];
            }
        }
        initialState = toListOrNull(initialState);
        constants = toListOrNull(constants);
        return { inputs: inputs, initialState: initialState, constants: constants };
    };
    RNN.prototype.apply = function (inputs, kwargs) {
        var initialState = kwargs == null ? null : kwargs['initialState'];
        var constants = kwargs == null ? null : kwargs['constants'];
        if (kwargs == null) {
            kwargs = {};
        }
        var standardized = this.standardizeArgs(inputs, initialState, constants);
        inputs = standardized.inputs;
        initialState = standardized.initialState;
        constants = standardized.constants;
        var additionalInputs = [];
        var additionalSpecs = [];
        if (initialState != null) {
            kwargs['initialState'] = initialState;
            additionalInputs = additionalInputs.concat(initialState);
            this.stateSpec = [];
            for (var _i = 0, initialState_1 = initialState; _i < initialState_1.length; _i++) {
                var state = initialState_1[_i];
                this.stateSpec.push(new topology_1.InputSpec({ shape: state.shape }));
            }
            additionalSpecs = additionalSpecs.concat(this.stateSpec);
        }
        if (constants != null) {
            kwargs['constants'] = constants;
            additionalInputs = additionalInputs.concat(constants);
            this.numConstants = constants.length;
        }
        var isTensor = additionalInputs[0] instanceof types_1.SymbolicTensor;
        if (isTensor) {
            var fullInput = [inputs].concat(additionalInputs);
            var fullInputSpec = this.inputSpec.concat(additionalSpecs);
            var originalInputSpec = this.inputSpec;
            this.inputSpec = fullInputSpec;
            var output = _super.prototype.apply.call(this, fullInput, kwargs);
            this.inputSpec = originalInputSpec;
            return output;
        }
        else {
            return _super.prototype.apply.call(this, inputs, kwargs);
        }
    };
    RNN.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var mask = kwargs == null ? null : kwargs['mask'];
            var training = kwargs == null ? null : kwargs['training'];
            var initialState = kwargs == null ? null : kwargs['initialState'];
            inputs = generic_utils.getExactlyOneTensor(inputs);
            if (initialState == null) {
                if (_this.stateful) {
                    throw new errors_1.NotImplementedError('stateful RNN layer is not implemented yet.');
                }
                else {
                    initialState = _this.getInitialState(inputs);
                }
            }
            if (mask != null) {
                throw new errors_1.NotImplementedError('Masking is not implemented for RNN yet');
            }
            var numStates = Array.isArray(_this.cell.stateSize) ? _this.cell.stateSize.length : 1;
            if (initialState.length !== numStates) {
                throw new errors_1.ValueError("RNN Layer has " + numStates + " state(s) but was passed " +
                    (initialState.length + " initial state(s)."));
            }
            var inputShape = inputs.shape;
            var timesteps = inputShape[1];
            if (_this.unroll) {
                console.warn('Ignoring unroll = true for RNN layer, due to imperative backend.');
            }
            var cellCallKwargs = { training: training };
            var step = function (inputs, states) {
                var outputs = _this.cell.call([inputs].concat(states), cellCallKwargs);
                return [outputs[0], outputs.slice(1)];
            };
            var rnnOutputs = rnn(step, inputs, initialState, _this.goBackwards, null, null, _this.unroll, timesteps);
            var lastOutput = rnnOutputs[0];
            var outputs = rnnOutputs[1];
            var states = rnnOutputs[2];
            if (_this.stateful) {
                throw new errors_1.NotImplementedError('stateful RNN layer is not implemented yet');
            }
            var output = _this.returnSequences ? outputs : lastOutput;
            if (_this.returnState) {
                return [output].concat(states);
            }
            else {
                return output;
            }
        });
    };
    RNN.prototype.getInitialState = function (inputs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var initialState = tfc.zeros(inputs.shape);
            initialState = tfc.sum(initialState, [1, 2]);
            initialState = K.expandDims(initialState);
            if (Array.isArray(_this.cell.stateSize)) {
                return _this.cell.stateSize.map(function (dim) { return dim > 1 ? K.tile(initialState, [1, dim]) : initialState; });
            }
            else {
                return _this.cell.stateSize > 1 ?
                    [K.tile(initialState, [1, _this.cell.stateSize])] :
                    [initialState];
            }
        });
    };
    Object.defineProperty(RNN.prototype, "trainableWeights", {
        get: function () {
            if (!this.trainable) {
                return [];
            }
            return this.cell.trainableWeights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RNN.prototype, "nonTrainableWeights", {
        get: function () {
            if (!this.trainable) {
                return this.cell.weights;
            }
            return this.cell.nonTrainableWeights;
        },
        enumerable: true,
        configurable: true
    });
    RNN.prototype.getConfig = function () {
        var config = {
            returnSequences: this.returnSequences,
            returnState: this.returnState,
            goBackwards: this.goBackwards,
            stateful: this.stateful,
            unroll: this.unroll,
        };
        if (this.numConstants != null) {
            config.numConstants = this.numConstants;
        }
        var cellConfig = this.cell.getConfig();
        config.cell = {
            className: this.cell.getClassName(),
            config: cellConfig,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    RNN.className = 'RNN';
    return RNN;
}(topology_2.Layer));
exports.RNN = RNN;
tfjs_core_1.serialization.SerializationMap.register(RNN);
var RNNCell = (function (_super) {
    __extends(RNNCell, _super);
    function RNNCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RNNCell = __decorate([
        tfjs_core_1.doc({ heading: 'Layers', subheading: 'Classes' })
    ], RNNCell);
    return RNNCell;
}(topology_2.Layer));
exports.RNNCell = RNNCell;
var SimpleRNNCell = (function (_super) {
    __extends(SimpleRNNCell, _super);
    function SimpleRNNCell(config) {
        var _this = _super.call(this, config) || this;
        _this.DEFAULT_ACTIVATION = 'tanh';
        _this.DEFAULT_KERNEL_INITIALIZER = 'glorotNormal';
        _this.DEFAULT_RECURRENT_INITIALIZER = 'orthogonal';
        _this.DEFAULT_BIAS_INITIALIZER = 'zeros';
        _this.units = config.units;
        _this.activation = activations_1.getActivation(config.activation == null ? _this.DEFAULT_ACTIVATION :
            config.activation);
        _this.useBias = config.useBias == null ? true : config.useBias;
        _this.kernelInitializer = initializers_1.getInitializer(config.kernelInitializer || _this.DEFAULT_KERNEL_INITIALIZER);
        _this.recurrentInitializer = initializers_1.getInitializer(config.recurrentInitializer || _this.DEFAULT_RECURRENT_INITIALIZER);
        _this.biasInitializer =
            initializers_1.getInitializer(config.biasInitializer || _this.DEFAULT_BIAS_INITIALIZER);
        _this.kernelRegularizer = regularizers_1.getRegularizer(config.kernelRegularizer);
        _this.recurrentRegularizer = regularizers_1.getRegularizer(config.recurrentRegularizer);
        _this.biasRegularizer = regularizers_1.getRegularizer(config.biasRegularizer);
        _this.kernelConstraint = constraints_1.getConstraint(config.kernelConstraint);
        _this.recurrentConstraint = constraints_1.getConstraint(config.recurrentConstraint);
        _this.biasConstraint = constraints_1.getConstraint(config.biasConstraint);
        _this.dropout = math_utils.min([1, math_utils.max([0, config.dropout == null ? 0 : config.dropout])]);
        _this.recurrentDropout = math_utils.min([
            1,
            math_utils.max([0, config.recurrentDropout == null ? 0 : config.recurrentDropout])
        ]);
        _this.stateSize = _this.units;
        return _this;
    }
    SimpleRNNCell.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        this.kernel = this.addWeight('kernel', [inputShape[inputShape.length - 1], this.units], null, this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
        this.recurrentKernel = this.addWeight('recurrent_kernel', [this.units, this.units], null, this.recurrentInitializer, this.recurrentRegularizer, true, this.recurrentConstraint);
        if (this.useBias) {
            this.bias = this.addWeight('bias', [this.units], null, this.biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        else {
            this.bias = null;
        }
        this.built = true;
    };
    SimpleRNNCell.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = inputs;
            if (inputs.length !== 2) {
                throw new errors_1.ValueError("SimpleRNNCell expects 2 input Tensors, got " + inputs.length + ".");
            }
            var prevOutput = inputs[1];
            inputs = inputs[0];
            if (_this.dropout !== 0 || _this.recurrentDropout !== 0) {
                throw new errors_1.NotImplementedError('Dropout is not implemented for SimpleRNNCell yet');
            }
            var h = K.dot(inputs, _this.kernel.read());
            if (_this.bias != null) {
                h = K.biasAdd(h, _this.bias.read());
            }
            var output = tfc.add(h, K.dot(prevOutput, _this.recurrentKernel.read()));
            if (_this.activation != null) {
                output = _this.activation.apply(output);
            }
            return [output, output];
        });
    };
    SimpleRNNCell.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            recurrentInitializer: initializers_1.serializeInitializer(this.recurrentInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            recurrentRegularizer: regularizers_1.serializeRegularizer(this.recurrentRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            recurrentConstraint: constraints_1.serializeConstraint(this.recurrentConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint),
            dropout: this.dropout,
            recurrentDropout: this.recurrentDropout,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    SimpleRNNCell.className = 'SimpleRNNCell';
    return SimpleRNNCell;
}(RNNCell));
exports.SimpleRNNCell = SimpleRNNCell;
tfjs_core_1.serialization.SerializationMap.register(SimpleRNNCell);
var SimpleRNN = (function (_super) {
    __extends(SimpleRNN, _super);
    function SimpleRNN(config) {
        var _this = this;
        config.cell = new SimpleRNNCell(config);
        _this = _super.call(this, config) || this;
        return _this;
    }
    SimpleRNN.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var mask = kwargs == null ? null : kwargs['mask'];
            var training = kwargs == null ? null : kwargs['training'];
            var initialState = kwargs == null ? null : kwargs['initialState'];
            return _super.prototype.call.call(_this, inputs, { mask: mask, training: training, initialState: initialState });
        });
    };
    Object.defineProperty(SimpleRNN.prototype, "units", {
        get: function () {
            return this.cell.units;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "activation", {
        get: function () {
            return this.cell.activation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "useBias", {
        get: function () {
            return this.cell.useBias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "kernelInitializer", {
        get: function () {
            return this.cell.kernelInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "recurrentInitializer", {
        get: function () {
            return this.cell.recurrentInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "biasInitializer", {
        get: function () {
            return this.cell.biasInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "kernelRegularizer", {
        get: function () {
            return this.cell.kernelRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "recurrentRegularizer", {
        get: function () {
            return this.cell.recurrentRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "biasRegularizer", {
        get: function () {
            return this.cell.biasRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "kernelConstraint", {
        get: function () {
            return this.cell.kernelConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "recurrentConstraint", {
        get: function () {
            return this.cell.recurrentConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "biasConstraint", {
        get: function () {
            return this.cell.biasConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "dropout", {
        get: function () {
            return this.cell.dropout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleRNN.prototype, "recurrentDropout", {
        get: function () {
            return this.cell.recurrentDropout;
        },
        enumerable: true,
        configurable: true
    });
    SimpleRNN.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            recurrentInitializer: initializers_1.serializeInitializer(this.recurrentInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            recurrentRegularizer: regularizers_1.serializeRegularizer(this.recurrentRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            recurrentConstraint: constraints_1.serializeConstraint(this.recurrentConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint),
            dropout: this.dropout,
            recurrentDropout: this.recurrentDropout,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        delete baseConfig['cell'];
        Object.assign(config, baseConfig);
        return config;
    };
    SimpleRNN.className = 'SimpleRNN';
    return SimpleRNN;
}(RNN));
exports.SimpleRNN = SimpleRNN;
tfjs_core_1.serialization.SerializationMap.register(SimpleRNN);
var GRUCell = (function (_super) {
    __extends(GRUCell, _super);
    function GRUCell(config) {
        var _this = _super.call(this, config) || this;
        _this.DEFAULT_ACTIVATION = 'tanh';
        _this.DEFAULT_RECURRENT_ACTIVATION = 'hardSigmoid';
        _this.DEFAULT_KERNEL_INITIALIZER = 'glorotNormal';
        _this.DEFAULT_RECURRENT_INITIALIZER = 'orthogonal';
        _this.DEFAULT_BIAS_INITIALIZER = 'zeros';
        _this.units = config.units;
        _this.activation = activations_1.getActivation(config.activation === undefined ? _this.DEFAULT_ACTIVATION :
            config.activation);
        _this.recurrentActivation = activations_1.getActivation(config.recurrentActivation === undefined ?
            _this.DEFAULT_RECURRENT_ACTIVATION :
            config.recurrentActivation);
        _this.useBias = config.useBias == null ? true : config.useBias;
        _this.kernelInitializer = initializers_1.getInitializer(config.kernelInitializer || _this.DEFAULT_KERNEL_INITIALIZER);
        _this.recurrentInitializer = initializers_1.getInitializer(config.recurrentInitializer || _this.DEFAULT_RECURRENT_INITIALIZER);
        _this.biasInitializer =
            initializers_1.getInitializer(config.biasInitializer || _this.DEFAULT_BIAS_INITIALIZER);
        _this.kernelRegularizer = regularizers_1.getRegularizer(config.kernelRegularizer);
        _this.recurrentRegularizer = regularizers_1.getRegularizer(config.recurrentRegularizer);
        _this.biasRegularizer = regularizers_1.getRegularizer(config.biasRegularizer);
        _this.kernelConstraint = constraints_1.getConstraint(config.kernelConstraint);
        _this.recurrentConstraint = constraints_1.getConstraint(config.recurrentConstraint);
        _this.biasConstraint = constraints_1.getConstraint(config.biasConstraint);
        _this.dropout = math_utils.min([1, math_utils.max([0, config.dropout == null ? 0 : config.dropout])]);
        _this.recurrentDropout = math_utils.min([
            1,
            math_utils.max([0, config.recurrentDropout == null ? 0 : config.recurrentDropout])
        ]);
        _this.implementation = config.implementation;
        _this.stateSize = _this.units;
        return _this;
    }
    GRUCell.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var inputDim = inputShape[inputShape.length - 1];
        this.kernel = this.addWeight('kernel', [inputDim, this.units * 3], null, this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
        this.recurrentKernel = this.addWeight('recurrent_kernel', [this.units, this.units * 3], null, this.recurrentInitializer, this.recurrentRegularizer, true, this.recurrentConstraint);
        if (this.useBias) {
            this.bias = this.addWeight('bias', [this.units * 3], null, this.biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        else {
            this.bias = null;
        }
        this.built = true;
    };
    GRUCell.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            if (_this.dropout !== 0 || _this.recurrentDropout !== 0) {
                throw new errors_1.NotImplementedError('Dropout is not implemented for GRUCell yet');
            }
            inputs = inputs;
            if (inputs.length !== 2) {
                throw new errors_1.ValueError("GRUCell expects 2 input Tensors (inputs, h, c), got " +
                    (inputs.length + "."));
            }
            var hTMinus1 = inputs[1];
            inputs = inputs[0];
            var z;
            var r;
            var hh;
            if (_this.implementation === 1) {
                var kernelZ = K.sliceAlongLastAxis(_this.kernel.read(), 0, _this.units);
                var kernelR = K.sliceAlongLastAxis(_this.kernel.read(), _this.units, _this.units);
                var kernelH = K.sliceAlongLastAxis(_this.kernel.read(), _this.units * 2, _this.units);
                var recurrentKernelZ = K.sliceAlongLastAxis(_this.recurrentKernel.read(), 0, _this.units);
                var recurrentKernelR = K.sliceAlongLastAxis(_this.recurrentKernel.read(), _this.units, _this.units);
                var recurrentKernelH = K.sliceAlongLastAxis(_this.recurrentKernel.read(), _this.units * 2, _this.units);
                var inputsZ = inputs;
                var inputsR = inputs;
                var inputsH = inputs;
                var xZ = K.dot(inputsZ, kernelZ);
                var xR = K.dot(inputsR, kernelR);
                var xH = K.dot(inputsH, kernelH);
                if (_this.useBias) {
                    var biasZ = K.sliceAlongFirstAxis(_this.bias.read(), 0, _this.units);
                    var biasR = K.sliceAlongFirstAxis(_this.bias.read(), _this.units, _this.units);
                    var biasH = K.sliceAlongFirstAxis(_this.bias.read(), _this.units * 2, _this.units);
                    xZ = K.biasAdd(xZ, biasZ);
                    xR = K.biasAdd(xR, biasR);
                    xH = K.biasAdd(xH, biasH);
                }
                var hTMinus1Z = hTMinus1;
                var hTMinus1R = hTMinus1;
                var hTMinus1H = hTMinus1;
                z = _this.recurrentActivation.apply(tfc.add(xZ, K.dot(hTMinus1Z, recurrentKernelZ)));
                r = _this.recurrentActivation.apply(tfc.add(xR, K.dot(hTMinus1R, recurrentKernelR)));
                hh = _this.activation.apply(tfc.add(xH, K.dot(tfc.mul(r, hTMinus1H), recurrentKernelH)));
            }
            else {
                var matrixX = K.dot(inputs, _this.kernel.read());
                if (_this.useBias) {
                    matrixX = K.biasAdd(matrixX, _this.bias.read());
                }
                var matrixInner = K.dot(hTMinus1, K.sliceAlongLastAxis(_this.recurrentKernel.read(), 0, 2 * _this.units));
                var xZ = K.sliceAlongLastAxis(matrixX, 0, _this.units);
                var xR = K.sliceAlongLastAxis(matrixX, _this.units, _this.units);
                var recurrentZ = K.sliceAlongLastAxis(matrixInner, 0, _this.units);
                var recurrentR = K.sliceAlongLastAxis(matrixInner, _this.units, _this.units);
                z = _this.recurrentActivation.apply(tfc.add(xZ, recurrentZ));
                r = _this.recurrentActivation.apply(tfc.add(xR, recurrentR));
                var xH = K.sliceAlongLastAxis(matrixX, 2 * _this.units, _this.units);
                var recurrentH = K.dot(tfc.mul(r, hTMinus1), K.sliceAlongLastAxis(_this.recurrentKernel.read(), 2 * _this.units, _this.units));
                hh = _this.activation.apply(tfc.add(xH, recurrentH));
            }
            var h = tfc.add(tfc.mul(z, hTMinus1), tfc.mul(K.scalarPlusArray(K.getScalar(1), tfc.neg(z)), hh));
            return [h, h];
        });
    };
    GRUCell.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            recurrentActivation: activations_1.serializeActivation(this.recurrentActivation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            recurrentInitializer: initializers_1.serializeInitializer(this.recurrentInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            recurrentRegularizer: regularizers_1.serializeRegularizer(this.recurrentRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            recurrentConstraint: constraints_1.serializeConstraint(this.recurrentConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint),
            dropout: this.dropout,
            recurrentDropout: this.recurrentDropout,
            implementation: this.implementation,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    GRUCell.className = 'GRUCell';
    return GRUCell;
}(RNNCell));
exports.GRUCell = GRUCell;
tfjs_core_1.serialization.SerializationMap.register(GRUCell);
var GRU = (function (_super) {
    __extends(GRU, _super);
    function GRU(config) {
        var _this = this;
        if (config.implementation === 0) {
            console.warn('`implementation=0` has been deprecated, and now defaults to ' +
                '`implementation=1`. Please update your layer call.');
        }
        config.cell = new GRUCell(config);
        _this = _super.call(this, config) || this;
        return _this;
    }
    GRU.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var mask = kwargs == null ? null : kwargs['mask'];
            var training = kwargs == null ? null : kwargs['training'];
            var initialState = kwargs == null ? null : kwargs['initialState'];
            return _super.prototype.call.call(_this, inputs, { mask: mask, training: training, initialState: initialState });
        });
    };
    Object.defineProperty(GRU.prototype, "units", {
        get: function () {
            return this.cell.units;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "activation", {
        get: function () {
            return this.cell.activation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "recurrentActivation", {
        get: function () {
            return this.cell.recurrentActivation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "useBias", {
        get: function () {
            return this.cell.useBias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "kernelInitializer", {
        get: function () {
            return this.cell.kernelInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "recurrentInitializer", {
        get: function () {
            return this.cell.recurrentInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "biasInitializer", {
        get: function () {
            return this.cell.biasInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "kernelRegularizer", {
        get: function () {
            return this.cell.kernelRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "recurrentRegularizer", {
        get: function () {
            return this.cell.recurrentRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "biasRegularizer", {
        get: function () {
            return this.cell.biasRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "kernelConstraint", {
        get: function () {
            return this.cell.kernelConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "recurrentConstraint", {
        get: function () {
            return this.cell.recurrentConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "biasConstraint", {
        get: function () {
            return this.cell.biasConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "dropout", {
        get: function () {
            return this.cell.dropout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "recurrentDropout", {
        get: function () {
            return this.cell.recurrentDropout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GRU.prototype, "implementation", {
        get: function () {
            return this.cell.implementation;
        },
        enumerable: true,
        configurable: true
    });
    GRU.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            recurrentActivation: activations_1.serializeActivation(this.recurrentActivation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            recurrentInitializer: initializers_1.serializeInitializer(this.recurrentInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            recurrentRegularizer: regularizers_1.serializeRegularizer(this.recurrentRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            recurrentConstraint: constraints_1.serializeConstraint(this.recurrentConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint),
            dropout: this.dropout,
            recurrentDropout: this.recurrentDropout,
            implementation: this.implementation,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        delete baseConfig['cell'];
        Object.assign(config, baseConfig);
        return config;
    };
    GRU.fromConfig = function (cls, config) {
        if (config['implmentation'] === 0) {
            config['implementation'] = 1;
        }
        return new cls(config);
    };
    GRU.className = 'GRU';
    return GRU;
}(RNN));
exports.GRU = GRU;
tfjs_core_1.serialization.SerializationMap.register(GRU);
var LSTMCell = (function (_super) {
    __extends(LSTMCell, _super);
    function LSTMCell(config) {
        var _this = _super.call(this, config) || this;
        _this.DEFAULT_ACTIVATION = 'tanh';
        _this.DEFAULT_RECURRENT_ACTIVATION = 'hardSigmoid';
        _this.DEFAULT_KERNEL_INITIALIZER = 'glorotNormal';
        _this.DEFAULT_RECURRENT_INITIALIZER = 'orthogonal';
        _this.DEFAULT_BIAS_INITIALIZER = 'zeros';
        _this.units = config.units;
        _this.activation = activations_1.getActivation(config.activation === undefined ? _this.DEFAULT_ACTIVATION :
            config.activation);
        _this.recurrentActivation = activations_1.getActivation(config.recurrentActivation === undefined ?
            _this.DEFAULT_RECURRENT_ACTIVATION :
            config.recurrentActivation);
        _this.useBias = config.useBias == null ? true : config.useBias;
        _this.kernelInitializer = initializers_1.getInitializer(config.kernelInitializer || _this.DEFAULT_KERNEL_INITIALIZER);
        _this.recurrentInitializer = initializers_1.getInitializer(config.recurrentInitializer || _this.DEFAULT_RECURRENT_INITIALIZER);
        _this.biasInitializer =
            initializers_1.getInitializer(config.biasInitializer || _this.DEFAULT_BIAS_INITIALIZER);
        _this.unitForgetBias = config.unitForgetBias;
        _this.kernelRegularizer = regularizers_1.getRegularizer(config.kernelRegularizer);
        _this.recurrentRegularizer = regularizers_1.getRegularizer(config.recurrentRegularizer);
        _this.biasRegularizer = regularizers_1.getRegularizer(config.biasRegularizer);
        _this.kernelConstraint = constraints_1.getConstraint(config.kernelConstraint);
        _this.recurrentConstraint = constraints_1.getConstraint(config.recurrentConstraint);
        _this.biasConstraint = constraints_1.getConstraint(config.biasConstraint);
        _this.dropout = math_utils.min([1, math_utils.max([0, config.dropout == null ? 0 : config.dropout])]);
        _this.recurrentDropout = math_utils.min([
            1,
            math_utils.max([0, config.recurrentDropout == null ? 0 : config.recurrentDropout])
        ]);
        _this.implementation = config.implementation;
        _this.stateSize = [_this.units, _this.units];
        return _this;
    }
    LSTMCell.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var inputDim = inputShape[inputShape.length - 1];
        this.kernel = this.addWeight('kernel', [inputDim, this.units * 4], null, this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
        this.recurrentKernel = this.addWeight('recurrent_kernel', [this.units, this.units * 4], null, this.recurrentInitializer, this.recurrentRegularizer, true, this.recurrentConstraint);
        var biasInitializer;
        if (this.useBias) {
            if (this.unitForgetBias) {
                var capturedBiasInit_1 = this.biasInitializer;
                var capturedUnits_1 = this.units;
                biasInitializer = new (_a = (function (_super) {
                        __extends(CustomInit, _super);
                        function CustomInit() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        CustomInit.prototype.apply = function (shape, dtype) {
                            var bI = capturedBiasInit_1.apply([capturedUnits_1]);
                            var bF = (new initializers_1.Ones()).apply([capturedUnits_1]);
                            var bCAndH = capturedBiasInit_1.apply([capturedUnits_1 * 2]);
                            return K.concatAlongFirstAxis(K.concatAlongFirstAxis(bI, bF), bCAndH);
                        };
                        return CustomInit;
                    }(initializers_1.Initializer)),
                    _a.className = 'CustomInit',
                    _a)();
            }
            else {
                biasInitializer = this.biasInitializer;
            }
            this.bias = this.addWeight('bias', [this.units * 4], null, biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        else {
            this.bias = null;
        }
        this.built = true;
        var _a;
    };
    LSTMCell.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            if (_this.dropout !== 0 || _this.recurrentDropout !== 0) {
                throw new errors_1.NotImplementedError('Dropout is not implemented for LSTMCell yet');
            }
            inputs = inputs;
            if (inputs.length !== 3) {
                throw new errors_1.ValueError("LSTMCell expects 3 input Tensors (inputs, h, c), got " +
                    (inputs.length + "."));
            }
            var hTMinus1 = inputs[1];
            var cTMinus1 = inputs[2];
            inputs = inputs[0];
            var i;
            var f;
            var c;
            var o;
            if (_this.implementation === 1) {
                var kernelI = K.sliceAlongLastAxis(_this.kernel.read(), 0, _this.units);
                var kernelF = K.sliceAlongLastAxis(_this.kernel.read(), _this.units, _this.units);
                var kernelC = K.sliceAlongLastAxis(_this.kernel.read(), _this.units * 2, _this.units);
                var kernelO = K.sliceAlongLastAxis(_this.kernel.read(), _this.units * 3, _this.units);
                var recurrentKernelI = K.sliceAlongLastAxis(_this.recurrentKernel.read(), 0, _this.units);
                var recurrentKernelF = K.sliceAlongLastAxis(_this.recurrentKernel.read(), _this.units, _this.units);
                var recurrentKernelC = K.sliceAlongLastAxis(_this.recurrentKernel.read(), _this.units * 2, _this.units);
                var recurrentKernelO = K.sliceAlongLastAxis(_this.recurrentKernel.read(), _this.units * 3, _this.units);
                var inputsI = inputs;
                var inputsF = inputs;
                var inputsC = inputs;
                var inputsO = inputs;
                var xI = K.dot(inputsI, kernelI);
                var xF = K.dot(inputsF, kernelF);
                var xC = K.dot(inputsC, kernelC);
                var xO = K.dot(inputsO, kernelO);
                if (_this.useBias) {
                    var biasI = K.sliceAlongFirstAxis(_this.bias.read(), 0, _this.units);
                    var biasF = K.sliceAlongFirstAxis(_this.bias.read(), _this.units, _this.units);
                    var biasC = K.sliceAlongFirstAxis(_this.bias.read(), _this.units * 2, _this.units);
                    var biasO = K.sliceAlongFirstAxis(_this.bias.read(), _this.units * 3, _this.units);
                    xI = K.biasAdd(xI, biasI);
                    xF = K.biasAdd(xF, biasF);
                    xC = K.biasAdd(xC, biasC);
                    xO = K.biasAdd(xO, biasO);
                }
                var hTMinus1I = hTMinus1;
                var hTMinus1F = hTMinus1;
                var hTMinus1C = hTMinus1;
                var hTMinus1O = hTMinus1;
                i = _this.recurrentActivation.apply(tfc.add(xI, K.dot(hTMinus1I, recurrentKernelI)));
                f = _this.recurrentActivation.apply(tfc.add(xF, K.dot(hTMinus1F, recurrentKernelF)));
                c = tfc.add(tfc.mul(f, cTMinus1), tfc.mul(i, _this.activation.apply(tfc.add(xC, K.dot(hTMinus1C, recurrentKernelC)))));
                o = _this.recurrentActivation.apply(tfc.add(xO, K.dot(hTMinus1O, recurrentKernelO)));
            }
            else {
                var z = K.dot(inputs, _this.kernel.read());
                z = tfc.add(z, K.dot(hTMinus1, _this.recurrentKernel.read()));
                if (_this.useBias) {
                    z = K.biasAdd(z, _this.bias.read());
                }
                var z0 = K.sliceAlongLastAxis(z, 0, _this.units);
                var z1 = K.sliceAlongLastAxis(z, _this.units, _this.units);
                var z2 = K.sliceAlongLastAxis(z, _this.units * 2, _this.units);
                var z3 = K.sliceAlongLastAxis(z, _this.units * 3, _this.units);
                i = _this.recurrentActivation.apply(z0);
                f = _this.recurrentActivation.apply(z1);
                c = tfc.add(tfc.mul(f, cTMinus1), tfc.mul(i, _this.activation.apply(z2)));
                o = _this.recurrentActivation.apply(z3);
            }
            var h = tfc.mul(o, _this.activation.apply(c));
            return [h, h, c];
        });
    };
    LSTMCell.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            recurrentActivation: activations_1.serializeActivation(this.recurrentActivation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            recurrentInitializer: initializers_1.serializeInitializer(this.recurrentInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            unitForgetBias: this.unitForgetBias,
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            recurrentRegularizer: regularizers_1.serializeRegularizer(this.recurrentRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            recurrentConstraint: constraints_1.serializeConstraint(this.recurrentConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint),
            dropout: this.dropout,
            recurrentDropout: this.recurrentDropout,
            implementation: this.implementation,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    LSTMCell.className = 'LSTMCell';
    return LSTMCell;
}(RNNCell));
exports.LSTMCell = LSTMCell;
tfjs_core_1.serialization.SerializationMap.register(LSTMCell);
var LSTM = (function (_super) {
    __extends(LSTM, _super);
    function LSTM(config) {
        var _this = this;
        if (config.implementation === 0) {
            console.warn('`implementation=0` has been deprecated, and now defaults to ' +
                '`implementation=1`. Please update your layer call.');
        }
        config.cell = new LSTMCell(config);
        _this = _super.call(this, config) || this;
        return _this;
    }
    LSTM.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var mask = kwargs == null ? null : kwargs['mask'];
            var training = kwargs == null ? null : kwargs['training'];
            var initialState = kwargs == null ? null : kwargs['initialState'];
            return _super.prototype.call.call(_this, inputs, { mask: mask, training: training, initialState: initialState });
        });
    };
    Object.defineProperty(LSTM.prototype, "units", {
        get: function () {
            return this.cell.units;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "activation", {
        get: function () {
            return this.cell.activation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "recurrentActivation", {
        get: function () {
            return this.cell.recurrentActivation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "useBias", {
        get: function () {
            return this.cell.useBias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "kernelInitializer", {
        get: function () {
            return this.cell.kernelInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "recurrentInitializer", {
        get: function () {
            return this.cell.recurrentInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "biasInitializer", {
        get: function () {
            return this.cell.biasInitializer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "unitForgetBias", {
        get: function () {
            return this.cell.unitForgetBias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "kernelRegularizer", {
        get: function () {
            return this.cell.kernelRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "recurrentRegularizer", {
        get: function () {
            return this.cell.recurrentRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "biasRegularizer", {
        get: function () {
            return this.cell.biasRegularizer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "kernelConstraint", {
        get: function () {
            return this.cell.kernelConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "recurrentConstraint", {
        get: function () {
            return this.cell.recurrentConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "biasConstraint", {
        get: function () {
            return this.cell.biasConstraint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "dropout", {
        get: function () {
            return this.cell.dropout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "recurrentDropout", {
        get: function () {
            return this.cell.recurrentDropout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LSTM.prototype, "implementation", {
        get: function () {
            return this.cell.implementation;
        },
        enumerable: true,
        configurable: true
    });
    LSTM.prototype.getConfig = function () {
        var config = {
            units: this.units,
            activation: activations_1.serializeActivation(this.activation),
            recurrentActivation: activations_1.serializeActivation(this.recurrentActivation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            recurrentInitializer: initializers_1.serializeInitializer(this.recurrentInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            unitForgetBias: this.unitForgetBias,
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            recurrentRegularizer: regularizers_1.serializeRegularizer(this.recurrentRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            recurrentConstraint: constraints_1.serializeConstraint(this.recurrentConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint),
            dropout: this.dropout,
            recurrentDropout: this.recurrentDropout,
            implementation: this.implementation,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        delete baseConfig['cell'];
        Object.assign(config, baseConfig);
        return config;
    };
    LSTM.fromConfig = function (cls, config) {
        if (config['implmentation'] === 0) {
            config['implementation'] = 1;
        }
        return new cls(config);
    };
    LSTM.className = 'LSTM';
    return LSTM;
}(RNN));
exports.LSTM = LSTM;
tfjs_core_1.serialization.SerializationMap.register(LSTM);
var StackedRNNCells = (function (_super) {
    __extends(StackedRNNCells, _super);
    function StackedRNNCells(config) {
        var _this = _super.call(this, config) || this;
        _this.cells = config.cells;
        return _this;
    }
    Object.defineProperty(StackedRNNCells.prototype, "stateSize", {
        get: function () {
            var stateSize = [];
            for (var _i = 0, _a = this.cells.slice().reverse(); _i < _a.length; _i++) {
                var cell = _a[_i];
                if (Array.isArray(cell.stateSize)) {
                    stateSize.push.apply(stateSize, cell.stateSize);
                }
                else {
                    stateSize.push(cell.stateSize);
                }
            }
            return stateSize;
        },
        enumerable: true,
        configurable: true
    });
    StackedRNNCells.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = inputs;
            var states = inputs.slice(1);
            var nestedStates = [];
            for (var _i = 0, _a = _this.cells.slice().reverse(); _i < _a.length; _i++) {
                var cell = _a[_i];
                if (Array.isArray(cell.stateSize)) {
                    nestedStates.push(states.splice(0, cell.stateSize.length));
                }
                else {
                    nestedStates.push(states.splice(0, 1));
                }
            }
            nestedStates.reverse();
            var newNestedStates = [];
            var callInputs;
            for (var i = 0; i < _this.cells.length; ++i) {
                var cell = _this.cells[i];
                states = nestedStates[i];
                if (i === 0) {
                    callInputs = [inputs[0]].concat(states);
                }
                else {
                    callInputs = [callInputs[0]].concat(states);
                }
                callInputs = cell.call(callInputs, kwargs);
                newNestedStates.push(callInputs.slice(1));
            }
            states = [];
            for (var _b = 0, _c = newNestedStates.slice().reverse(); _b < _c.length; _b++) {
                var cellStates = _c[_b];
                states.push.apply(states, cellStates);
            }
            return [callInputs[0]].concat(states);
        });
    };
    StackedRNNCells.prototype.build = function (inputShape) {
        if (generic_utils.isArrayOfShapes(inputShape)) {
            inputShape = inputShape[0];
        }
        inputShape = inputShape;
        var outputDim;
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.build(inputShape);
            if (Array.isArray(cell.stateSize)) {
                outputDim = cell.stateSize[0];
            }
            else {
                outputDim = cell.stateSize;
            }
            inputShape = [inputShape[0], outputDim];
        }
        this.built = true;
    };
    StackedRNNCells.prototype.getConfig = function () {
        var cellConfigs = [];
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            cellConfigs.push({
                'className': this.getClassName(),
                'config': cell.getConfig(),
            });
        }
        var config = { 'cells': cellConfigs };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    StackedRNNCells.fromConfig = function (cls, config, customObjects) {
        if (customObjects === void 0) { customObjects = {}; }
        var cells = [];
        for (var _i = 0, _a = config['cells']; _i < _a.length; _i++) {
            var cellConfig = _a[_i];
            cells.push(serialization_1.deserialize(cellConfig, customObjects));
        }
        return new cls({ cells: cells });
    };
    Object.defineProperty(StackedRNNCells.prototype, "trainableWeights", {
        get: function () {
            if (!this.trainable) {
                return [];
            }
            var weights = [];
            for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
                var cell = _a[_i];
                weights.push.apply(weights, cell.trainableWeights);
            }
            return weights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackedRNNCells.prototype, "nonTrainableWeights", {
        get: function () {
            var weights = [];
            for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
                var cell = _a[_i];
                weights.push.apply(weights, cell.nonTrainableWeights);
            }
            if (!this.trainable) {
                var trainableWeights = [];
                for (var _b = 0, _c = this.cells; _b < _c.length; _b++) {
                    var cell = _c[_b];
                    trainableWeights.push.apply(trainableWeights, cell.trainableWeights);
                }
                return trainableWeights.concat(weights);
            }
            return weights;
        },
        enumerable: true,
        configurable: true
    });
    StackedRNNCells.prototype.getWeights = function () {
        var weights = [];
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            weights.push.apply(weights, cell.weights);
        }
        return variables_1.batchGetValue(weights);
    };
    StackedRNNCells.prototype.setWeights = function (weights) {
        var tuples = [];
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            var numParams = cell.weights.length;
            var inputWeights = weights.splice(numParams);
            for (var i = 0; i < cell.weights.length; ++i) {
                tuples.push([cell.weights[i], inputWeights[i]]);
            }
        }
        variables_1.batchSetValue(tuples);
    };
    StackedRNNCells.className = 'StackedRNNCells';
    return StackedRNNCells;
}(RNNCell));
exports.StackedRNNCells = StackedRNNCells;
tfjs_core_1.serialization.SerializationMap.register(StackedRNNCells);
//# sourceMappingURL=recurrent.js.map