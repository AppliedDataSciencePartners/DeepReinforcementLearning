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
var topology_1 = require("../engine/topology");
var topology_2 = require("../engine/topology");
var errors_1 = require("../errors");
var conv_utils_1 = require("../utils/conv_utils");
var generic_utils = require("../utils/generic_utils");
var convolutional_1 = require("./convolutional");
function pool2d(x, poolSize, strides, padding, dataFormat, poolMode) {
    return tfjs_core_1.tidy(function () {
        common_2.checkDataFormat(dataFormat);
        common_2.checkPoolMode(poolMode);
        common_2.checkPaddingMode(padding);
        if (strides == null) {
            strides = [1, 1];
        }
        if (padding == null) {
            padding = 'valid';
        }
        if (dataFormat == null) {
            dataFormat = common_1.imageDataFormat();
        }
        if (poolMode == null) {
            poolMode = 'max';
        }
        x = convolutional_1.preprocessConv2DInput(x, dataFormat);
        var y;
        var paddingString = (padding === 'same') ? 'same' : 'valid';
        if (poolMode === 'max') {
            y = tfc.maxPool(x, poolSize, strides, paddingString);
        }
        else {
            y = tfc.avgPool(x, poolSize, strides, paddingString);
        }
        if (dataFormat === 'channelsFirst') {
            y = tfc.transpose(y, [0, 3, 1, 2]);
        }
        return y;
    });
}
exports.pool2d = pool2d;
var Pooling1D = (function (_super) {
    __extends(Pooling1D, _super);
    function Pooling1D(config) {
        var _this = this;
        if (config.poolSize == null) {
            config.poolSize = 2;
        }
        _this = _super.call(this, config) || this;
        if (typeof config.poolSize === 'number') {
            _this.poolSize = [config.poolSize];
        }
        else if (Array.isArray(config.poolSize) &&
            config.poolSize.length === 1 &&
            typeof config.poolSize[0] === 'number') {
            _this.poolSize = config.poolSize;
        }
        else {
            throw new errors_1.ValueError("poolSize for 1D convolutional layer must be a number or an " +
                "Array of a single number, but received " +
                ("" + JSON.stringify(config.poolSize)));
        }
        if (config.strides == null) {
            _this.strides = _this.poolSize;
        }
        else {
            if (typeof config.strides === 'number') {
                _this.strides = [config.strides];
            }
            else if (Array.isArray(config.strides) &&
                config.strides.length === 1 &&
                typeof config.strides[0] === 'number') {
                _this.strides = config.strides;
            }
            else {
                throw new errors_1.ValueError("strides for 1D convolutional layer must be a number or an " +
                    "Array of a single number, but received " +
                    ("" + JSON.stringify(config.strides)));
            }
        }
        _this.padding = config.padding == null ? 'valid' : config.padding;
        common_2.checkPaddingMode(_this.padding);
        _this.inputSpec = [new topology_1.InputSpec({ ndim: 3 })];
        return _this;
    }
    Pooling1D.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var length = conv_utils_1.convOutputLength(inputShape[1], this.poolSize[0], this.padding, this.strides[0]);
        return [inputShape[0], length, inputShape[2]];
    };
    Pooling1D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            inputs = K.expandDims(generic_utils.getExactlyOneTensor(inputs), 2);
            var output = _this.poolingFunction(generic_utils.getExactlyOneTensor(inputs), [_this.poolSize[0], 1], [_this.strides[0], 1], _this.padding, 'channelsLast');
            return tfc.squeeze(output, [2]);
        });
    };
    Pooling1D.prototype.getConfig = function () {
        var config = {
            poolSize: this.poolSize,
            padding: this.padding,
            strides: this.strides,
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    return Pooling1D;
}(topology_2.Layer));
exports.Pooling1D = Pooling1D;
var MaxPooling1D = (function (_super) {
    __extends(MaxPooling1D, _super);
    function MaxPooling1D(config) {
        return _super.call(this, config) || this;
    }
    MaxPooling1D.prototype.poolingFunction = function (inputs, poolSize, strides, padding, dataFormat) {
        common_2.checkDataFormat(dataFormat);
        common_2.checkPaddingMode(padding);
        return pool2d(inputs, poolSize, strides, padding, dataFormat, 'max');
    };
    MaxPooling1D.className = 'MaxPooling1D';
    return MaxPooling1D;
}(Pooling1D));
exports.MaxPooling1D = MaxPooling1D;
tfjs_core_1.serialization.SerializationMap.register(MaxPooling1D);
var AveragePooling1D = (function (_super) {
    __extends(AveragePooling1D, _super);
    function AveragePooling1D(config) {
        return _super.call(this, config) || this;
    }
    AveragePooling1D.prototype.poolingFunction = function (inputs, poolSize, strides, padding, dataFormat) {
        common_2.checkDataFormat(dataFormat);
        common_2.checkPaddingMode(padding);
        return pool2d(inputs, poolSize, strides, padding, dataFormat, 'avg');
    };
    AveragePooling1D.className = 'AveragePooling1D';
    return AveragePooling1D;
}(Pooling1D));
exports.AveragePooling1D = AveragePooling1D;
tfjs_core_1.serialization.SerializationMap.register(AveragePooling1D);
var Pooling2D = (function (_super) {
    __extends(Pooling2D, _super);
    function Pooling2D(config) {
        var _this = this;
        if (config.poolSize == null) {
            config.poolSize = [2, 2];
        }
        _this = _super.call(this, config) || this;
        _this.poolSize = Array.isArray(config.poolSize) ?
            config.poolSize :
            [config.poolSize, config.poolSize];
        if (config.strides == null) {
            _this.strides = _this.poolSize;
        }
        else if (Array.isArray(config.strides)) {
            if (config.strides.length !== 2) {
                throw new errors_1.ValueError("If the strides property of a 2D pooling layer is an Array, " +
                    "it is expected to have a length of 2, but received length " +
                    (config.strides.length + "."));
            }
            _this.strides = config.strides;
        }
        else {
            _this.strides = [config.strides, config.strides];
        }
        _this.padding = config.padding == null ? 'valid' : config.padding;
        _this.dataFormat =
            config.dataFormat == null ? 'channelsLast' : config.dataFormat;
        common_2.checkDataFormat(_this.dataFormat);
        common_2.checkPaddingMode(_this.padding);
        _this.inputSpec = [new topology_1.InputSpec({ ndim: 4 })];
        return _this;
    }
    Pooling2D.prototype.computeOutputShape = function (inputShape) {
        inputShape = generic_utils.getExactlyOneShape(inputShape);
        var rows = this.dataFormat === 'channelsFirst' ? inputShape[2] : inputShape[1];
        var cols = this.dataFormat === 'channelsFirst' ? inputShape[3] : inputShape[2];
        rows =
            conv_utils_1.convOutputLength(rows, this.poolSize[0], this.padding, this.strides[0]);
        cols =
            conv_utils_1.convOutputLength(cols, this.poolSize[1], this.padding, this.strides[1]);
        if (this.dataFormat === 'channelsFirst') {
            return [inputShape[0], inputShape[1], rows, cols];
        }
        else {
            return [inputShape[0], rows, cols, inputShape[3]];
        }
    };
    Pooling2D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            _this.invokeCallHook(inputs, kwargs);
            return _this.poolingFunction(generic_utils.getExactlyOneTensor(inputs), _this.poolSize, _this.strides, _this.padding, _this.dataFormat);
        });
    };
    Pooling2D.prototype.getConfig = function () {
        var config = {
            poolSize: this.poolSize,
            padding: this.padding,
            strides: this.strides,
            dataFormat: this.dataFormat
        };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    return Pooling2D;
}(topology_2.Layer));
exports.Pooling2D = Pooling2D;
var MaxPooling2D = (function (_super) {
    __extends(MaxPooling2D, _super);
    function MaxPooling2D(config) {
        return _super.call(this, config) || this;
    }
    MaxPooling2D.prototype.poolingFunction = function (inputs, poolSize, strides, padding, dataFormat) {
        common_2.checkDataFormat(dataFormat);
        common_2.checkPaddingMode(padding);
        return pool2d(inputs, poolSize, strides, padding, dataFormat, 'max');
    };
    MaxPooling2D.className = 'MaxPooling2D';
    return MaxPooling2D;
}(Pooling2D));
exports.MaxPooling2D = MaxPooling2D;
tfjs_core_1.serialization.SerializationMap.register(MaxPooling2D);
var AveragePooling2D = (function (_super) {
    __extends(AveragePooling2D, _super);
    function AveragePooling2D(config) {
        return _super.call(this, config) || this;
    }
    AveragePooling2D.prototype.poolingFunction = function (inputs, poolSize, strides, padding, dataFormat) {
        common_2.checkDataFormat(dataFormat);
        common_2.checkPaddingMode(padding);
        return pool2d(inputs, poolSize, strides, padding, dataFormat, 'avg');
    };
    AveragePooling2D.className = 'AveragePooling2D';
    return AveragePooling2D;
}(Pooling2D));
exports.AveragePooling2D = AveragePooling2D;
tfjs_core_1.serialization.SerializationMap.register(AveragePooling2D);
var GlobalPooling1D = (function (_super) {
    __extends(GlobalPooling1D, _super);
    function GlobalPooling1D(config) {
        var _this = _super.call(this, config) || this;
        _this.inputSpec = [new topology_1.InputSpec({ ndim: 3 })];
        return _this;
    }
    GlobalPooling1D.prototype.computeOutputShape = function (inputShape) {
        return [inputShape[0], inputShape[2]];
    };
    GlobalPooling1D.prototype.call = function (inputs, kwargs) {
        throw new errors_1.NotImplementedError();
    };
    return GlobalPooling1D;
}(topology_2.Layer));
exports.GlobalPooling1D = GlobalPooling1D;
var GlobalAveragePooling1D = (function (_super) {
    __extends(GlobalAveragePooling1D, _super);
    function GlobalAveragePooling1D(config) {
        return _super.call(this, config) || this;
    }
    GlobalAveragePooling1D.prototype.call = function (inputs, kwargs) {
        return tfjs_core_1.tidy(function () {
            var input = generic_utils.getExactlyOneTensor(inputs);
            return tfc.mean(input, 1);
        });
    };
    GlobalAveragePooling1D.className = 'GlobalAveragePooling1D';
    return GlobalAveragePooling1D;
}(GlobalPooling1D));
exports.GlobalAveragePooling1D = GlobalAveragePooling1D;
tfjs_core_1.serialization.SerializationMap.register(GlobalAveragePooling1D);
var GlobalMaxPooling1D = (function (_super) {
    __extends(GlobalMaxPooling1D, _super);
    function GlobalMaxPooling1D(config) {
        return _super.call(this, config) || this;
    }
    GlobalMaxPooling1D.prototype.call = function (inputs, kwargs) {
        return tfjs_core_1.tidy(function () {
            var input = generic_utils.getExactlyOneTensor(inputs);
            return tfc.max(input, 1);
        });
    };
    GlobalMaxPooling1D.className = 'GlobalMaxPooling1D';
    return GlobalMaxPooling1D;
}(GlobalPooling1D));
exports.GlobalMaxPooling1D = GlobalMaxPooling1D;
tfjs_core_1.serialization.SerializationMap.register(GlobalMaxPooling1D);
var GlobalPooling2D = (function (_super) {
    __extends(GlobalPooling2D, _super);
    function GlobalPooling2D(config) {
        var _this = _super.call(this, config) || this;
        _this.dataFormat =
            config.dataFormat == null ? 'channelsLast' : config.dataFormat;
        common_2.checkDataFormat(_this.dataFormat);
        _this.inputSpec = [new topology_1.InputSpec({ ndim: 4 })];
        return _this;
    }
    GlobalPooling2D.prototype.computeOutputShape = function (inputShape) {
        inputShape = inputShape;
        if (this.dataFormat === 'channelsLast') {
            return [inputShape[0], inputShape[3]];
        }
        else {
            return [inputShape[0], inputShape[1]];
        }
    };
    GlobalPooling2D.prototype.call = function (inputs, kwargs) {
        throw new errors_1.NotImplementedError();
    };
    GlobalPooling2D.prototype.getConfig = function () {
        var config = { dataFormat: this.dataFormat };
        var baseConfig = _super.prototype.getConfig.call(this);
        Object.assign(config, baseConfig);
        return config;
    };
    return GlobalPooling2D;
}(topology_2.Layer));
exports.GlobalPooling2D = GlobalPooling2D;
var GlobalAveragePooling2D = (function (_super) {
    __extends(GlobalAveragePooling2D, _super);
    function GlobalAveragePooling2D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalAveragePooling2D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var input = generic_utils.getExactlyOneTensor(inputs);
            if (_this.dataFormat === 'channelsLast') {
                return tfc.mean(input, [1, 2]);
            }
            else {
                return tfc.mean(input, [2, 3]);
            }
        });
    };
    GlobalAveragePooling2D.className = 'GlobalAveragePooling2D';
    return GlobalAveragePooling2D;
}(GlobalPooling2D));
exports.GlobalAveragePooling2D = GlobalAveragePooling2D;
tfjs_core_1.serialization.SerializationMap.register(GlobalAveragePooling2D);
var GlobalMaxPooling2D = (function (_super) {
    __extends(GlobalMaxPooling2D, _super);
    function GlobalMaxPooling2D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalMaxPooling2D.prototype.call = function (inputs, kwargs) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var input = generic_utils.getExactlyOneTensor(inputs);
            if (_this.dataFormat === 'channelsLast') {
                return tfc.max(input, [1, 2]);
            }
            else {
                return tfc.max(input, [2, 3]);
            }
        });
    };
    GlobalMaxPooling2D.className = 'GlobalMaxPooling2D';
    return GlobalMaxPooling2D;
}(GlobalPooling2D));
exports.GlobalMaxPooling2D = GlobalMaxPooling2D;
tfjs_core_1.serialization.SerializationMap.register(GlobalMaxPooling2D);
//# sourceMappingURL=pooling.js.map