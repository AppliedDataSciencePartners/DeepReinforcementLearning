"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var K = require("./backend/tfjs_backend");
var errors_1 = require("./errors");
function getOptimizer(identifier) {
    var optimizerMap = {
        'Adagrad': function () { return tfjs_core_1.train.adagrad(.01); },
        'Adadelta': function () { return tfjs_core_1.train.adadelta(1.0, 0.95, K.epsilon()); },
        'Adam': function () { return tfjs_core_1.train.adam(.001, .9, .999, K.epsilon()); },
        'Adamax': function () { return tfjs_core_1.train.adamax(0.002, .9, .999, K.epsilon(), 0.0); },
        'RMSProp': function () { return tfjs_core_1.train.rmsprop(.001, .9, null, K.epsilon()); },
        'SGD': function () { return tfjs_core_1.train.sgd(.01); }
    };
    optimizerMap['adagrad'] = optimizerMap['Adagrad'];
    optimizerMap['adadelta'] = optimizerMap['Adadelta'];
    optimizerMap['adam'] = optimizerMap['Adam'];
    optimizerMap['adamax'] = optimizerMap['Adamax'];
    optimizerMap['rmsprop'] = optimizerMap['RMSProp'];
    optimizerMap['sgd'] = optimizerMap['SGD'];
    if (identifier in optimizerMap) {
        return optimizerMap[identifier]();
    }
    throw new errors_1.ValueError("Unknown Optimizer " + identifier);
}
exports.getOptimizer = getOptimizer;
//# sourceMappingURL=optimizers.js.map