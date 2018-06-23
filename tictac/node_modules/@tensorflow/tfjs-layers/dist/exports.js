"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var constraints_1 = require("./constraints");
var topology_1 = require("./engine/topology");
var training_1 = require("./engine/training");
var initializers_1 = require("./initializers");
var advanced_activations_1 = require("./layers/advanced_activations");
var convolutional_1 = require("./layers/convolutional");
var convolutional_depthwise_1 = require("./layers/convolutional_depthwise");
var core_1 = require("./layers/core");
var embeddings_1 = require("./layers/embeddings");
var merge_1 = require("./layers/merge");
var normalization_1 = require("./layers/normalization");
var padding_1 = require("./layers/padding");
var pooling_1 = require("./layers/pooling");
var recurrent_1 = require("./layers/recurrent");
var wrappers_1 = require("./layers/wrappers");
var losses_1 = require("./losses");
var metrics_1 = require("./metrics");
var models_1 = require("./models");
var regularizers_1 = require("./regularizers");
var ModelExports = (function () {
    function ModelExports() {
    }
    ModelExports.model = function (config) {
        return new training_1.Model(config);
    };
    ModelExports.sequential = function (config) {
        return new models_1.Sequential(config);
    };
    ModelExports.loadModel = function (pathOrIOHandler) {
        return models_1.loadModelInternal(pathOrIOHandler);
    };
    ModelExports.input = function (config) {
        return topology_1.Input(config);
    };
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Creation', configParamIndices: [0] })
    ], ModelExports, "model", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Models', subheading: 'Creation', configParamIndices: [0] })
    ], ModelExports, "sequential", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Models',
            subheading: 'Loading',
            useDocsFrom: 'loadModelInternal'
        })
    ], ModelExports, "loadModel", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Models',
            subheading: 'Inputs',
            useDocsFrom: 'Input',
            configParamIndices: [0]
        })
    ], ModelExports, "input", null);
    return ModelExports;
}());
exports.ModelExports = ModelExports;
var LayerExports = (function () {
    function LayerExports() {
    }
    LayerExports.inputLayer = function (config) {
        return new topology_1.InputLayer(config);
    };
    LayerExports.elu = function (config) {
        return new advanced_activations_1.ELU(config);
    };
    LayerExports.leakyReLU = function (config) {
        return new advanced_activations_1.LeakyReLU(config);
    };
    LayerExports.softmax = function (config) {
        return new advanced_activations_1.Softmax(config);
    };
    LayerExports.thresholdedReLU = function (config) {
        return new advanced_activations_1.ThresholdedReLU(config);
    };
    LayerExports.conv1d = function (config) {
        return new convolutional_1.Conv1D(config);
    };
    LayerExports.conv2d = function (config) {
        return new convolutional_1.Conv2D(config);
    };
    LayerExports.conv2dTranspose = function (config) {
        return new convolutional_1.Conv2DTranspose(config);
    };
    LayerExports.separableConv2d = function (config) {
        return new convolutional_1.SeparableConv2D(config);
    };
    LayerExports.cropping2D = function (config) {
        return new convolutional_1.Cropping2D(config);
    };
    LayerExports.upSampling2d = function (config) {
        return new convolutional_1.UpSampling2D(config);
    };
    LayerExports.depthwiseConv2d = function (config) {
        return new convolutional_depthwise_1.DepthwiseConv2D(config);
    };
    LayerExports.activation = function (config) {
        return new core_1.Activation(config);
    };
    LayerExports.dense = function (config) {
        return new core_1.Dense(config);
    };
    LayerExports.dropout = function (config) {
        return new core_1.Dropout(config);
    };
    LayerExports.flatten = function (config) {
        return new core_1.Flatten(config);
    };
    LayerExports.repeatVector = function (config) {
        return new core_1.RepeatVector(config);
    };
    LayerExports.reshape = function (config) {
        return new core_1.Reshape(config);
    };
    LayerExports.embedding = function (config) {
        return new embeddings_1.Embedding(config);
    };
    LayerExports.add = function (config) {
        return new merge_1.Add(config);
    };
    LayerExports.average = function (config) {
        return new merge_1.Average(config);
    };
    LayerExports.concatenate = function (config) {
        return new merge_1.Concatenate(config);
    };
    LayerExports.maximum = function (config) {
        return new merge_1.Maximum(config);
    };
    LayerExports.minimum = function (config) {
        return new merge_1.Minimum(config);
    };
    LayerExports.multiply = function (config) {
        return new merge_1.Multiply(config);
    };
    LayerExports.batchNormalization = function (config) {
        return new normalization_1.BatchNormalization(config);
    };
    LayerExports.zeroPadding2d = function (config) {
        return new padding_1.ZeroPadding2D(config);
    };
    LayerExports.averagePooling1d = function (config) {
        return new pooling_1.AveragePooling1D(config);
    };
    LayerExports.avgPool1d = function (config) {
        return LayerExports.averagePooling1d(config);
    };
    LayerExports.avgPooling1d = function (config) {
        return LayerExports.averagePooling1d(config);
    };
    LayerExports.averagePooling2d = function (config) {
        return new pooling_1.AveragePooling2D(config);
    };
    LayerExports.avgPool2d = function (config) {
        return LayerExports.averagePooling2d(config);
    };
    LayerExports.avgPooling2d = function (config) {
        return LayerExports.averagePooling2d(config);
    };
    LayerExports.globalAveragePooling1d = function (config) {
        return new pooling_1.GlobalAveragePooling1D(config);
    };
    LayerExports.globalAveragePooling2d = function (config) {
        return new pooling_1.GlobalAveragePooling2D(config);
    };
    LayerExports.globalMaxPooling1d = function (config) {
        return new pooling_1.GlobalMaxPooling1D(config);
    };
    LayerExports.globalMaxPooling2d = function (config) {
        return new pooling_1.GlobalMaxPooling2D(config);
    };
    LayerExports.maxPooling1d = function (config) {
        return new pooling_1.MaxPooling1D(config);
    };
    LayerExports.maxPooling2d = function (config) {
        return new pooling_1.MaxPooling2D(config);
    };
    LayerExports.gru = function (config) {
        return new recurrent_1.GRU(config);
    };
    LayerExports.gruCell = function (config) {
        return new recurrent_1.GRUCell(config);
    };
    LayerExports.lstm = function (config) {
        return new recurrent_1.LSTM(config);
    };
    LayerExports.lstmCell = function (config) {
        return new recurrent_1.LSTMCell(config);
    };
    LayerExports.simpleRNN = function (config) {
        return new recurrent_1.SimpleRNN(config);
    };
    LayerExports.simpleRNNCell = function (config) {
        return new recurrent_1.SimpleRNNCell(config);
    };
    LayerExports.rnn = function (config) {
        return new recurrent_1.RNN(config);
    };
    LayerExports.stackedRNNCells = function (config) {
        return new recurrent_1.StackedRNNCells(config);
    };
    LayerExports.bidirectional = function (config) {
        return new wrappers_1.Bidirectional(config);
    };
    LayerExports.timeDistributed = function (config) {
        return new wrappers_1.TimeDistributed(config);
    };
    LayerExports.Layer = topology_1.Layer;
    LayerExports.RNN = recurrent_1.RNN;
    LayerExports.RNNCell = recurrent_1.RNNCell;
    LayerExports.input = ModelExports.input;
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Inputs',
            namespace: 'layers',
            useDocsFrom: 'InputLayer',
            configParamIndices: [0]
        })
    ], LayerExports, "inputLayer", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Advanced Activation',
            namespace: 'layers',
            useDocsFrom: 'ELU',
            configParamIndices: [0]
        })
    ], LayerExports, "elu", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Advanced Activation',
            namespace: 'layers',
            useDocsFrom: 'LeakyReLU',
            configParamIndices: [0]
        })
    ], LayerExports, "leakyReLU", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Advanced Activation',
            namespace: 'layers',
            useDocsFrom: 'Softmax',
            configParamIndices: [0]
        })
    ], LayerExports, "softmax", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Advanced Activation',
            namespace: 'layers',
            useDocsFrom: 'ThresholdedReLU',
            configParamIndices: [0]
        })
    ], LayerExports, "thresholdedReLU", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'Conv1D',
            configParamIndices: [0]
        })
    ], LayerExports, "conv1d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'Conv2D',
            configParamIndices: [0]
        })
    ], LayerExports, "conv2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'Conv2DTranspose',
            configParamIndices: [0]
        })
    ], LayerExports, "conv2dTranspose", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'SeparableConv2D',
            configParamIndices: [0]
        })
    ], LayerExports, "separableConv2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'Cropping2D',
            configParamIndices: [0]
        })
    ], LayerExports, "cropping2D", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'UpSampling2D',
            configParamIndices: [0]
        })
    ], LayerExports, "upSampling2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Convolutional',
            namespace: 'layers',
            useDocsFrom: 'DepthwiseConv2D',
            configParamIndices: [0]
        })
    ], LayerExports, "depthwiseConv2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'Activation',
            configParamIndices: [0]
        })
    ], LayerExports, "activation", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'Dense',
            configParamIndices: [0]
        })
    ], LayerExports, "dense", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'Dropout',
            configParamIndices: [0]
        })
    ], LayerExports, "dropout", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'Flatten',
            configParamIndices: [0]
        })
    ], LayerExports, "flatten", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'RepeatVector',
            configParamIndices: [0]
        })
    ], LayerExports, "repeatVector", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'Reshape',
            configParamIndices: [0]
        })
    ], LayerExports, "reshape", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Basic',
            namespace: 'layers',
            useDocsFrom: 'Embedding',
            configParamIndices: [0]
        })
    ], LayerExports, "embedding", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Merge',
            namespace: 'layers',
            useDocsFrom: 'Add',
            configParamIndices: [0]
        })
    ], LayerExports, "add", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Merge',
            namespace: 'layers',
            useDocsFrom: 'Average',
            configParamIndices: [0]
        })
    ], LayerExports, "average", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Merge',
            namespace: 'layers',
            useDocsFrom: 'Concatenate',
            configParamIndices: [0]
        })
    ], LayerExports, "concatenate", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Merge',
            namespace: 'layers',
            useDocsFrom: 'Maximum',
            configParamIndices: [0]
        })
    ], LayerExports, "maximum", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Merge',
            namespace: 'layers',
            useDocsFrom: 'Minimum',
            configParamIndices: [0]
        })
    ], LayerExports, "minimum", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Merge',
            namespace: 'layers',
            useDocsFrom: 'Multiply',
            configParamIndices: [0]
        })
    ], LayerExports, "multiply", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Normalization',
            namespace: 'layers',
            useDocsFrom: 'BatchNormalization',
            configParamIndices: [0]
        })
    ], LayerExports, "batchNormalization", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Padding',
            namespace: 'layers',
            useDocsFrom: 'ZeroPadding2D',
            configParamIndices: [0]
        })
    ], LayerExports, "zeroPadding2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'AveragePooling1D',
            configParamIndices: [0]
        })
    ], LayerExports, "averagePooling1d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'AveragePooling2D',
            configParamIndices: [0]
        })
    ], LayerExports, "averagePooling2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'GlobalAveragePooling1D',
            configParamIndices: [0]
        })
    ], LayerExports, "globalAveragePooling1d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'GlobalAveragePooling2D',
            configParamIndices: [0]
        })
    ], LayerExports, "globalAveragePooling2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'GlobalMaxPooling1D',
            configParamIndices: [0]
        })
    ], LayerExports, "globalMaxPooling1d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'GlobalMaxPooling2D',
            configParamIndices: [0]
        })
    ], LayerExports, "globalMaxPooling2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'MaxPooling1D',
            configParamIndices: [0]
        })
    ], LayerExports, "maxPooling1d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Pooling',
            namespace: 'layers',
            useDocsFrom: 'MaxPooling2D',
            configParamIndices: [0]
        })
    ], LayerExports, "maxPooling2d", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'GRU',
            configParamIndices: [0]
        })
    ], LayerExports, "gru", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'GRUCell',
            configParamIndices: [0]
        })
    ], LayerExports, "gruCell", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'LSTM',
            configParamIndices: [0]
        })
    ], LayerExports, "lstm", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'LSTMCell',
            configParamIndices: [0]
        })
    ], LayerExports, "lstmCell", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'SimpleRNN',
            configParamIndices: [0]
        })
    ], LayerExports, "simpleRNN", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'SimpleRNNCell',
            configParamIndices: [0]
        })
    ], LayerExports, "simpleRNNCell", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'RNN',
            configParamIndices: [0]
        })
    ], LayerExports, "rnn", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Recurrent',
            namespace: 'layers',
            useDocsFrom: 'RNN',
            configParamIndices: [0]
        })
    ], LayerExports, "stackedRNNCells", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Wrapper',
            namespace: 'layers',
            useDocsFrom: 'Bidirectional',
            configParamIndices: [0]
        })
    ], LayerExports, "bidirectional", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Layers',
            subheading: 'Wrapper',
            namespace: 'layers',
            useDocsFrom: 'TimeDistributed',
            configParamIndices: [0]
        })
    ], LayerExports, "timeDistributed", null);
    return LayerExports;
}());
exports.LayerExports = LayerExports;
var ConstraintExports = (function () {
    function ConstraintExports() {
    }
    ConstraintExports.maxNorm = function (config) {
        return new constraints_1.MaxNorm(config);
    };
    ConstraintExports.unitNorm = function (config) {
        return new constraints_1.UnitNorm(config);
    };
    ConstraintExports.nonNeg = function () {
        return new constraints_1.NonNeg();
    };
    ConstraintExports.minMaxNorm = function (config) {
        return new constraints_1.MinMaxNorm(config);
    };
    __decorate([
        tfjs_core_1.doc({
            heading: 'Constraints',
            namespace: 'constraints',
            useDocsFrom: 'MaxNorm',
            configParamIndices: [0]
        })
    ], ConstraintExports, "maxNorm", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Constraints',
            namespace: 'constraints',
            useDocsFrom: 'UnitNorm',
            configParamIndices: [0]
        })
    ], ConstraintExports, "unitNorm", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Constraints', namespace: 'constraints', useDocsFrom: 'NonNeg' })
    ], ConstraintExports, "nonNeg", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Constraints',
            namespace: 'constraints',
            useDocsFrom: 'MinMaxNormConfig',
            configParamIndices: [0]
        })
    ], ConstraintExports, "minMaxNorm", null);
    return ConstraintExports;
}());
exports.ConstraintExports = ConstraintExports;
var InitializerExports = (function () {
    function InitializerExports() {
    }
    InitializerExports.zeros = function () {
        return new initializers_1.Zeros();
    };
    InitializerExports.ones = function () {
        return new initializers_1.Ones();
    };
    InitializerExports.constant = function (config) {
        return new initializers_1.Constant(config);
    };
    InitializerExports.randomUniform = function (config) {
        return new initializers_1.RandomUniform(config);
    };
    InitializerExports.randomNormal = function (config) {
        return new initializers_1.RandomNormal(config);
    };
    InitializerExports.truncatedNormal = function (config) {
        return new initializers_1.TruncatedNormal(config);
    };
    InitializerExports.identity = function (config) {
        return new initializers_1.Identity(config);
    };
    InitializerExports.varianceScaling = function (config) {
        return new initializers_1.VarianceScaling(config);
    };
    InitializerExports.glorotUniform = function (config) {
        return new initializers_1.GlorotUniform(config);
    };
    InitializerExports.glorotNormal = function (config) {
        return new initializers_1.GlorotNormal(config);
    };
    InitializerExports.heNormal = function (config) {
        return new initializers_1.HeNormal(config);
    };
    InitializerExports.leCunNormal = function (config) {
        return new initializers_1.LeCunNormal(config);
    };
    InitializerExports.orthogonal = function (config) {
        return new initializers_1.Orthogonal(config);
    };
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'Zeros'
        })
    ], InitializerExports, "zeros", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Initializers', namespace: 'initializers', useDocsFrom: 'Ones' })
    ], InitializerExports, "ones", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'Constant',
            configParamIndices: [0]
        })
    ], InitializerExports, "constant", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'RandomUniform',
            configParamIndices: [0]
        })
    ], InitializerExports, "randomUniform", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'RandomNormal',
            configParamIndices: [0]
        })
    ], InitializerExports, "randomNormal", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'TruncatedNormal',
            configParamIndices: [0]
        })
    ], InitializerExports, "truncatedNormal", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'Identity',
            configParamIndices: [0]
        })
    ], InitializerExports, "identity", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'VarianceScaling',
            configParamIndices: [0]
        })
    ], InitializerExports, "varianceScaling", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'GlorotUniform',
            configParamIndices: [0]
        })
    ], InitializerExports, "glorotUniform", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'GlorotNormal',
            configParamIndices: [0]
        })
    ], InitializerExports, "glorotNormal", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'HeNormal',
            configParamIndices: [0]
        })
    ], InitializerExports, "heNormal", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'LeCunNormal',
            configParamIndices: [0]
        })
    ], InitializerExports, "leCunNormal", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Initializers',
            namespace: 'initializers',
            useDocsFrom: 'Orthogonal',
            configParamIndices: [0]
        })
    ], InitializerExports, "orthogonal", null);
    return InitializerExports;
}());
exports.InitializerExports = InitializerExports;
var MetricExports = (function () {
    function MetricExports() {
    }
    MetricExports.binaryAccuracy = function (yTrue, yPred) {
        return metrics_1.binaryAccuracy(yTrue, yPred);
    };
    MetricExports.binaryCrossentropy = function (yTrue, yPred) {
        return metrics_1.binaryCrossentropy(yTrue, yPred);
    };
    MetricExports.categoricalAccuracy = function (yTrue, yPred) {
        return metrics_1.categoricalAccuracy(yTrue, yPred);
    };
    MetricExports.categoricalCrossentropy = function (yTrue, yPred) {
        return losses_1.categoricalCrossentropy(yTrue, yPred);
    };
    MetricExports.cosineProximity = function (yTrue, yPred) {
        return losses_1.cosineProximity(yTrue, yPred);
    };
    MetricExports.prototype.meanAbsoluteError = function (yTrue, yPred) {
        return losses_1.meanAbsoluteError(yTrue, yPred);
    };
    MetricExports.prototype.meanAbsolutePercentageError = function (yTrue, yPred) {
        return losses_1.meanAbsolutePercentageError(yTrue, yPred);
    };
    MetricExports.prototype.MAPE = function (yTrue, yPred) {
        return losses_1.meanAbsolutePercentageError(yTrue, yPred);
    };
    MetricExports.prototype.mape = function (yTrue, yPred) {
        return losses_1.meanAbsolutePercentageError(yTrue, yPred);
    };
    MetricExports.meanSquaredError = function (yTrue, yPred) {
        return losses_1.meanSquaredError(yTrue, yPred);
    };
    MetricExports.MSE = function (yTrue, yPred) {
        return losses_1.meanSquaredError(yTrue, yPred);
    };
    MetricExports.mse = function (yTrue, yPred) {
        return losses_1.meanSquaredError(yTrue, yPred);
    };
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'meanAbsoluteError'
        })
    ], MetricExports.prototype, "meanAbsoluteError", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'meanAbsolutePercentageError'
        })
    ], MetricExports.prototype, "meanAbsolutePercentageError", null);
    __decorate([
        tfjs_core_1.doc({ heading: 'Metrics', namespace: 'metrics', useDocsFrom: 'binaryAccuracy' })
    ], MetricExports, "binaryAccuracy", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'binaryCrossentropy'
        })
    ], MetricExports, "binaryCrossentropy", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'categoricalAccuracy'
        })
    ], MetricExports, "categoricalAccuracy", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'categoricalCrossentropy'
        })
    ], MetricExports, "categoricalCrossentropy", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'cosineProximity'
        })
    ], MetricExports, "cosineProximity", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Metrics',
            namespace: 'metrics',
            useDocsFrom: 'meanSquaredError'
        })
    ], MetricExports, "meanSquaredError", null);
    return MetricExports;
}());
exports.MetricExports = MetricExports;
var RegularizerExports = (function () {
    function RegularizerExports() {
    }
    RegularizerExports.l1l2 = function (config) {
        return new regularizers_1.L1L2(config);
    };
    RegularizerExports.l1 = function (config) {
        return regularizers_1.l1(config);
    };
    RegularizerExports.l2 = function (config) {
        return regularizers_1.l2(config);
    };
    __decorate([
        tfjs_core_1.doc({
            heading: 'Regularizers',
            namespace: 'regularizers',
            useDocsFrom: 'L1L2',
            configParamIndices: [0]
        })
    ], RegularizerExports, "l1l2", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Regularizers',
            namespace: 'regularizers',
            useDocsFrom: 'L1L2',
            configParamIndices: [0]
        })
    ], RegularizerExports, "l1", null);
    __decorate([
        tfjs_core_1.doc({
            heading: 'Regularizers',
            namespace: 'regularizers',
            useDocsFrom: 'L1L2',
            configParamIndices: [0]
        })
    ], RegularizerExports, "l2", null);
    return RegularizerExports;
}());
exports.RegularizerExports = RegularizerExports;
//# sourceMappingURL=exports.js.map