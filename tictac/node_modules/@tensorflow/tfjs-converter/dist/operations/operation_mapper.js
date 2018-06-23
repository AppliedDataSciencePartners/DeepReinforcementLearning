"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiled_api_1 = require("../data/compiled_api");
var utils_1 = require("./executors/utils");
var arithmetic = require("./op_list/arithmetic.json");
var basicMath = require("./op_list/basic_math.json");
var control = require("./op_list/control.json");
var convolution = require("./op_list/convolution.json");
var creation = require("./op_list/creation.json");
var graph = require("./op_list/graph.json");
var image = require("./op_list/image.json");
var logical = require("./op_list/logical.json");
var matrices = require("./op_list/matrices.json");
var normalization = require("./op_list/normalization.json");
var reduction = require("./op_list/reduction.json");
var sliceJoin = require("./op_list/slice_join.json");
var transformation = require("./op_list/transformation.json");
var CONTROL_FLOW_OPS = ['Switch', 'Merge', 'Enter', 'Exit', 'NextIteration'];
var OperationMapper = (function () {
    function OperationMapper() {
        var ops = [
            arithmetic, basicMath, control, convolution, creation, logical, image,
            graph, matrices, normalization, reduction, sliceJoin, transformation
        ];
        var mappersJson = [].concat.apply([], ops.map(function (op) { return op.default ? op.default : op; }));
        this.opMappers = mappersJson.reduce(function (map, mapper) {
            map[mapper.tfOpName] = mapper;
            return map;
        }, {});
    }
    Object.defineProperty(OperationMapper, "Instance", {
        get: function () {
            return this._instance || (this._instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    OperationMapper.prototype.isControlFlow = function (node) {
        return CONTROL_FLOW_OPS.some(function (op) { return op === node.op; });
    };
    OperationMapper.prototype.transformGraph = function (graph) {
        var _this = this;
        var tfNodes = graph.node;
        var withControlFlow = false;
        var placeholders = [];
        var nodes = tfNodes.reduce(function (map, node) {
            map[node.name] = _this.mapNode(node);
            if (_this.isControlFlow(node))
                withControlFlow = true;
            if (node.op === 'Placeholder')
                placeholders.push(map[node.name]);
            return map;
        }, {});
        var inputs = [];
        var outputs = [];
        Object.keys(nodes).forEach(function (key) {
            var node = nodes[key];
            node.inputNames.forEach(function (name) {
                var nodeName = utils_1.getNodeNameAndIndex(name)[0];
                node.inputs.push(nodes[nodeName]);
                nodes[nodeName].children.push(node);
            });
            if (node.inputs.length === 0)
                inputs.push(node);
        });
        Object.keys(nodes).forEach(function (key) {
            var node = nodes[key];
            if (node.children.length === 0)
                outputs.push(node);
        });
        return { nodes: nodes, inputs: inputs, outputs: outputs, placeholders: placeholders, withControlFlow: withControlFlow };
    };
    OperationMapper.prototype.mapNode = function (node) {
        var _this = this;
        var mapper = this.opMappers[node.op];
        if (mapper === undefined) {
            throw new Error('Tensorflow Op is not supported: ' + node.op);
        }
        var newNode = {
            name: node.name,
            op: mapper.dlOpName,
            category: mapper.category,
            inputNames: (node.input ||
                []).map(function (input) { return input.startsWith('^') ? input.substr(1) : input; }),
            inputs: [],
            children: [],
            params: {}
        };
        if (!!mapper.params) {
            newNode.params = mapper.params.reduce(function (map, param) {
                var inputIndex = param.tfInputIndex;
                var inputParamLength = param.tfInputParamLength;
                var type = param.type;
                var value = undefined;
                if (inputIndex === undefined) {
                    switch (param.type) {
                        case 'string':
                            value = _this.getStringParam(node.attr, param.tfParamName, param.defaultValue);
                            if (value === undefined && !!param.tfParamNameDeprecated) {
                                value = _this.getStringParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                            }
                            break;
                        case 'number':
                            value = _this.getNumberParam(node.attr, param.tfParamName, param.defaultValue);
                            if (value === undefined && !!param.tfParamNameDeprecated) {
                                value = _this.getNumberParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                            }
                            break;
                        case 'number[]':
                            value = _this.getNumericArrayParam(node.attr, param.tfParamName, param.defaultValue);
                            if (value === undefined && !!param.tfParamNameDeprecated) {
                                value = _this.getNumericArrayParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                            }
                            break;
                        case 'bool':
                            value = _this.getBoolParam(node.attr, param.tfParamName, param.defaultValue);
                            if (value === undefined && !!param.tfParamNameDeprecated) {
                                value = _this.getBoolParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                            }
                            break;
                        case 'shape':
                            value = _this.getTensorShapeParam(node.attr, param.tfParamName, param.defaultValue);
                            if (value === undefined && !!param.tfParamNameDeprecated) {
                                value = _this.getTensorShapeParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                            }
                            break;
                        case 'dtype':
                            value = _this.getDtypeParam(node.attr, param.tfParamName, param.defaultValue);
                            if (value === undefined && !!param.tfParamNameDeprecated) {
                                value = _this.getDtypeParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                            }
                            break;
                        case 'tensor':
                        case 'tensors':
                            break;
                        default:
                            throw new Error("Unsupported param type: " + param.type + " for op: " + node.op);
                    }
                }
                map[param.dlParamName] = { value: value, inputIndex: inputIndex, type: type, inputParamLength: inputParamLength };
                return map;
            }, {});
        }
        return newNode;
    };
    OperationMapper.prototype.getStringParam = function (attrs, name, def, keepCase) {
        if (keepCase === void 0) { keepCase = false; }
        var param = attrs[name];
        if (param !== undefined) {
            var value = String.fromCharCode.apply(null, param.s);
            return keepCase ? value : value.toLowerCase();
        }
        return def;
    };
    OperationMapper.prototype.getBoolParam = function (attrs, name, def) {
        var param = attrs[name];
        return param ? param.b : def;
    };
    OperationMapper.prototype.getNumberParam = function (attrs, name, def) {
        var param = attrs[name];
        var value = (param ? ((param.f !== undefined) ? param.f : param.i) : def);
        return (typeof value === 'number') ? value : value['toInt']();
    };
    OperationMapper.prototype.getDtypeParam = function (attrs, name, def) {
        var param = attrs[name];
        if (param && param.type) {
            switch (param.type) {
                case compiled_api_1.tensorflow.DataType.DT_FLOAT:
                    return 'float32';
                case compiled_api_1.tensorflow.DataType.DT_INT32:
                    return 'int32';
                case compiled_api_1.tensorflow.DataType.DT_BOOL:
                    return 'bool';
                default:
                    return def;
            }
        }
        return def;
    };
    OperationMapper.prototype.getTensorShapeParam = function (attrs, name, def) {
        var param = attrs[name];
        if (param && param.shape) {
            return param.shape.dim.map(function (dim) { return dim.size; });
        }
        return def;
    };
    OperationMapper.prototype.getNumericArrayParam = function (attrs, name, def) {
        var param = attrs[name];
        if (param) {
            return ((param.list.f && param.list.f.length ? param.list.f :
                param.list.i))
                .map(function (v) { return (typeof v === 'number') ? v : v['toInt'](); });
        }
        return def;
    };
    return OperationMapper;
}());
exports.OperationMapper = OperationMapper;
//# sourceMappingURL=operation_mapper.js.map