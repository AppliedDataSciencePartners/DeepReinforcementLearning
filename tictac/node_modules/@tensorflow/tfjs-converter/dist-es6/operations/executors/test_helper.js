export function createNumberAttr(value) {
    return { value: value, type: 'number' };
}
export function createNumberAttrFromIndex(inputIndex) {
    return { inputIndex: inputIndex, type: 'number' };
}
export function createStrAttr(str) {
    return { value: str, type: 'string' };
}
export function createBoolAttr(value) {
    return { value: value, type: 'bool' };
}
export function createNumericArrayAttr(value) {
    return { value: value, type: 'number[]' };
}
export function createNumericArrayAttrFromIndex(inputIndex) {
    return { inputIndex: inputIndex, type: 'number[]' };
}
export function createTensorAttr(index) {
    return { inputIndex: index, type: 'tensor' };
}
export function createTensorsAttr(index, paramLength) {
    return { inputIndex: index, inputParamLength: paramLength, type: 'tensors' };
}
export function createDtypeAttr(dtype) {
    return { value: dtype, type: 'dtype' };
}
//# sourceMappingURL=test_helper.js.map