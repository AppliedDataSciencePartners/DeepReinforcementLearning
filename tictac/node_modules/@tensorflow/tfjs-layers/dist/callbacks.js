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
var generic_utils = require("./utils/generic_utils");
var Callback = (function () {
    function Callback() {
        this.validationData = null;
        this.model = null;
    }
    Callback.prototype.setParams = function (params) {
        this.params = params;
    };
    Callback.prototype.setModel = function (model) {
        this.model = model;
    };
    Callback.prototype.onEpochBegin = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Callback.prototype.onEpochEnd = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Callback.prototype.onBatchBegin = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Callback.prototype.onBatchEnd = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Callback.prototype.onTrainBegin = function (logs) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Callback.prototype.onTrainEnd = function (logs) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    return Callback;
}());
exports.Callback = Callback;
var CallbackList = (function () {
    function CallbackList(callbacks, queueLength) {
        if (queueLength === void 0) { queueLength = 10; }
        if (callbacks == null) {
            callbacks = [];
        }
        this.callbacks = callbacks;
        this.queueLength = queueLength;
    }
    CallbackList.prototype.append = function (callback) {
        this.callbacks.push(callback);
    };
    CallbackList.prototype.setParams = function (params) {
        for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            callback.setParams(params);
        }
    };
    CallbackList.prototype.setModel = function (model) {
        for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            callback.setModel(model);
        }
    };
    CallbackList.prototype.onEpochBegin = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (logs == null) {
                            logs = {};
                        }
                        _i = 0, _a = this.callbacks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        callback = _a[_i];
                        return [4, callback.onEpochBegin(epoch, logs)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    CallbackList.prototype.onEpochEnd = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (logs == null) {
                            logs = {};
                        }
                        _i = 0, _a = this.callbacks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        callback = _a[_i];
                        return [4, callback.onEpochEnd(epoch, logs)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    CallbackList.prototype.onBatchBegin = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (logs == null) {
                            logs = {};
                        }
                        _i = 0, _a = this.callbacks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        callback = _a[_i];
                        return [4, callback.onBatchBegin(batch, logs)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    CallbackList.prototype.onBatchEnd = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (logs == null) {
                            logs = {};
                        }
                        _i = 0, _a = this.callbacks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        callback = _a[_i];
                        return [4, callback.onBatchEnd(batch, logs)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    CallbackList.prototype.onTrainBegin = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (logs == null) {
                            logs = {};
                        }
                        _i = 0, _a = this.callbacks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        callback = _a[_i];
                        return [4, callback.onTrainBegin(logs)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    CallbackList.prototype.onTrainEnd = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (logs == null) {
                            logs = {};
                        }
                        _i = 0, _a = this.callbacks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        callback = _a[_i];
                        return [4, callback.onTrainEnd(logs)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    return CallbackList;
}());
exports.CallbackList = CallbackList;
var BaseLogger = (function (_super) {
    __extends(BaseLogger, _super);
    function BaseLogger() {
        return _super.call(this) || this;
    }
    BaseLogger.prototype.onEpochBegin = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.seen = 0;
                this.totals = {};
                return [2];
            });
        });
    };
    BaseLogger.prototype.onBatchEnd = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var batchSize, _loop_1, this_1, key;
            return __generator(this, function (_a) {
                if (logs == null) {
                    logs = {};
                }
                batchSize = logs['size'] == null ? 0 : logs['size'];
                this.seen += batchSize;
                _loop_1 = function (key) {
                    var value = logs[key];
                    if (typeof value === 'number') {
                        if (!this_1.totals.hasOwnProperty(key)) {
                            this_1.totals[key] = 0;
                        }
                        this_1.totals[key] = this_1.totals[key] + value * batchSize;
                    }
                    else {
                        var oldTotalsToDispose = void 0;
                        if (key in this_1.totals) {
                            oldTotalsToDispose = this_1.totals[key];
                        }
                        else {
                            this_1.totals[key] = K.getScalar(0);
                        }
                        this_1.totals[key] = tfjs_core_1.tidy(function () { return K.scalarPlusArray(_this.totals[key], tfjs_core_1.mul(value, K.getScalar(batchSize))); });
                        if (oldTotalsToDispose != null) {
                            oldTotalsToDispose.dispose();
                        }
                    }
                };
                this_1 = this;
                for (key in logs) {
                    _loop_1(key);
                }
                return [2];
            });
        });
    };
    BaseLogger.prototype.onEpochEnd = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _loop_2, this_2, _i, _a, key;
            return __generator(this, function (_b) {
                if (logs != null) {
                    _loop_2 = function (key) {
                        if (this_2.totals[key] == null) {
                            return "continue";
                        }
                        if (typeof this_2.totals[key] === 'number') {
                            logs[key] = this_2.totals[key] / this_2.seen;
                        }
                        else {
                            tfjs_core_1.tidy(function () {
                                logs[key] =
                                    K.scalarTimesArray(tfjs_core_1.div(K.getScalar(1), K.getScalar(_this.seen)), _this.totals[key]);
                                _this.totals[key].dispose();
                                tfjs_core_1.keep(logs[key]);
                            });
                        }
                    };
                    this_2 = this;
                    for (_i = 0, _a = this.params['metrics']; _i < _a.length; _i++) {
                        key = _a[_i];
                        _loop_2(key);
                    }
                }
                return [2];
            });
        });
    };
    return BaseLogger;
}(Callback));
exports.BaseLogger = BaseLogger;
function resolveScalarsInLogs(logs) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, keys, key, value, valueScalar, values, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (logs == null) {
                        return [2];
                    }
                    promises = [];
                    keys = [];
                    for (key in logs) {
                        value = logs[key];
                        if (typeof value !== 'number') {
                            valueScalar = value;
                            promises.push(valueScalar.data());
                            keys.push(key);
                        }
                    }
                    return [4, Promise.all(promises)];
                case 1:
                    values = _a.sent();
                    for (i = 0; i < values.length; ++i) {
                        logs[keys[i]] = values[i][0];
                    }
                    return [2];
            }
        });
    });
}
exports.resolveScalarsInLogs = resolveScalarsInLogs;
function disposeTensorsInLogs(logs) {
    if (logs == null) {
        return;
    }
    for (var key in logs) {
        var value = logs[key];
        if (typeof value !== 'number') {
            value.dispose();
        }
    }
}
exports.disposeTensorsInLogs = disposeTensorsInLogs;
var History = (function (_super) {
    __extends(History, _super);
    function History() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    History.prototype.onTrainBegin = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.epoch = [];
                this.history = {};
                return [2];
            });
        });
    };
    History.prototype.onEpochEnd = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                if (logs == null) {
                    logs = {};
                }
                this.epoch.push(epoch);
                for (key in logs) {
                    if (this.history[key] == null) {
                        this.history[key] = [];
                    }
                    this.history[key].push(logs[key]);
                }
                return [2];
            });
        });
    };
    History.prototype.syncData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises, keys, indices, key, valueArray, i, valueScalar, values, n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        keys = [];
                        indices = [];
                        for (key in this.history) {
                            valueArray = this.history[key];
                            for (i = 0; i < valueArray.length; ++i) {
                                if (typeof valueArray[i] !== 'number') {
                                    valueScalar = valueArray[i];
                                    promises.push(valueScalar.data());
                                    keys.push(key);
                                    indices.push(i);
                                }
                            }
                        }
                        return [4, Promise.all(promises)];
                    case 1:
                        values = _a.sent();
                        for (n = 0; n < values.length; ++n) {
                            this.history[keys[n]][indices[n]].dispose();
                            this.history[keys[n]][indices[n]] = values[n][0];
                        }
                        return [2];
                }
            });
        });
    };
    return History;
}(Callback));
exports.History = History;
var CustomCallback = (function (_super) {
    __extends(CustomCallback, _super);
    function CustomCallback(config) {
        var _this = _super.call(this) || this;
        _this.trainBegin = config.onTrainBegin;
        _this.trainEnd = config.onTrainEnd;
        _this.epochBegin = config.onEpochBegin;
        _this.epochEnd = config.onEpochEnd;
        _this.batchBegin = config.onBatchBegin;
        _this.batchEnd = config.onBatchEnd;
        return _this;
    }
    CustomCallback.prototype.onEpochBegin = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.epochBegin != null)) return [3, 3];
                        return [4, resolveScalarsInLogs(logs)];
                    case 1:
                        _a.sent();
                        return [4, this.epochBegin(epoch, logs)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    CustomCallback.prototype.onEpochEnd = function (epoch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.epochEnd != null)) return [3, 3];
                        return [4, resolveScalarsInLogs(logs)];
                    case 1:
                        _a.sent();
                        return [4, this.epochEnd(epoch, logs)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    CustomCallback.prototype.onBatchBegin = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.batchBegin != null)) return [3, 3];
                        return [4, resolveScalarsInLogs(logs)];
                    case 1:
                        _a.sent();
                        return [4, this.batchBegin(batch, logs)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    CustomCallback.prototype.onBatchEnd = function (batch, logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.batchEnd != null)) return [3, 3];
                        return [4, resolveScalarsInLogs(logs)];
                    case 1:
                        _a.sent();
                        return [4, this.batchEnd(batch, logs)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    CustomCallback.prototype.onTrainBegin = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.trainBegin != null)) return [3, 3];
                        return [4, resolveScalarsInLogs(logs)];
                    case 1:
                        _a.sent();
                        return [4, this.trainBegin(logs)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    CustomCallback.prototype.onTrainEnd = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.trainEnd != null)) return [3, 3];
                        return [4, resolveScalarsInLogs(logs)];
                    case 1:
                        _a.sent();
                        return [4, this.trainEnd(logs)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    return CustomCallback;
}(Callback));
exports.CustomCallback = CustomCallback;
function standardizeCallbacks(callbacks) {
    if (callbacks == null) {
        return null;
    }
    if (callbacks instanceof Callback) {
        return [callbacks];
    }
    if (Array.isArray(callbacks) && callbacks[0] instanceof Callback) {
        return callbacks;
    }
    var callbackConfigs = generic_utils.toList(callbacks);
    return callbackConfigs.map(function (callbackConfig) { return new CustomCallback(callbackConfig); });
}
exports.standardizeCallbacks = standardizeCallbacks;
//# sourceMappingURL=callbacks.js.map