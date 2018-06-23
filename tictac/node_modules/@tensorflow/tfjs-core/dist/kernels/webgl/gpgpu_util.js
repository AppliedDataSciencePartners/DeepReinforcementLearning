"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var tex_util = require("./tex_util");
var webgl_util = require("./webgl_util");
function getWebGLContextAttributes() {
    return {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        depth: false,
        stencil: false,
        failIfMajorPerformanceCaveat: true
    };
}
exports.getWebGLContextAttributes = getWebGLContextAttributes;
function createWebGLContext(canvas) {
    var attributes = getWebGLContextAttributes();
    var gl;
    if (canvas != null) {
        gl = webgl_util.createWebGLRenderingContextFromCanvas(canvas, attributes);
    }
    else {
        gl = webgl_util.createWebGLRenderingContext(attributes);
    }
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.DEPTH_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.STENCIL_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.BLEND); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.DITHER); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.POLYGON_OFFSET_FILL); });
    webgl_util.callAndCheck(gl, function () { return gl.disable(gl.SAMPLE_COVERAGE); });
    webgl_util.callAndCheck(gl, function () { return gl.enable(gl.SCISSOR_TEST); });
    webgl_util.callAndCheck(gl, function () { return gl.enable(gl.CULL_FACE); });
    webgl_util.callAndCheck(gl, function () { return gl.cullFace(gl.BACK); });
    return gl;
}
exports.createWebGLContext = createWebGLContext;
function createVertexShader(gl) {
    var vertexShaderSource = "\n    precision highp float;\n    attribute vec3 clipSpacePos;\n    attribute vec2 uv;\n    varying vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }";
    return webgl_util.createVertexShader(gl, vertexShaderSource);
}
exports.createVertexShader = createVertexShader;
function createVertexBuffer(gl) {
    var vertexArray = new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]);
    return webgl_util.createStaticVertexBuffer(gl, vertexArray);
}
exports.createVertexBuffer = createVertexBuffer;
function createIndexBuffer(gl) {
    var triangleVertexIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
    return webgl_util.createStaticIndexBuffer(gl, triangleVertexIndices);
}
exports.createIndexBuffer = createIndexBuffer;
function getTextureConfig(gl, textureHalfFloatExtension) {
    var glany = gl;
    var internalFormatFloat;
    var internalFormatHalfFloat;
    var internalFormatPackedFloat;
    var textureFormatFloat;
    var downloadTextureFormat;
    var downloadUnpackNumChannels;
    var defaultNumChannels;
    var textureTypeHalfFloat;
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        internalFormatFloat = glany.R32F;
        internalFormatHalfFloat = glany.R16F;
        internalFormatPackedFloat = glany.RGBA32F;
        textureFormatFloat = glany.RED;
        downloadUnpackNumChannels = 4;
        defaultNumChannels = 1;
        textureTypeHalfFloat = glany.HALF_FLOAT;
    }
    else {
        internalFormatFloat = gl.RGBA;
        internalFormatHalfFloat = gl.RGBA;
        internalFormatPackedFloat = glany.RGBA;
        textureFormatFloat = gl.RGBA;
        downloadUnpackNumChannels = 4;
        defaultNumChannels = 4;
        textureTypeHalfFloat = textureHalfFloatExtension != null ?
            textureHalfFloatExtension.HALF_FLOAT_OES :
            null;
    }
    downloadTextureFormat = gl.RGBA;
    return {
        internalFormatFloat: internalFormatFloat,
        internalFormatHalfFloat: internalFormatHalfFloat,
        internalFormatPackedFloat: internalFormatPackedFloat,
        textureFormatFloat: textureFormatFloat,
        downloadTextureFormat: downloadTextureFormat,
        downloadUnpackNumChannels: downloadUnpackNumChannels,
        defaultNumChannels: defaultNumChannels,
        textureTypeHalfFloat: textureTypeHalfFloat
    };
}
exports.getTextureConfig = getTextureConfig;
function createAndConfigureTexture(gl, width, height, internalFormat, textureFormat, textureType) {
    webgl_util.validateTextureSize(gl, width, height);
    var texture = webgl_util.createTexture(gl);
    var tex2d = gl.TEXTURE_2D;
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(tex2d, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MIN_FILTER, gl.NEAREST); });
    webgl_util.callAndCheck(gl, function () { return gl.texParameteri(tex2d, gl.TEXTURE_MAG_FILTER, gl.NEAREST); });
    webgl_util.callAndCheck(gl, function () { return gl.texImage2D(tex2d, 0, internalFormat, width, height, 0, textureFormat, textureType, null); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
    return texture;
}
function createFloat32MatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatFloat, textureConfig.textureFormatFloat, gl.FLOAT);
}
exports.createFloat32MatrixTexture = createFloat32MatrixTexture;
function createFloat16MatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatFloat, textureConfig.textureFormatFloat, textureConfig.textureTypeHalfFloat);
}
exports.createFloat16MatrixTexture = createFloat16MatrixTexture;
function createUnsignedBytesMatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
}
exports.createUnsignedBytesMatrixTexture = createUnsignedBytesMatrixTexture;
function createPackedMatrixTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), width = _a[0], height = _a[1];
    return createAndConfigureTexture(gl, width, height, textureConfig.internalFormatPackedFloat, gl.RGBA, gl.FLOAT);
}
exports.createPackedMatrixTexture = createPackedMatrixTexture;
function bindVertexProgramAttributeStreams(gl, program, vertexBuffer) {
    var posOffset = 0;
    var uvOffset = 3 * 4;
    var stride = (3 * 4) + (2 * 4);
    webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); });
    var success = webgl_util.bindVertexBufferToProgramAttribute(gl, program, 'clipSpacePos', vertexBuffer, 3, stride, posOffset);
    return success &&
        webgl_util.bindVertexBufferToProgramAttribute(gl, program, 'uv', vertexBuffer, 2, stride, uvOffset);
}
exports.bindVertexProgramAttributeStreams = bindVertexProgramAttributeStreams;
function uploadPixelDataToTexture(gl, texture, pixels) {
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
exports.uploadPixelDataToTexture = uploadPixelDataToTexture;
function uploadDataToTexture(gl, texture, width, height, data, textureFormat) {
    webgl_util.validateTextureSize(gl, width, height);
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, texture); });
    webgl_util.callAndCheck(gl, function () { return gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, textureFormat, gl.FLOAT, data); });
    webgl_util.callAndCheck(gl, function () { return gl.bindTexture(gl.TEXTURE_2D, null); });
}
function uploadMatrixToTexture(gl, texture, rows, columns, matrix, numChannels, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var unpackedArray;
    if (textureConfig.defaultNumChannels === 1) {
        unpackedArray = matrix;
    }
    else {
        unpackedArray =
            new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(matrix.length, numChannels));
        tex_util.encodeMatrixToUnpackedArray(matrix, unpackedArray, numChannels);
    }
    uploadDataToTexture(gl, texture, w, h, unpackedArray, textureConfig.textureFormatFloat);
}
exports.uploadMatrixToTexture = uploadMatrixToTexture;
function uploadMatrixToPackedTexture(gl, texture, rows, columns, matrix, textureConfig) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var packedRGBA = new Float32Array(tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
    tex_util.encodeMatrixToPackedRGBA(matrix, rows, columns, packedRGBA);
    uploadDataToTexture(gl, texture, w, h, packedRGBA, gl.RGBA);
}
exports.uploadMatrixToPackedTexture = uploadMatrixToPackedTexture;
function downloadMatrixFromOutputTextureAsync(gl, getBufferSubDataAsyncExtension, rows, columns, textureConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var gl2, downloadTarget, bufferSizeBytes, buffer, matrix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gl2 = gl;
                    downloadTarget = new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels));
                    bufferSizeBytes = downloadTarget instanceof Float32Array ?
                        downloadTarget.length * 4 :
                        downloadTarget;
                    buffer = gl.createBuffer();
                    webgl_util.callAndCheck(gl, function () { return gl.bindBuffer(gl2.PIXEL_PACK_BUFFER, buffer); });
                    webgl_util.callAndCheck(gl, function () { return gl.bufferData(gl2.PIXEL_PACK_BUFFER, bufferSizeBytes, gl.STATIC_DRAW); });
                    webgl_util.callAndCheck(gl, function () { return gl2.readPixels(0, 0, columns, rows, gl.RGBA, gl.FLOAT, 0); });
                    return [4, getBufferSubDataAsyncExtension.getBufferSubDataAsync(gl2.PIXEL_PACK_BUFFER, 0, downloadTarget)];
                case 1:
                    _a.sent();
                    matrix = new Float32Array(rows * columns);
                    tex_util.decodeMatrixFromUnpackedArray(downloadTarget, matrix, textureConfig.downloadUnpackNumChannels);
                    return [2, matrix];
            }
        });
    });
}
exports.downloadMatrixFromOutputTextureAsync = downloadMatrixFromOutputTextureAsync;
function downloadFloat32MatrixFromOutputTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var downloadTarget = new Float32Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, textureConfig.downloadUnpackNumChannels));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, textureConfig.downloadTextureFormat, gl.FLOAT, downloadTarget); });
    var matrix = new Float32Array(rows * columns);
    tex_util.decodeMatrixFromUnpackedArray(downloadTarget, matrix, textureConfig.downloadUnpackNumChannels);
    return matrix;
}
exports.downloadFloat32MatrixFromOutputTexture = downloadFloat32MatrixFromOutputTexture;
function downloadByteEncodedFloatMatrixFromOutputTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getUnpackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var numChannels = 4;
    var downloadTarget = new Uint8Array(tex_util.getUnpackedArraySizeFromMatrixSize(rows * columns, numChannels));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, textureConfig.downloadTextureFormat, gl.UNSIGNED_BYTE, downloadTarget); });
    return new Float32Array(downloadTarget.buffer);
}
exports.downloadByteEncodedFloatMatrixFromOutputTexture = downloadByteEncodedFloatMatrixFromOutputTexture;
function downloadMatrixFromPackedOutputTexture(gl, rows, columns, textureConfig) {
    var _a = tex_util.getPackedMatrixTextureShapeWidthHeight(rows, columns), w = _a[0], h = _a[1];
    var packedRGBA = new Float32Array(tex_util.getPackedRGBAArraySizeFromMatrixShape(rows, columns));
    webgl_util.callAndCheck(gl, function () { return gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, packedRGBA); });
    var matrix = new Float32Array(rows * columns);
    return tex_util.decodeMatrixFromPackedRGBA(packedRGBA, rows, columns, matrix);
}
exports.downloadMatrixFromPackedOutputTexture = downloadMatrixFromPackedOutputTexture;
//# sourceMappingURL=gpgpu_util.js.map