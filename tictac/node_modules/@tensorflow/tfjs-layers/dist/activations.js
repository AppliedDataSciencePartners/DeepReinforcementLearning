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
var K = require("./backend/tfjs_backend");
var generic_utils_1 = require("./utils/generic_utils");
var Activation = (function (_super) {
    __extends(Activation, _super);
    function Activation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Activation.prototype.getConfig = function () {
        return {};
    };
    return Activation;
}(tfjs_core_1.serialization.Serializable));
exports.Activation = Activation;
var Elu = (function (_super) {
    __extends(Elu, _super);
    function Elu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Elu.prototype.apply = function (x, alpha) {
        if (alpha === void 0) { alpha = 1; }
        return K.elu(x, alpha);
    };
    Elu.className = 'elu';
    return Elu;
}(Activation));
exports.Elu = Elu;
tfjs_core_1.serialization.SerializationMap.register(Elu);
var Selu = (function (_super) {
    __extends(Selu, _super);
    function Selu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Selu.prototype.apply = function (x) {
        return tfc.selu(x);
    };
    Selu.className = 'selu';
    return Selu;
}(Activation));
exports.Selu = Selu;
tfjs_core_1.serialization.SerializationMap.register(Selu);
var Relu = (function (_super) {
    __extends(Relu, _super);
    function Relu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Relu.prototype.apply = function (x) {
        return tfc.relu(x);
    };
    Relu.className = 'relu';
    return Relu;
}(Activation));
exports.Relu = Relu;
tfjs_core_1.serialization.SerializationMap.register(Relu);
var Relu6 = (function (_super) {
    __extends(Relu6, _super);
    function Relu6() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Relu6.prototype.apply = function (x) {
        return tfjs_core_1.tidy(function () { return tfc.minimum(K.getScalar(6.0), tfc.relu(x)); });
    };
    Relu6.className = 'relu6';
    return Relu6;
}(Activation));
exports.Relu6 = Relu6;
tfjs_core_1.serialization.SerializationMap.register(Relu6);
var Linear = (function (_super) {
    __extends(Linear, _super);
    function Linear() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Linear.prototype.apply = function (x) {
        return x;
    };
    Linear.className = 'linear';
    return Linear;
}(Activation));
exports.Linear = Linear;
tfjs_core_1.serialization.SerializationMap.register(Linear);
var Sigmoid = (function (_super) {
    __extends(Sigmoid, _super);
    function Sigmoid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sigmoid.prototype.apply = function (x) {
        return tfc.sigmoid(x);
    };
    Sigmoid.className = 'sigmoid';
    return Sigmoid;
}(Activation));
exports.Sigmoid = Sigmoid;
tfjs_core_1.serialization.SerializationMap.register(Sigmoid);
var HardSigmoid = (function (_super) {
    __extends(HardSigmoid, _super);
    function HardSigmoid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HardSigmoid.prototype.apply = function (x) {
        return K.hardSigmoid(x);
    };
    HardSigmoid.className = 'hardSigmoid';
    return HardSigmoid;
}(Activation));
exports.HardSigmoid = HardSigmoid;
tfjs_core_1.serialization.SerializationMap.register(HardSigmoid);
var Softplus = (function (_super) {
    __extends(Softplus, _super);
    function Softplus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Softplus.prototype.apply = function (x) {
        return tfc.softplus(x);
    };
    Softplus.className = 'softplus';
    return Softplus;
}(Activation));
exports.Softplus = Softplus;
tfjs_core_1.serialization.SerializationMap.register(Softplus);
var Softsign = (function (_super) {
    __extends(Softsign, _super);
    function Softsign() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Softsign.prototype.apply = function (x) {
        return K.softsign(x);
    };
    Softsign.className = 'softsign';
    return Softsign;
}(Activation));
exports.Softsign = Softsign;
tfjs_core_1.serialization.SerializationMap.register(Softsign);
var Tanh = (function (_super) {
    __extends(Tanh, _super);
    function Tanh() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tanh.prototype.apply = function (x) {
        return tfc.tanh(x);
    };
    Tanh.className = 'tanh';
    return Tanh;
}(Activation));
exports.Tanh = Tanh;
tfjs_core_1.serialization.SerializationMap.register(Tanh);
var Softmax = (function (_super) {
    __extends(Softmax, _super);
    function Softmax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Softmax.prototype.apply = function (x, axis) {
        if (axis === void 0) { axis = (-1); }
        return tfc.softmax(x, axis);
    };
    Softmax.className = 'softmax';
    return Softmax;
}(Activation));
exports.Softmax = Softmax;
tfjs_core_1.serialization.SerializationMap.register(Softmax);
function serializeActivation(activation) {
    return activation.getClassName();
}
exports.serializeActivation = serializeActivation;
function deserializeActivation(config, customObjects) {
    if (customObjects === void 0) { customObjects = {}; }
    return generic_utils_1.deserializeKerasObject(config, tfjs_core_1.serialization.SerializationMap.getMap().classNameMap, customObjects, 'activation');
}
exports.deserializeActivation = deserializeActivation;
function getActivation(identifier) {
    if (identifier == null) {
        var config = { className: 'linear', config: {} };
        return deserializeActivation(config);
    }
    if (typeof identifier === 'string') {
        var config = { className: identifier, config: {} };
        return deserializeActivation(config);
    }
    else if (identifier instanceof Activation) {
        return identifier;
    }
    else {
        return deserializeActivation(identifier);
    }
}
exports.getActivation = getActivation;
//# sourceMappingURL=activations.js.map