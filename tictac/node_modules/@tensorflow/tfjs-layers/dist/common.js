"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_utils_1 = require("./utils/generic_utils");
var nameMap = new Map();
exports.VALID_DATA_FORMAT_VALUES = ['channelsFirst', 'channelsLast'];
function checkDataFormat(value) {
    generic_utils_1.checkStringTypeUnionValue(exports.VALID_DATA_FORMAT_VALUES, 'DataFormat', value);
}
exports.checkDataFormat = checkDataFormat;
exports.VALID_PADDING_MODE_VALUES = ['valid', 'same', 'causal'];
function checkPaddingMode(value) {
    generic_utils_1.checkStringTypeUnionValue(exports.VALID_PADDING_MODE_VALUES, 'PaddingMode', value);
}
exports.checkPaddingMode = checkPaddingMode;
exports.VALID_POOL_MODE_VALUES = ['max', 'avg'];
function checkPoolMode(value) {
    generic_utils_1.checkStringTypeUnionValue(exports.VALID_POOL_MODE_VALUES, 'PoolMode', value);
}
exports.checkPoolMode = checkPoolMode;
var _nameScopeStack = [];
var _nameScopeDivider = '/';
function nameScope(name, fn) {
    _nameScopeStack.push(name);
    try {
        var val = fn();
        _nameScopeStack.pop();
        return val;
    }
    catch (e) {
        _nameScopeStack.pop();
        throw e;
    }
}
exports.nameScope = nameScope;
function currentNameScopePrefix() {
    if (_nameScopeStack.length === 0) {
        return '';
    }
    else {
        return _nameScopeStack.join(_nameScopeDivider) + _nameScopeDivider;
    }
}
function getScopedTensorName(tensorName) {
    if (!isValidTensorName(tensorName)) {
        throw new Error('Not a valid tensor name: \'' + tensorName + '\'');
    }
    return currentNameScopePrefix() + tensorName;
}
exports.getScopedTensorName = getScopedTensorName;
function getUniqueTensorName(scopedName) {
    if (!isValidTensorName(scopedName)) {
        throw new Error('Not a valid tensor name: \'' + scopedName + '\'');
    }
    if (!nameMap.has(scopedName)) {
        nameMap.set(scopedName, 0);
    }
    var index = nameMap.get(scopedName);
    nameMap.set(scopedName, nameMap.get(scopedName) + 1);
    if (index > 0) {
        var result = scopedName + '_' + index;
        nameMap.set(result, 1);
        return result;
    }
    else {
        return scopedName;
    }
}
exports.getUniqueTensorName = getUniqueTensorName;
var tensorNameRegex = new RegExp(/^[A-Za-z][A-Za-z0-9\._\/]*$/);
function isValidTensorName(name) {
    return name.match(tensorNameRegex) ? true : false;
}
exports.isValidTensorName = isValidTensorName;
//# sourceMappingURL=common.js.map