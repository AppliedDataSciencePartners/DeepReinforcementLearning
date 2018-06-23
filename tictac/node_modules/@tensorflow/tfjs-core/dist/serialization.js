"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.getClassName = function () {
        return this.constructor
            .className;
    };
    Serializable.fromConfig = function (cls, config) {
        return new cls(config);
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var SerializationMap = (function () {
    function SerializationMap() {
        this.classNameMap = {};
    }
    SerializationMap.getMap = function () {
        if (SerializationMap.instance == null) {
            SerializationMap.instance = new SerializationMap();
        }
        return SerializationMap.instance;
    };
    SerializationMap.register = function (cls) {
        this.getMap().classNameMap[cls.className] = [cls, cls.fromConfig];
    };
    return SerializationMap;
}());
exports.SerializationMap = SerializationMap;
//# sourceMappingURL=serialization.js.map