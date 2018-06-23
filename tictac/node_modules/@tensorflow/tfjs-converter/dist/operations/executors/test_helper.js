"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createNumberAttr(value) {
    return { value: value, type: 'number' };
}
exports.createNumberAttr = createNumberAttr;
function createNumberAttrFromIndex(inputIndex) {
    return { inputIndex: inputIndex, type: 'number' };
}
exports.createNumberAttrFromIndex = createNumberAttrFromIndex;
function createStrAttr(str) {
    return { value: str, type: 'string' };
}
exports.createStrAttr = createStrAttr;
function createBoolAttr(value) {
    return { value: value, type: 'bool' };
}
exports.createBoolAttr = createBoolAttr;
function createNumericArrayAttr(value) {
    return { value: value, type: 'number[]' };
}
exports.createNumericArrayAttr = createNumericArrayAttr;
function createNumericArrayAttrFromIndex(inputIndex) {
    return { inputIndex: inputIndex, type: 'number[]' };
}
exports.createNumericArrayAttrFromIndex = createNumericArrayAttrFromIndex;
function createTensorAttr(index) {
    return { inputIndex: index, type: 'tensor' };
}
exports.createTensorAttr = createTensorAttr;
function createTensorsAttr(index, paramLength) {
    return { inputIndex: index, inputParamLength: paramLength, type: 'tensors' };
}
exports.createTensorsAttr = createTensorsAttr;
function createDtypeAttr(dtype) {
    return { value: dtype, type: 'dtype' };
}
exports.createDtypeAttr = createDtypeAttr;
//# sourceMappingURL=test_helper.js.map