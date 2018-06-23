"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_utils = require("../utils/generic_utils");
function isArrayItemInputOrOutputName(key, index, value) {
    return (key === 'inboundNodes' || key === 'outputLayers' ||
        key === 'inputLayers') &&
        index === 0 && typeof value === 'string';
}
function convertPythonicToTs(pythonicConfig, key) {
    if (pythonicConfig === null) {
        return null;
    }
    else if (typeof pythonicConfig === 'string') {
        return generic_utils.toCamelCase(pythonicConfig);
    }
    else if ((typeof pythonicConfig === 'number') ||
        (typeof pythonicConfig === 'boolean')) {
        return pythonicConfig;
    }
    else if (pythonicConfig instanceof Array) {
        var tsArray = [];
        var arrayLength = pythonicConfig.length;
        for (var i = 0; i < arrayLength; ++i) {
            var item = pythonicConfig[i];
            if (isArrayItemInputOrOutputName(key, i, item)) {
                tsArray.push(item);
            }
            else {
                tsArray.push(convertPythonicToTs(item, key));
            }
        }
        return tsArray;
    }
    else {
        var tsDict = {};
        for (var _i = 0, _a = Object.keys(pythonicConfig); _i < _a.length; _i++) {
            var pythonicKey = _a[_i];
            var pythonicValue = pythonicConfig[pythonicKey];
            if (pythonicKey === 'name' && typeof pythonicValue === 'string') {
                tsDict[pythonicKey] = pythonicValue;
            }
            else {
                var tsKey = generic_utils.toCamelCase(pythonicKey);
                tsDict[tsKey] = convertPythonicToTs(pythonicValue, tsKey);
            }
        }
        return tsDict;
    }
}
exports.convertPythonicToTs = convertPythonicToTs;
function convertTsToPythonic(tsConfig, key) {
    if (tsConfig === null || tsConfig === undefined) {
        return null;
    }
    else if (typeof tsConfig === 'string') {
        return generic_utils.toSnakeCase(tsConfig);
    }
    else if ((typeof tsConfig === 'number') || (typeof tsConfig === 'boolean')) {
        return tsConfig;
    }
    else if (tsConfig instanceof Array) {
        var pyArray = [];
        var arrayLength = tsConfig.length;
        for (var i = 0; i < arrayLength; ++i) {
            var item = tsConfig[i];
            if (isArrayItemInputOrOutputName(key, i, item)) {
                pyArray.push(item);
            }
            else {
                pyArray.push(convertTsToPythonic(item, key));
            }
        }
        return pyArray;
    }
    else {
        var pyDict = {};
        for (var _i = 0, _a = Object.keys(tsConfig); _i < _a.length; _i++) {
            var tsKey = _a[_i];
            var tsValue = tsConfig[tsKey];
            var pyKey = generic_utils.toSnakeCase(tsKey);
            if ((tsKey === 'name' || tsKey === 'className') &&
                typeof tsValue === 'string') {
                pyDict[pyKey] = tsValue;
            }
            else {
                pyDict[pyKey] = convertTsToPythonic(tsValue, tsKey);
            }
        }
        return pyDict;
    }
}
exports.convertTsToPythonic = convertTsToPythonic;
//# sourceMappingURL=serialization_utils.js.map