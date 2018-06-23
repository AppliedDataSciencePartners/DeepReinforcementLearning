"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var common_1 = require("./common");
var _nextUniqueTensorId = 0;
function getNextUniqueTensorId() {
    return _nextUniqueTensorId++;
}
exports.getNextUniqueTensorId = getNextUniqueTensorId;
var SymbolicTensor = (function () {
    function SymbolicTensor(dtype, shape, sourceLayer, inputs, callArgs, name, outputTensorIndex) {
        this.dtype = dtype;
        this.shape = shape;
        this.sourceLayer = sourceLayer;
        this.inputs = inputs;
        this.callArgs = callArgs;
        this.outputTensorIndex = outputTensorIndex;
        this.id = getNextUniqueTensorId();
        if (name != null) {
            this.originalName = common_1.getScopedTensorName(name);
            this.name = common_1.getUniqueTensorName(this.originalName);
        }
        this.rank = shape.length;
    }
    SymbolicTensor = __decorate([
        tfjs_core_1.doc({ heading: 'Models', 'subheading': 'Classes' })
    ], SymbolicTensor);
    return SymbolicTensor;
}());
exports.SymbolicTensor = SymbolicTensor;
//# sourceMappingURL=types.js.map