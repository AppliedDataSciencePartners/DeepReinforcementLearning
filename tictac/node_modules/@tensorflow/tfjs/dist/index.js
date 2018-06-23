"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("@tensorflow/tfjs-core"));
__export(require("@tensorflow/tfjs-layers"));
__export(require("@tensorflow/tfjs-converter"));
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var tfjs_layers_1 = require("@tensorflow/tfjs-layers");
var tfjs_converter_1 = require("@tensorflow/tfjs-converter");
var version_1 = require("./version");
exports.version = {
    'tfjs-core': tfjs_core_1.version_core,
    'tfjs-layers': tfjs_layers_1.version_layers,
    'tfjs-converter': tfjs_converter_1.version_converter,
    'tfjs': version_1.version
};
//# sourceMappingURL=index.js.map