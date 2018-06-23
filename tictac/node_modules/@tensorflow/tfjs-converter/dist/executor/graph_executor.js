"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var utils_1 = require("../operations/executors/utils");
var operation_executor_1 = require("../operations/operation_executor");
var execution_context_1 = require("./execution_context");
var GraphExecutor = (function () {
    function GraphExecutor(graph) {
        this.graph = graph;
        this.compiledOrder = [];
        this._weightMap = {};
        this.placeholders = graph.placeholders;
        this._outputs = graph.outputs;
        this.compile();
    }
    Object.defineProperty(GraphExecutor.prototype, "weightMap", {
        get: function () {
            return this._weightMap;
        },
        set: function (weightMap) {
            var weightIds = Object.keys(weightMap).map(function (key) { return weightMap[key].map(function (tensor) { return tensor.id; }); });
            this.weightIds = [].concat.apply([], weightIds);
            this._weightMap = weightMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphExecutor.prototype, "inputs", {
        get: function () {
            return this.placeholders.map(function (node) {
                return {
                    name: node.name,
                    shape: node.params['shape'] ? node.params['shape'].value :
                        undefined,
                    dtype: node.params['dtype'] ? node.params['dtype'].value :
                        undefined
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphExecutor.prototype, "outputs", {
        get: function () {
            return this._outputs.map(function (node) {
                return {
                    name: node.name,
                    shape: node.params['shape'] ? node.params['shape'].value :
                        undefined,
                    dtype: node.params['dtype'] ? node.params['dtype'].value :
                        undefined
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphExecutor.prototype, "inputNodes", {
        get: function () {
            return this.placeholders.map(function (node) { return node.name; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphExecutor.prototype, "outputNodes", {
        get: function () {
            return this.outputs.map(function (node) { return node.name; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphExecutor.prototype, "isControlFlowModel", {
        get: function () {
            return this.graph.withControlFlow;
        },
        enumerable: true,
        configurable: true
    });
    GraphExecutor.prototype.compile = function () {
        if (this.graph.withControlFlow) {
            return;
        }
        var stack = this.graph.inputs.slice();
        var visited = {};
        while (stack.length > 0) {
            var node = stack.pop();
            visited[node.name] = true;
            this.compiledOrder.push(node);
            node.children.forEach(function (childNode) {
                if (!visited[childNode.name] && childNode.inputNames.every(function (name) {
                    var nodeName = utils_1.getNodeNameAndIndex(name)[0];
                    return visited[nodeName];
                })) {
                    stack.push(childNode);
                }
            });
        }
    };
    GraphExecutor.prototype.execute = function (inputs, outputs) {
        var _this = this;
        this.checkInput(inputs);
        this.checkInputShapeAndType(inputs);
        var result = tfjs_core_1.tidy(function () {
            var context = new execution_context_1.ExecutionContext(_this._weightMap);
            var tensors = _this.compiledOrder.reduce(function (map, node) {
                map[node.name] = operation_executor_1.executeOp(node, map, context);
                return map;
            }, __assign({}, _this.weightMap, inputs));
            return _this.findOutputs(tensors, context, outputs);
        });
        return result;
    };
    GraphExecutor.prototype.executeAsync = function (inputs, outputs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var context, tensors, results, outputIds, inputIdArray, inputIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInput(inputs);
                        this.checkInputShapeAndType(inputs);
                        context = new execution_context_1.ExecutionContext(this._weightMap);
                        return [4, this.executeWithControlFlow(inputs, context)];
                    case 1:
                        tensors = _a.sent();
                        results = this.findOutputs(tensors, context, outputs);
                        outputIds = Object.keys(results).map(function (key) { return results[key].id; });
                        inputIdArray = Object.keys(inputs).map(function (key) { return inputs[key].map(function (input) { return input.id; }); });
                        inputIds = [].concat.apply([], inputIdArray);
                        Object.keys(tensors).forEach(function (key) {
                            var tensorArray = tensors[key];
                            tensorArray.forEach(function (tensor) {
                                if (tensor && outputIds.indexOf(tensor.id) === -1 &&
                                    inputIds.indexOf(tensor.id) === -1 &&
                                    _this.weightIds.indexOf(tensor.id) === -1) {
                                    tensor.dispose();
                                }
                            });
                        });
                        return [2, results];
                }
            });
        });
    };
    GraphExecutor.prototype.executeWithControlFlow = function (inputs, context) {
        return __awaiter(this, void 0, void 0, function () {
            var stack, tensorMap, added, item, tensors, nodeName, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        stack = this.graph.inputs.map(function (node) {
                            return { node: node, contexts: context.currentContext };
                        });
                        tensorMap = __assign({}, this.weightMap, inputs);
                        added = {};
                        _c.label = 1;
                    case 1:
                        if (!(stack.length > 0)) return [3, 3];
                        item = stack.pop();
                        context.currentContext = item.contexts;
                        tensors = operation_executor_1.executeOp(item.node, tensorMap, context);
                        nodeName = utils_1.getNodeNameAndIndex(item.node.name, context)[0];
                        _a = tensorMap;
                        _b = nodeName;
                        return [4, tensors];
                    case 2:
                        _a[_b] = _c.sent();
                        item.node.children.forEach(function (childNode) {
                            var nodeName = utils_1.getNodeNameAndIndex(childNode.name, context)[0];
                            if (!added[nodeName]) {
                                if (childNode.op === 'merge') {
                                    if (childNode.inputNames.some(function (name) {
                                        return !!utils_1.getTensor(name, tensorMap, context);
                                    })) {
                                        added[nodeName] = true;
                                        stack.push({ contexts: context.currentContext, node: childNode });
                                    }
                                }
                                else if (childNode.inputNames.every(function (name) {
                                    return !!utils_1.getTensor(name, tensorMap, context);
                                })) {
                                    added[nodeName] = true;
                                    stack.push({ contexts: context.currentContext, node: childNode });
                                }
                            }
                        });
                        return [3, 1];
                    case 3: return [2, tensorMap];
                }
            });
        });
    };
    GraphExecutor.prototype.findOutputs = function (tensorMap, context, outputs) {
        if (outputs && !(outputs instanceof Array)) {
            outputs = [outputs];
        }
        var requestedOutputs = (outputs || this.graph.outputs.map(function (node) { return node.name; }));
        return requestedOutputs.reduce(function (map, name) {
            map[name] = utils_1.getTensor(name, tensorMap, context);
            return map;
        }, {});
    };
    GraphExecutor.prototype.dispose = function () {
        var _this = this;
        Object.keys(this.weightMap)
            .forEach(function (key) { return _this.weightMap[key].forEach(function (tensor) { return tensor.dispose(); }); });
    };
    GraphExecutor.prototype.checkInputShapeAndType = function (inputs) {
        this.placeholders.forEach(function (node) {
            var input = inputs[node.name][0];
            if (node.params['shape'] && node.params['shape'].value) {
                var shape_1 = node.params['shape'].value;
                var match = shape_1.length === input.shape.length &&
                    input.shape.every(function (dim, index) { return shape_1[index] === -1 || shape_1[index] === dim; });
                tfjs_core_1.util.assert(match, "The shape of dict['" + node.name + "'] provided in model.execute(dict) must be [" + shape_1 + "], but was [" + input.shape + "]");
            }
            if (node.params['dtype'] && node.params['dtype'].value) {
                tfjs_core_1.util.assert(input.dtype === node.params['dtype'].value, "The dtype of dict['" + node.name + "'] provided in model.execute(dict) must be " + node.params['dtype'].value + ", but was " + input.dtype);
            }
        });
    };
    GraphExecutor.prototype.checkInput = function (inputs) {
        var _this = this;
        var inputKeys = Object.keys(inputs);
        var missing = [];
        var extra = [];
        this.inputNodes.forEach(function (name) {
            if (inputKeys.indexOf(name) === -1)
                missing.push(name);
        });
        inputKeys.forEach(function (name) {
            if (_this.inputNodes.indexOf(name) === -1)
                extra.push(name);
        });
        if (missing.length > 0) {
            throw new Error("The dict provided in model.execute(dict) has the keys " +
                ("[" + inputKeys + "], but is missing the required keys: [" + missing + "]."));
        }
        if (extra.length > 0) {
            throw new Error("The dict provided in model.execute(dict) has " +
                ("unused keys: [" + extra + "]. Please provide only the following keys: ") +
                ("[" + this.inputNodes + "]."));
        }
    };
    return GraphExecutor;
}());
exports.GraphExecutor = GraphExecutor;
//# sourceMappingURL=graph_executor.js.map