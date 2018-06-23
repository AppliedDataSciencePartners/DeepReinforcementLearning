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
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("../backend/tfjs_backend");
var constraints_1 = require("../constraints");
var topology_1 = require("../engine/topology");
var errors_1 = require("../errors");
var initializers_1 = require("../initializers");
var regularizers_1 = require("../regularizers");
var generic_utils = require("../utils/generic_utils");
var generic_utils_1 = require("../utils/generic_utils");
var Embedding = (function (_super) {
    __extends(Embedding, _super);
    function Embedding(config) {
        var _this = _super.call(this, config) || this;
        _this.embeddings = null;
        _this.DEFAULT_EMBEDDINGS_INITIALIZER = 'randomUniform';
        if (config.batchInputShape == null && config.inputShape == null) {
            var batchSize = null;
            if (config.batchSize != null) {
                batchSize = config.batchSize;
            }
            if (config.inputLength == null) {
                _this.batchInputShape = [batchSize, null];
            }
            else {
                _this.batchInputShape =
                    [batchSize].concat(generic_utils.toList(config.inputLength));
            }
        }
        _this.inputDim = config.inputDim;
        _this.outputDim = config.outputDim;
        _this.embeddingsInitializer = initializers_1.getInitializer(config.embeddingsInitializer || _this.DEFAULT_EMBEDDINGS_INITIALIZER);
        _this.embeddingsRegularizer = regularizers_1.getRegularizer(config.embeddingsRegularizer);
        _this.activityRegularizer = regularizers_1.getRegularizer(config.activityRegularizer);
        _this.embeddingsConstraint = constraints_1.getConstraint(config.embeddingsConstraint);
        _this.maskZero = config.maskZero;
        _this.inputLength = config.inputLength;
        return _this;
    }
    Embedding.prototype.build = function (inputShape) {
        this.embeddings = this.addWeight('embeddings', [this.inputDim, this.outputDim], this.dtype, this.embeddingsInitializer, this.embeddingsRegularizer, true, this.embeddingsConstraint);
        this.built = true;
    };
    Embedding.prototype.computeMask = function (inputs, mask) {
        throw new errors_1.NotImplementedError('computeMask has not been implemented for Embedding yet');
    };
    Embedding.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        if (this.inputLength == null) {
            return inputShape.concat([this.outputDim]);
        }
        var inLens = generic_utils.toList(this.inputLength);
        if (inLens.length !== inputShape.length - 1) {
            throw new errors_1.ValueError("\"inputLength\" is " + this.inputLength + ", but received " +
                ("input shape has shape " + inputShape));
        }
        else {
            var i = 0;
            for (var k = 0; k < inLens.length; ++k) {
                var s1 = inLens[k];
                var s2 = inputShape[k + 1];
                if ((s1 != null) && (s2 != null) && (s1 !== s2)) {
                    throw new errors_1.ValueError("\"inputLength\" is " + this.inputLength + ", but received " +
                        ("input shape has shape " + inputShape));
                }
                else if (s1 == null) {
                    inLens[i] = s2;
                }
                i++;
            }
        }
        return [inputShape[0]].concat(inLens, [this.outputDim]);
    };
    Embedding.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            var input = generic_utils.getExactlyOneTensor(inputs);
            if (K.dtype(input) !== 'int32') {
                input = K.cast(input, 'int32');
            }
            var output = K.gather(_this.embeddings.read(), input.as1D());
            return output.reshape(generic_utils_1.getExactlyOneShape(_this.computeOutputShape(input.shape)));
        });
    };
    Embedding.prototype.getConfig = function () {
        var config = {
            inputDim: this.inputDim,
            outputDim: this.outputDim,
            embeddingsInitializer: initializers_1.serializeInitializer(this.embeddingsInitializer),
            embeddingsRegularizer: regularizers_1.serializeRegularizer(this.embeddingsRegularizer),
            activityRegularizer: regularizers_1.serializeRegularizer(this.activityRegularizer),
            embeddingsConstraint: constraints_1.serializeConstraint(this.embeddingsConstraint),
            maskZero: this.maskZero,
            inputLength: this.inputLength
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    Embedding.className = 'Embedding';
    return Embedding;
}(topology_1.Layer));
exports.Embedding = Embedding;
tfjs_core_1.serialization.SerializationMap.register(Embedding);
//# sourceMappingURL=embeddings.js.map