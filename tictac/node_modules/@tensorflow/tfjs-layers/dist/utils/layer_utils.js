"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_utils_1 = require("./generic_utils");
function printSummary(model, lineLength, positions, printFn) {
    if (printFn === void 0) { printFn = console.log; }
    var sequentialLike = isModelSequentialLike(model);
    var toDisplay = ['Layer (type)', 'Output shape', 'Param #'];
    if (sequentialLike) {
        lineLength = lineLength || 65;
        positions = positions || [0.45, 0.85, 1];
    }
    else {
        lineLength = lineLength || 98;
        positions = positions || [0.33, 0.55, 0.67, 1];
    }
    if (positions[positions.length - 1] <= 1) {
        positions = positions.map(function (p) { return Math.floor(lineLength * p); });
    }
    var relevantNodes;
    if (!sequentialLike) {
        toDisplay.push('Receives inputs');
        relevantNodes = [];
        for (var depth in model.nodesByDepth) {
            relevantNodes.push.apply(relevantNodes, model.nodesByDepth[depth]);
        }
    }
    printFn('_'.repeat(lineLength));
    printRow(toDisplay, positions, printFn);
    printFn('='.repeat(lineLength));
    var layers = model.layers;
    for (var i = 0; i < layers.length; ++i) {
        if (sequentialLike) {
            printLayerSummary(layers[i], positions, printFn);
        }
        else {
            printLayerSummaryWithConnections(layers[i], positions, relevantNodes, printFn);
        }
        printFn((i === layers.length - 1 ? '=' : '_').repeat(lineLength));
    }
    model.checkTrainableWeightsConsistency();
    var trainableCount;
    if (model.collectedTrainableWeights != null) {
        trainableCount =
            generic_utils_1.countParamsInWeights(model.collectedTrainableWeights);
    }
    else {
        trainableCount = generic_utils_1.countParamsInWeights(model.trainableWeights);
    }
    var nonTrainableCount = generic_utils_1.countParamsInWeights(model.nonTrainableWeights);
    printFn("Total params: " + (trainableCount + nonTrainableCount));
    printFn("Trainable params: " + trainableCount);
    printFn("Non-trainable params: " + nonTrainableCount);
    printFn('_'.repeat(lineLength));
}
exports.printSummary = printSummary;
function isModelSequentialLike(model) {
    var sequentialLike = true;
    var nodesByDepth = [];
    var nodes = [];
    for (var depth in model.nodesByDepth) {
        nodesByDepth.push(model.nodesByDepth[depth]);
    }
    for (var _i = 0, nodesByDepth_1 = nodesByDepth; _i < nodesByDepth_1.length; _i++) {
        var depthNodes = nodesByDepth_1[_i];
        if (depthNodes.length > 1 ||
            depthNodes.length === 1 && depthNodes[0].inboundLayers.length > 1) {
            sequentialLike = false;
            break;
        }
        nodes.push.apply(nodes, depthNodes);
    }
    if (sequentialLike) {
        for (var _a = 0, _b = model.layers; _a < _b.length; _a++) {
            var layer = _b[_a];
            var flag = false;
            for (var _c = 0, _d = layer.inboundNodes; _c < _d.length; _c++) {
                var node = _d[_c];
                if (nodes.indexOf(node) !== -1) {
                    if (flag) {
                        sequentialLike = false;
                        break;
                    }
                    else {
                        flag = true;
                    }
                }
            }
            if (!sequentialLike) {
                break;
            }
        }
    }
    return sequentialLike;
}
function printRow(fields, positions, printFn) {
    if (printFn === void 0) { printFn = console.log; }
    var line = '';
    for (var i = 0; i < fields.length; ++i) {
        if (i > 0) {
            line = line.slice(0, line.length - 1) + ' ';
        }
        line += fields[i];
        line = line.slice(0, positions[i]);
        line += ' '.repeat(positions[i] - line.length);
    }
    printFn(line);
}
function printLayerSummary(layer, positions, printFn) {
    var outputShape;
    try {
        outputShape = JSON.stringify(layer.outputShape);
    }
    catch (err) {
        outputShape = 'multiple';
    }
    var name = layer.name;
    var className = layer.getClassName();
    var fields = [name + " (" + className + ")", outputShape, layer.countParams().toString()];
    printRow(fields, positions, printFn);
}
function printLayerSummaryWithConnections(layer, positions, relevantNodes, printFn) {
    var outputShape;
    try {
        outputShape = JSON.stringify(layer.outputShape);
    }
    catch (err) {
        outputShape = 'multiple';
    }
    var connections = [];
    for (var _i = 0, _a = layer.inboundNodes; _i < _a.length; _i++) {
        var node = _a[_i];
        if (relevantNodes != null && relevantNodes.length > 0 &&
            relevantNodes.indexOf(node) === -1) {
            continue;
        }
        for (var i = 0; i < node.inboundLayers.length; ++i) {
            var inboundLayer = node.inboundLayers[i].name;
            var inboundLayerIndex = node.nodeIndices[i];
            var inboundTensorIndex = node.tensorIndices[i];
            connections.push(inboundLayer + "[" + inboundLayerIndex + "][" + inboundTensorIndex + "]");
        }
    }
    var name = layer.name;
    var className = layer.getClassName();
    var firstConnection = connections.length === 0 ? '' : connections[0];
    var fields = [
        name + " (" + className + ")", outputShape, layer.countParams().toString(),
        firstConnection
    ];
    printRow(fields, positions, printFn);
    for (var i = 1; i < connections.length; ++i) {
        printRow(['', '', '', connections[i]], positions, printFn);
    }
}
//# sourceMappingURL=layer_utils.js.map