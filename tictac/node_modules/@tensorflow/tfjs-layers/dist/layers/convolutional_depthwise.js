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
var common_1 = require("../backend/common");
var K = require("../backend/tfjs_backend");
var common_2 = require("../common");
var constraints_1 = require("../constraints");
var errors_1 = require("../errors");
var initializers_1 = require("../initializers");
var regularizers_1 = require("../regularizers");
var conv_utils_1 = require("../utils/conv_utils");
var generic_utils_1 = require("../utils/generic_utils");
var convolutional_1 = require("./convolutional");
function depthwiseConv2d(x, depthwiseKernel, strides, padding, dataFormat, dilationRate) {
    if (strides === void 0) { strides = [1, 1]; }
    if (padding === void 0) { padding = 'valid'; }
    return tfjs_core_1.tidy(function () {
        if (dataFormat == null) {
            dataFormat = common_1.imageDataFormat();
        }
        common_2.checkDataFormat(dataFormat);
        var y = convolutional_1.preprocessConv2DInput(x, dataFormat);
        if (x.rank !== 4) {
            throw new errors_1.ValueError("Input for depthwiseConv2d is required to be 4-D, but is instead " +
                (x.rank + "-D"));
        }
        if (depthwiseKernel.rank !== 4) {
            throw new errors_1.ValueError("depthwiseKernel is required to be 4-D, but is instead " +
                (depthwiseKernel.rank + "-D"));
        }
        y = tfc.depthwiseConv2d(y, depthwiseKernel, strides, padding === 'same' ? 'same' : 'valid', 'NHWC', dilationRate);
        if (dataFormat === 'channelsFirst') {
            y = tfc.transpose(y, [0, 3, 1, 2]);
        }
        return y;
    });
}
exports.depthwiseConv2d = depthwiseConv2d;
var DepthwiseConv2D = (function (_super) {
    __extends(DepthwiseConv2D, _super);
    function DepthwiseConv2D(config) {
        var _this = _super.call(this, 2, config) || this;
        _this.depthwiseKernel = null;
        _this.depthMultiplier =
            config.depthMultiplier == null ? 1 : config.depthMultiplier;
        _this.depthwiseInitializer = initializers_1.getInitializer(config.depthwiseInitializer || _this.DEFAULT_KERNEL_INITIALIZER);
        _this.depthwiseConstraint = constraints_1.getConstraint(config.depthwiseConstraint);
        _this.depthwiseRegularizer = regularizers_1.getRegularizer(config.depthwiseRegularizer);
        return _this;
    }
    DepthwiseConv2D.prototype.build = function (inputShape) {
        inputShape = generic_utils_1.getExactlyOneShape(inputShape);
        if (inputShape.length < 4) {
            throw new errors_1.ValueError("Inputs to DepthwiseConv2D should have rank 4. " +
                ("Received input shape: " + JSON.stringify(inputShape) + "."));
        }
        var channelAxis = this.dataFormat === 'channelsFirst' ? 1 : 3;
        if (inputShape[channelAxis] == null || inputShape[channelAxis] < 0) {
            throw new errors_1.ValueError('The channel dimension of the inputs to DepthwiseConv2D should ' +
                ("be defined, but is not (" + inputShape[channelAxis] + ")."));
        }
        var inputDim = inputShape[channelAxis];
        var depthwiseKernelShape = [
            this.kernelSize[0], this.kernelSize[1], inputDim, this.depthMultiplier
        ];
        this.depthwiseKernel = this.addWeight('depthwise_kernel', depthwiseKernelShape, null, this.depthwiseInitializer, this.depthwiseRegularizer, true, this.depthwiseConstraint);
        if (this.useBias) {
            this.bias = this.addWeight('bias', [inputDim * this.depthMultiplier], null, this.biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        else {
            this.bias = null;
        }
        this.built = true;
    };
    DepthwiseConv2D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            inputs = generic_utils_1.getExactlyOneTensor(inputs);
            var outputs = depthwiseConv2d(inputs, _this.depthwiseKernel.read(), _this.strides, _this.padding, _this.dataFormat, null);
            if (_this.useBias) {
                outputs = K.biasAdd(outputs, _this.bias.read(), _this.dataFormat);
            }
            if (_this.activation != null) {
                outputs = _this.activation.apply(outputs);
            }
            return outputs;
        });
    };
    DepthwiseConv2D.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils_1.getExactlyOneShape(inputShape);
        var rows = this.dataFormat === 'channelsFirst' ? inputShape[2] : inputShape[1];
        var cols = this.dataFormat === 'channelsFirst' ? inputShape[3] : inputShape[2];
        var outFilters = this.dataFormat === 'channelsFirst' ?
            inputShape[1] * this.depthMultiplier :
            inputShape[3] * this.depthMultiplier;
        var outRows = conv_utils_1.convOutputLength(rows, this.kernelSize[0], this.padding, this.strides[0]);
        var outCols = conv_utils_1.convOutputLength(cols, this.kernelSize[1], this.padding, this.strides[1]);
        if (this.dataFormat === 'channelsFirst') {
            return [inputShape[0], outFilters, outRows, outCols];
        }
        else {
            return [inputShape[0], outRows, outCols, outFilters];
        }
    };
    DepthwiseConv2D.className = 'DepthwiseConv2D';
    return DepthwiseConv2D;
}(convolutional_1.BaseConv));
exports.DepthwiseConv2D = DepthwiseConv2D;
tfjs_core_1.serialization.SerializationMap.register(DepthwiseConv2D);
//# sourceMappingURL=convolutional_depthwise.js.map