"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gpgpu_util = require("./kernels/webgl/gpgpu_util");
exports.gpgpu_util = gpgpu_util;
var webgl_util = require("./kernels/webgl/webgl_util");
exports.webgl_util = webgl_util;
var backend_webgl_1 = require("./kernels/backend_webgl");
exports.MathBackendWebGL = backend_webgl_1.MathBackendWebGL;
var gpgpu_context_1 = require("./kernels/webgl/gpgpu_context");
exports.GPGPUContext = gpgpu_context_1.GPGPUContext;
//# sourceMappingURL=webgl.js.map