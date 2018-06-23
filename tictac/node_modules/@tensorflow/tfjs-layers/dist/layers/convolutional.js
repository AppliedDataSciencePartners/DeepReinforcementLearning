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
var activations_1 = require("../activations");
var common_1 = require("../backend/common");
var K = require("../backend/tfjs_backend");
var common_2 = require("../common");
var constraints_1 = require("../constraints");
var topology_1 = require("../engine/topology");
var errors_1 = require("../errors");
var initializers_1 = require("../initializers");
var regularizers_1 = require("../regularizers");
var conv_utils_1 = require("../utils/conv_utils");
var generic_utils = require("../utils/generic_utils");
function preprocessConv2DInput(x, dataFormat) {
    return tfjs_core_1.tidy(function () {
        common_2.checkDataFormat(dataFormat);
        if (dataFormat === 'channelsFirst') {
            return tfc.transpose(x, [0, 2, 3, 1]);
        }
        else {
            return x;
        }
    });
}
exports.preprocessConv2DInput = preprocessConv2DInput;
function conv1dWithBias(x, kernel, bias, strides, padding, dataFormat, dilationRate) {
    if (strides === void 0) { strides = 1; }
    if (padding === void 0) { padding = 'valid'; }
    if (dilationRate === void 0) { dilationRate = 1; }
    return tfjs_core_1.tidy(function () {
        if (dataFormat == null) {
            dataFormat = common_1.imageDataFormat();
        }
        common_2.checkDataFormat(dataFormat);
        if (x.shape.length !== 3) {
            throw new errors_1.ValueError("The input of a conv1dWithBias operation should be 3, but is " +
                (x.shape.length + " instead."));
        }
        if (kernel.shape.length !== 3) {
            throw new errors_1.ValueError("The kernel for a conv1dWithBias operation should be 3, but is " +
                (kernel.shape.length + " instead"));
        }
        if (bias != null && bias.shape.length !== 1) {
            throw new errors_1.ValueError("The bias for a conv1dWithBias operation should be 1, but is " +
                (kernel.shape.length + " instead"));
        }
        if (dataFormat === 'channelsFirst') {
            x = tfc.transpose(x, [0, 2, 1]);
        }
        if (padding === 'causal') {
            throw new errors_1.NotImplementedError('The support for CAUSAL padding mode in conv1dWithBias is not ' +
                'implemented yet.');
        }
        var y = tfc.conv1d(x, kernel, strides, padding === 'same' ? 'same' : 'valid', 'NWC', dilationRate);
        if (bias != null) {
            y = K.biasAdd(y, bias);
        }
        return y;
    });
}
exports.conv1dWithBias = conv1dWithBias;
function conv1d(x, kernel, strides, padding, dataFormat, dilationRate) {
    if (strides === void 0) { strides = 1; }
    if (padding === void 0) { padding = 'valid'; }
    if (dilationRate === void 0) { dilationRate = 1; }
    return tfjs_core_1.tidy(function () {
        common_2.checkDataFormat(dataFormat);
        return conv1dWithBias(x, kernel, null, strides, padding, dataFormat, dilationRate);
    });
}
exports.conv1d = conv1d;
function conv2d(x, kernel, strides, padding, dataFormat, dilationRate) {
    if (strides === void 0) { strides = [1, 1]; }
    if (padding === void 0) { padding = 'valid'; }
    return tfjs_core_1.tidy(function () {
        common_2.checkDataFormat(dataFormat);
        return conv2dWithBias(x, kernel, null, strides, padding, dataFormat, dilationRate);
    });
}
exports.conv2d = conv2d;
function conv2dWithBias(x, kernel, bias, strides, padding, dataFormat, dilationRate) {
    if (strides === void 0) { strides = [1, 1]; }
    if (padding === void 0) { padding = 'valid'; }
    return tfjs_core_1.tidy(function () {
        if (dataFormat == null) {
            dataFormat = common_1.imageDataFormat();
        }
        common_2.checkDataFormat(dataFormat);
        if (x.rank !== 3 && x.rank !== 4) {
            throw new errors_1.ValueError("conv2dWithBias expects input to be of rank 3 or 4, but received " +
                (x.rank + "."));
        }
        if (kernel.rank !== 3 && kernel.rank !== 4) {
            throw new errors_1.ValueError("conv2dWithBias expects kernel to be of rank 3 or 4, but received " +
                (x.rank + "."));
        }
        var y = preprocessConv2DInput(x, dataFormat);
        if (padding === 'causal') {
            throw new errors_1.NotImplementedError('The support for CAUSAL padding mode in conv1dWithBias is not ' +
                'implemented yet.');
        }
        y = tfc.conv2d(y, kernel, strides, padding === 'same' ? 'same' : 'valid', 'NHWC', dilationRate);
        if (bias != null) {
            y = K.biasAdd(y, bias);
        }
        if (dataFormat === 'channelsFirst') {
            y = tfc.transpose(y, [0, 3, 1, 2]);
        }
        return y;
    });
}
exports.conv2dWithBias = conv2dWithBias;
var BaseConv = (function (_super) {
    __extends(BaseConv, _super);
    function BaseConv(rank, config) {
        var _this = _super.call(this, config) || this;
        _this.bias = null;
        _this.DEFAULT_KERNEL_INITIALIZER = 'glorotNormal';
        _this.DEFAULT_BIAS_INITIALIZER = 'zeros';
        BaseConv.verifyConfig(config);
        _this.rank = rank;
        if (_this.rank !== 1 && _this.rank !== 2) {
            throw new errors_1.NotImplementedError("Convolution layer for rank other than 1 or 2 (" + _this.rank + ") is " +
                "not implemented yet.");
        }
        _this.kernelSize = conv_utils_1.normalizeArray(config.kernelSize, rank, 'kernelSize');
        _this.strides = conv_utils_1.normalizeArray(config.strides == null ? 1 : config.strides, rank, 'strides');
        _this.padding = config.padding == null ? 'valid' : config.padding;
        common_2.checkPaddingMode(_this.padding);
        _this.dataFormat =
            config.dataFormat == null ? 'channelsLast' : config.dataFormat;
        common_2.checkDataFormat(_this.dataFormat);
        _this.activation = activations_1.getActivation(config.activation);
        _this.useBias = config.useBias == null ? true : config.useBias;
        _this.biasInitializer =
            initializers_1.getInitializer(config.biasInitializer || _this.DEFAULT_BIAS_INITIALIZER);
        _this.biasConstraint = constraints_1.getConstraint(config.biasConstraint);
        _this.biasRegularizer = regularizers_1.getRegularizer(config.biasRegularizer);
        _this.activityRegularizer = regularizers_1.getRegularizer(config.activityRegularizer);
        _this.dilationRate = config.dilationRate == null ? 1 : config.dilationRate;
        if (_this.rank === 1 &&
            (Array.isArray(_this.dilationRate) &&
                _this.dilationRate.length !== 1)) {
            throw new errors_1.ValueError("dilationRate must be a number or an array of a single number " +
                "for 1D convolution, but received " +
                ("" + JSON.stringify(_this.dilationRate)));
        }
        if (_this.rank === 2) {
            if (typeof _this.dilationRate === 'number') {
                _this.dilationRate = [_this.dilationRate, _this.dilationRate];
            }
            else if (_this.dilationRate.length !== 2) {
                throw new errors_1.ValueError("dilationRate must be a number or array of two numbers for 2D " +
                    ("convolution, but received " + JSON.stringify(_this.dilationRate)));
            }
        }
        return _this;
    }
    BaseConv.verifyConfig = function (config) {
        generic_utils.assert('kernelSize' in config, "required key 'kernelSize' not in config");
        if (typeof config.kernelSize !== 'number' &&
            !generic_utils.checkArrayTypeAndLength(config.kernelSize, 'number', 1, 2))
            throw new errors_1.ValueError("BaseConv expects config.kernelSize to be number or number[] with " +
                ("length 1 or 2, but received " + JSON.stringify(config.kernelSize) + "."));
    };
    return BaseConv;
}(topology_1.Layer));
exports.BaseConv = BaseConv;
var Conv = (function (_super) {
    __extends(Conv, _super);
    function Conv(rank, config) {
        var _this = _super.call(this, rank, config) || this;
        _this.kernel = null;
        Conv.verifyConfig(config);
        _this.filters = config.filters;
        _this.kernelInitializer = initializers_1.getInitializer(config.kernelInitializer || _this.DEFAULT_KERNEL_INITIALIZER);
        _this.kernelConstraint = constraints_1.getConstraint(config.kernelConstraint);
        _this.kernelRegularizer = regularizers_1.getRegularizer(config.kernelRegularizer);
        return _this;
    }
    Conv.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var channelAxis = this.dataFormat === 'channelsFirst' ? 1 : inputShape.length - 1;
        if (inputShape[channelAxis] == null) {
            throw new errors_1.ValueError("The channel dimension of the input should be defined. " +
                ("Found " + inputShape[channelAxis]));
        }
        var inputDim = inputShape[channelAxis];
        var kernelShape = this.kernelSize.concat([inputDim, this.filters]);
        this.kernel = this.addWeight('kernel', kernelShape, null, this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
        if (this.useBias) {
            this.bias = this.addWeight('bias', [this.filters], null, this.biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        this.inputSpec = [{ ndim: this.rank + 2, axes: (_a = {}, _a[channelAxis] = inputDim, _a) }];
        this.built = true;
        var _a;
    };
    Conv.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils.getExactlyOneTensor(inputs);
            var outputs;
            var biasValue = _this.bias == null ? null : _this.bias.read();
            if (_this.rank === 1) {
                outputs = conv1dWithBias(inputs, _this.kernel.read(), biasValue, _this.strides[0], _this.padding, _this.dataFormat, _this.dilationRate);
            }
            else if (_this.rank === 2) {
                outputs = conv2dWithBias(inputs, _this.kernel.read(), biasValue, _this.strides, _this.padding, _this.dataFormat, _this.dilationRate);
            }
            else if (_this.rank === 3) {
                throw new errors_1.NotImplementedError('3D convolution is not implemented yet.');
            }
            if (_this.activation != null) {
                outputs = _this.activation.apply(outputs);
            }
            return outputs;
        });
    };
    Conv.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var newSpace = [];
        var space = (this.dataFormat === 'channelsLast') ?
            inputShape.slice(1, inputShape.length - 1) :
            inputShape.slice(2);
        for (var i = 0; i < space.length; ++i) {
            var newDim = conv_utils_1.convOutputLength(space[i], this.kernelSize[i], this.padding, this.strides[i], typeof this.dilationRate === 'number' ? this.dilationRate :
                this.dilationRate[i]);
            newSpace.push(newDim);
        }
        var outputShape = [inputShape[0]];
        if (this.dataFormat === 'channelsLast') {
            outputShape = outputShape.concat(newSpace);
            outputShape.push(this.filters);
        }
        else {
            outputShape.push(this.filters);
            outputShape = outputShape.concat(newSpace);
        }
        return outputShape;
    };
    Conv.prototype.getConfig = function () {
        var config = {
            rank: this.rank,
            filters: this.filters,
            kernelSize: this.kernelSize,
            strides: this.strides,
            padding: this.padding,
            dataFormat: this.dataFormat,
            dilationRate: this.dilationRate,
            activation: activations_1.serializeActivation(this.activation),
            useBias: this.useBias,
            kernelInitializer: initializers_1.serializeInitializer(this.kernelInitializer),
            biasInitializer: initializers_1.serializeInitializer(this.biasInitializer),
            kernelRegularizer: regularizers_1.serializeRegularizer(this.kernelRegularizer),
            biasRegularizer: regularizers_1.serializeRegularizer(this.biasRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            kernelConstraint: constraints_1.serializeConstraint(this.kernelConstraint),
            biasConstraint: constraints_1.serializeConstraint(this.biasConstraint)
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Conv.verifyConfig = function (config) {
        if (!('filters' in config) || typeof config.filters !== 'number' ||
            config.filters < 1) {
            throw new errors_1.ValueError("Convolution layer expected config.filters to be a 'number' > 0 " +
                ("but got " + JSON.stringify(config.filters)));
        }
    };
    return Conv;
}(BaseConv));
exports.Conv = Conv;
var Conv2D = (function (_super) {
    __extends(Conv2D, _super);
    function Conv2D(config) {
        var _this = _super.call(this, 2, config) || this;
        Conv2D.verifyConfig(config);
        return _this;
    }
    Conv2D.prototype.getConfig = function () {
        var config = _super.prototype.getConfig.call(this);
        delete config['rank'];
        return config;
    };
    Conv2D.verifyConfig = function (config) {
        if ((typeof config.kernelSize !== 'number') &&
            !generic_utils.checkArrayTypeAndLength(config.kernelSize, 'number', 1, 2))
            throw new errors_1.ValueError("Conv2D expects config.kernelSize to be number or number[] with " +
                ("length 1 or 2, but received " + JSON.stringify(config.kernelSize) + "."));
    };
    Conv2D.className = 'Conv2D';
    return Conv2D;
}(Conv));
exports.Conv2D = Conv2D;
tfjs_core_1.serialization.SerializationMap.register(Conv2D);
var Conv2DTranspose = (function (_super) {
    __extends(Conv2DTranspose, _super);
    function Conv2DTranspose(config) {
        var _this = _super.call(this, config) || this;
        _this.inputSpec = [new topology_1.InputSpec({ ndim: 4 })];
        if (_this.padding !== 'same' && _this.padding !== 'valid') {
            throw new errors_1.ValueError("Conv2DTranspose currently supports only padding modes 'same' " +
                ("and 'valid', but received padding mode " + _this.padding));
        }
        return _this;
    }
    Conv2DTranspose.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        if (inputShape.length !== 4) {
            throw new errors_1.ValueError('Input should have rank 4; Received input shape: ' +
                JSON.stringify(inputShape));
        }
        var channelAxis = this.dataFormat === 'channelsFirst' ? 1 : inputShape.length - 1;
        if (inputShape[channelAxis] == null) {
            throw new errors_1.ValueError('The channel dimension of the inputs should be defined. ' +
                'Found `None`.');
        }
        var inputDim = inputShape[channelAxis];
        var kernelShape = this.kernelSize.concat([this.filters, inputDim]);
        this.kernel = this.addWeight('kernel', kernelShape, 'float32', this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
        if (this.useBias) {
            this.bias = this.addWeight('bias', [this.filters], 'float32', this.biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        this.inputSpec =
            [new topology_1.InputSpec({ ndim: 4, axes: (_a = {}, _a[channelAxis] = inputDim, _a) })];
        this.built = true;
        var _a;
    };
    Conv2DTranspose.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfc.tidy(function () {
            var input = generic_utils.getExactlyOneTensor(inputs);
            if (input.shape.length !== 4) {
                throw new errors_1.ValueError("Conv2DTranspose.call() expects input tensor to be rank-4, but " +
                    ("received a tensor of rank-" + input.shape.length));
            }
            var inputShape = input.shape;
            var batchSize = inputShape[0];
            var hAxis;
            var wAxis;
            if (_this.dataFormat === 'channelsFirst') {
                hAxis = 2;
                wAxis = 3;
            }
            else {
                hAxis = 1;
                wAxis = 2;
            }
            var height = inputShape[hAxis];
            var width = inputShape[wAxis];
            var kernelH = _this.kernelSize[0];
            var kernelW = _this.kernelSize[1];
            var strideH = _this.strides[0];
            var strideW = _this.strides[1];
            var outHeight = conv_utils_1.deconvLength(height, strideH, kernelH, _this.padding);
            var outWidth = conv_utils_1.deconvLength(width, strideW, kernelW, _this.padding);
            var outputShape = [batchSize, outHeight, outWidth, _this.filters];
            if (_this.dataFormat !== 'channelsLast') {
                input = tfc.transpose(input, [0, 2, 3, 1]);
            }
            var outputs = tfc.conv2dTranspose(input, _this.kernel.read(), outputShape, _this.strides, _this.padding);
            if (_this.dataFormat !== 'channelsLast') {
                outputs = tfc.transpose(outputs, [0, 3, 1, 2]);
            }
            if (_this.bias != null) {
                outputs =
                    K.biasAdd(outputs, _this.bias.read(), _this.dataFormat);
            }
            if (_this.activation != null) {
                outputs = _this.activation.apply(outputs);
            }
            return outputs;
        });
    };
    Conv2DTranspose.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var outputShape = inputShape.slice();
        var channelAxis;
        var heightAxis;
        var widthAxis;
        if (this.dataFormat === 'channelsFirst') {
            channelAxis = 1;
            heightAxis = 2;
            widthAxis = 3;
        }
        else {
            channelAxis = 3;
            heightAxis = 1;
            widthAxis = 2;
        }
        var kernelH = this.kernelSize[0];
        var kernelW = this.kernelSize[1];
        var strideH = this.strides[0];
        var strideW = this.strides[1];
        outputShape[channelAxis] = this.filters;
        outputShape[heightAxis] =
            conv_utils_1.deconvLength(outputShape[heightAxis], strideH, kernelH, this.padding);
        outputShape[widthAxis] =
            conv_utils_1.deconvLength(outputShape[widthAxis], strideW, kernelW, this.padding);
        return outputShape;
    };
    Conv2DTranspose.prototype.getConfig = function () {
        var config = _super.prototype.getConfig.call(this);
        delete config['dilationRate'];
        return config;
    };
    Conv2DTranspose.className = 'Conv2DTranspose';
    return Conv2DTranspose;
}(Conv2D));
exports.Conv2DTranspose = Conv2DTranspose;
tfjs_core_1.serialization.SerializationMap.register(Conv2DTranspose);
var SeparableConv = (function (_super) {
    __extends(SeparableConv, _super);
    function SeparableConv(rank, config) {
        var _this = _super.call(this, rank, config) || this;
        _this.DEFAULT_DEPTHWISE_INITIALIZER = 'glorotUniform';
        _this.DEFAULT_POINTWISE_INITIALIZER = 'glorotUniform';
        _this.depthwiseKernel = null;
        _this.pointwiseKernel = null;
        if (config.filters == null) {
            throw new errors_1.ValueError('The `filters` configuration field is required by SeparableConv, ' +
                'but is unspecified.');
        }
        if (config.kernelInitializer != null || config.kernelRegularizer != null ||
            config.kernelConstraint != null) {
            throw new errors_1.ValueError('Fields kernelInitializer, kernelRegularizer and kernelConstraint ' +
                'are invalid for SeparableConv2D. Use depthwiseInitializer, ' +
                'depthwiseRegularizer, depthwiseConstraint, pointwiseInitializer, ' +
                'pointwiseRegularizer and pointwiseConstraint instead.');
        }
        if (config.padding != null && config.padding !== 'same' &&
            config.padding !== 'valid') {
            throw new errors_1.ValueError("SeparableConv" + _this.rank + "D supports only padding modes: " +
                ("'same' and 'valid', but received " + JSON.stringify(config.padding)));
        }
        _this.depthMultiplier =
            config.depthMultiplier == null ? 1 : config.depthMultiplier;
        _this.depthwiseInitializer = initializers_1.getInitializer(config.depthwiseInitializer || _this.DEFAULT_DEPTHWISE_INITIALIZER);
        _this.depthwiseRegularizer = regularizers_1.getRegularizer(config.depthwiseRegularizer);
        _this.depthwiseConstraint = constraints_1.getConstraint(config.depthwiseConstraint);
        _this.pointwiseInitializer = initializers_1.getInitializer(config.depthwiseInitializer || _this.DEFAULT_POINTWISE_INITIALIZER);
        _this.pointwiseRegularizer = regularizers_1.getRegularizer(config.pointwiseRegularizer);
        _this.pointwiseConstraint = constraints_1.getConstraint(config.pointwiseConstraint);
        return _this;
    }
    SeparableConv.prototype.build = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        if (inputShape.length < this.rank + 2) {
            throw new errors_1.ValueError("Inputs to SeparableConv" + this.rank + "D should have rank " +
                (this.rank + 2 + ", but received input shape: ") +
                ("" + JSON.stringify(inputShape)));
        }
        var channelAxis = this.dataFormat === 'channelsFirst' ? 1 : inputShape.length - 1;
        if (inputShape[channelAxis] == null || inputShape[channelAxis] < 0) {
            throw new errors_1.ValueError("The channel dimension of the inputs should be defined, " +
                ("but found " + JSON.stringify(inputShape[channelAxis])));
        }
        var inputDim = inputShape[channelAxis];
        var depthwiseKernelShape = this.kernelSize.concat([inputDim, this.depthMultiplier]);
        var pointwiseKernelShape = [];
        for (var i = 0; i < this.rank; ++i) {
            pointwiseKernelShape.push(1);
        }
        pointwiseKernelShape.push(inputDim * this.depthMultiplier, this.filters);
        var trainable = true;
        this.depthwiseKernel = this.addWeight('depthwise_kernel', depthwiseKernelShape, 'float32', this.depthwiseInitializer, this.depthwiseRegularizer, trainable, this.depthwiseConstraint);
        this.pointwiseKernel = this.addWeight('pointwise_kernel', pointwiseKernelShape, 'float32', this.pointwiseInitializer, this.pointwiseRegularizer, trainable, this.pointwiseConstraint);
        if (this.useBias) {
            this.bias = this.addWeight('bias', [this.filters], 'float32', this.biasInitializer, this.biasRegularizer, trainable, this.biasConstraint);
        }
        else {
            this.bias = null;
        }
        this.inputSpec =
            [new topology_1.InputSpec({ ndim: this.rank + 2, axes: (_a = {}, _a[channelAxis] = inputDim, _a) })];
        this.built = true;
        var _a;
    };
    SeparableConv.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils.getExactlyOneTensor(inputs);
            var output;
            if (_this.rank === 1) {
                throw new errors_1.NotImplementedError('1D separable convolution is not implemented yet.');
            }
            else if (_this.rank === 2) {
                if (_this.dataFormat === 'channelsFirst') {
                    inputs = tfc.transpose(inputs, [0, 2, 3, 1]);
                }
                output = tfc.separableConv2d(inputs, _this.depthwiseKernel.read(), _this.pointwiseKernel.read(), _this.strides, _this.padding, _this.dilationRate, 'NHWC');
            }
            if (_this.useBias) {
                output = K.biasAdd(output, _this.bias.read(), _this.dataFormat);
            }
            if (_this.activation != null) {
                output = _this.activation.apply(output);
            }
            if (_this.dataFormat === 'channelsFirst') {
                output = tfc.transpose(output, [0, 3, 1, 2]);
            }
            return output;
        });
    };
    SeparableConv.prototype.getConfig = function () {
        var config = _super.prototype.getConfig.call(this);
        delete config['rank'];
        delete config['kernelInitializer'];
        delete config['kernelRegularizer'];
        delete config['kernelConstraint'];
        config['depthwiseInitializer'] =
            initializers_1.serializeInitializer(this.depthwiseInitializer);
        config['pointwiseInitializer'] =
            initializers_1.serializeInitializer(this.pointwiseInitializer);
        config['depthwiseRegularizer'] =
            regularizers_1.serializeRegularizer(this.depthwiseRegularizer);
        config['pointwiseRegularizer'] =
            regularizers_1.serializeRegularizer(this.pointwiseRegularizer);
        config['depthwiseConstraint'] =
            constraints_1.serializeConstraint(this.depthwiseConstraint);
        config['pointwiseConstraint'] =
            constraints_1.serializeConstraint(this.pointwiseConstraint);
        return config;
    };
    SeparableConv.className = 'SeparableConv';
    return SeparableConv;
}(Conv));
exports.SeparableConv = SeparableConv;
var SeparableConv2D = (function (_super) {
    __extends(SeparableConv2D, _super);
    function SeparableConv2D(config) {
        return _super.call(this, 2, config) || this;
    }
    SeparableConv2D.className = 'SeparableConv2D';
    return SeparableConv2D;
}(SeparableConv));
exports.SeparableConv2D = SeparableConv2D;
tfjs_core_1.serialization.SerializationMap.register(SeparableConv2D);
var Conv1D = (function (_super) {
    __extends(Conv1D, _super);
    function Conv1D(config) {
        var _this = _super.call(this, 1, config) || this;
        Conv1D.verifyConfig(config);
        _this.inputSpec = [{ ndim: 3 }];
        return _this;
    }
    Conv1D.prototype.getConfig = function () {
        var config = _super.prototype.getConfig.call(this);
        delete config['rank'];
        delete config['dataFormat'];
        return config;
    };
    Conv1D.verifyConfig = function (config) {
        if (typeof config.kernelSize !== 'number' &&
            !generic_utils.checkArrayTypeAndLength(config.kernelSize, 'number', 1, 1))
            throw new errors_1.ValueError("Conv1D expects config.kernelSize to be number or number[] with " +
                ("length 1, but received " + JSON.stringify(config.kernelSize) + "."));
    };
    Conv1D.className = 'Conv1D';
    return Conv1D;
}(Conv));
exports.Conv1D = Conv1D;
tfjs_core_1.serialization.SerializationMap.register(Conv1D);
var Cropping2D = (function (_super) {
    __extends(Cropping2D, _super);
    function Cropping2D(config) {
        var _this = _super.call(this, config) || this;
        if (typeof config.cropping === 'number')
            _this.cropping = [
                [config.cropping, config.cropping], [config.cropping, config.cropping]
            ];
        else if (typeof config.cropping[0] === 'number')
            _this.cropping = [
                [config.cropping[0], config.cropping[0]],
                [config.cropping[1], config.cropping[1]]
            ];
        else
            _this.cropping = config.cropping;
        _this.dataFormat =
            config.dataFormat === undefined ? 'channelsLast' : config.dataFormat;
        _this.inputSpec = [{ ndim: 4 }];
        return _this;
    }
    Cropping2D.prototype.computeOutputShape = function (inputShape) {
        if (this.dataFormat === 'channelsFirst')
            return [
                inputShape[0], inputShape[1],
                inputShape[2] - this.cropping[0][0] - this.cropping[0][1],
                inputShape[2] - this.cropping[1][0] - this.cropping[1][1]
            ];
        else
            return [
                inputShape[0],
                inputShape[1] - this.cropping[0][0] - this.cropping[0][1],
                inputShape[2] - this.cropping[1][0] - this.cropping[1][1], inputShape[3]
            ];
    };
    Cropping2D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils.getExactlyOneTensor(inputs);
            if (_this.dataFormat === 'channelsLast') {
                var hSliced = K.sliceAlongAxis(inputs, _this.cropping[0][0], inputs.shape[1] - _this.cropping[0][0] - _this.cropping[0][1], 2);
                return K.sliceAlongAxis(hSliced, _this.cropping[1][0], inputs.shape[2] - _this.cropping[1][1] - _this.cropping[1][0], 3);
            }
            else {
                var hSliced = K.sliceAlongAxis(inputs, _this.cropping[0][0], inputs.shape[2] - _this.cropping[0][0] - _this.cropping[0][1], 3);
                return K.sliceAlongAxis(hSliced, _this.cropping[1][0], inputs.shape[3] - _this.cropping[1][1] - _this.cropping[1][0], 4);
            }
        });
    };
    Cropping2D.prototype.getConfig = function () {
        var config = { cropping: this.cropping, dataFormat: this.dataFormat };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Cropping2D.className = 'Cropping2D';
    return Cropping2D;
}(topology_1.Layer));
exports.Cropping2D = Cropping2D;
tfjs_core_1.serialization.SerializationMap.register(Cropping2D);
var UpSampling2D = (function (_super) {
    __extends(UpSampling2D, _super);
    function UpSampling2D(config) {
        var _this = _super.call(this, config) || this;
        _this.DEFAULT_SIZE = [2, 2];
        _this.inputSpec = [{ ndim: 4 }];
        _this.size = config.size === undefined ? _this.DEFAULT_SIZE : config.size;
        _this.dataFormat =
            config.dataFormat === undefined ? 'channelsLast' : config.dataFormat;
        return _this;
    }
    UpSampling2D.prototype.computeOutputShape = function (inputShape) {
        if (this.dataFormat === 'channelsFirst') {
            var height = this.size[0] * inputShape[2];
            var width = this.size[1] * inputShape[3];
            return [inputShape[0], inputShape[1], height, width];
        }
        else {
            var height = this.size[0] * inputShape[1];
            var width = this.size[1] * inputShape[2];
            return [inputShape[0], height, width, inputShape[3]];
        }
    };
    UpSampling2D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfc.tidy(function () {
            var input = generic_utils.getExactlyOneTensor(inputs);
            var inputShape = input.shape;
            if (_this.dataFormat === 'channelsFirst') {
                input = tfc.transpose(input, [0, 2, 3, 1]);
                var height = _this.size[0] * inputShape[2];
                var width = _this.size[1] * inputShape[3];
                var resized = input.resizeNearestNeighbor([height, width]);
                return tfc.transpose(resized, [0, 3, 1, 2]);
            }
            else {
                var height = _this.size[0] * inputShape[1];
                var width = _this.size[1] * inputShape[2];
                return input.resizeNearestNeighbor([height, width]);
            }
        });
    };
    UpSampling2D.prototype.getConfig = function () {
        var config = { size: this.size, dataFormat: this.dataFormat };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    UpSampling2D.className = 'UpSampling2D';
    return UpSampling2D;
}(topology_1.Layer));
exports.UpSampling2D = UpSampling2D;
tfjs_core_1.serialization.SerializationMap.register(UpSampling2D);
//# sourceMappingURL=convolutional.js.map