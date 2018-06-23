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
var environment_1 = require("../environment");
var axis_util = require("../ops/axis_util");
var ops = require("../ops/ops");
var reduce_util = require("../ops/reduce_util");
var segment_util = require("../ops/segment_util");
var slice_util_1 = require("../ops/slice_util");
var tensor_1 = require("../tensor");
var types = require("../types");
var util = require("../util");
var backend_util = require("./backend_util");
var argminmax_gpu_1 = require("./webgl/argminmax_gpu");
var avg_pool_backprop_gpu_1 = require("./webgl/avg_pool_backprop_gpu");
var batchnorm_gpu_1 = require("./webgl/batchnorm_gpu");
var binaryop_gpu = require("./webgl/binaryop_gpu");
var binaryop_gpu_1 = require("./webgl/binaryop_gpu");
var clip_gpu_1 = require("./webgl/clip_gpu");
var concat_gpu_1 = require("./webgl/concat_gpu");
var conv_backprop_gpu_1 = require("./webgl/conv_backprop_gpu");
var conv_backprop_gpu_depthwise_1 = require("./webgl/conv_backprop_gpu_depthwise");
var conv_gpu_1 = require("./webgl/conv_gpu");
var conv_gpu_depthwise_1 = require("./webgl/conv_gpu_depthwise");
var cumsum_gpu_1 = require("./webgl/cumsum_gpu");
var encode_float_gpu_1 = require("./webgl/encode_float_gpu");
var from_pixels_gpu_1 = require("./webgl/from_pixels_gpu");
var gather_gpu_1 = require("./webgl/gather_gpu");
var gpgpu_context_1 = require("./webgl/gpgpu_context");
var gpgpu_math = require("./webgl/gpgpu_math");
var gpgpu_util = require("./webgl/gpgpu_util");
var logical_gpu_1 = require("./webgl/logical_gpu");
var lrn_gpu_1 = require("./webgl/lrn_gpu");
var max_pool_backprop_gpu_1 = require("./webgl/max_pool_backprop_gpu");
var mulmat_gpu_1 = require("./webgl/mulmat_gpu");
var multinomial_gpu_1 = require("./webgl/multinomial_gpu");
var onehot_gpu_1 = require("./webgl/onehot_gpu");
var pad_gpu_1 = require("./webgl/pad_gpu");
var pool_gpu_1 = require("./webgl/pool_gpu");
var reduce_gpu_1 = require("./webgl/reduce_gpu");
var resize_bilinear_backprop_gpu_1 = require("./webgl/resize_bilinear_backprop_gpu");
var resize_bilinear_gpu_1 = require("./webgl/resize_bilinear_gpu");
var resize_nearest_neighbor_gpu_1 = require("./webgl/resize_nearest_neighbor_gpu");
var reverse_gpu_1 = require("./webgl/reverse_gpu");
var segment_gpu_1 = require("./webgl/segment_gpu");
var slice_gpu_1 = require("./webgl/slice_gpu");
var strided_slice_gpu_1 = require("./webgl/strided_slice_gpu");
var tex_util_1 = require("./webgl/tex_util");
var texture_manager_1 = require("./webgl/texture_manager");
var tile_gpu_1 = require("./webgl/tile_gpu");
var transpose_gpu_1 = require("./webgl/transpose_gpu");
var unary_op = require("./webgl/unaryop_gpu");
var unaryop_gpu_1 = require("./webgl/unaryop_gpu");
var webgl_util = require("./webgl/webgl_util");
var BEFORE_PAGING_CONSTANT = 300;
exports.SIZE_UPLOAD_UNIFORM = 32;
var MathBackendWebGL = (function () {
    function MathBackendWebGL(gpgpu, delayedStorage) {
        if (delayedStorage === void 0) { delayedStorage = true; }
        this.gpgpu = gpgpu;
        this.delayedStorage = delayedStorage;
        this.texData = new WeakMap();
        this.pendingRead = new WeakMap();
        this.pendingDisposal = new WeakSet();
        this.lruDataGPU = [];
        this.numBytesInGPU = 0;
        this.uploadWaitMs = 0;
        this.downloadWaitMs = 0;
        this.binaryCache = {};
        this.disposed = false;
        if (environment_1.ENV.get('WEBGL_VERSION') < 1) {
            throw new Error('WebGL is not supported on this device');
        }
        if (environment_1.ENV.get('IS_BROWSER')) {
            this.canvas = document.createElement('canvas');
        }
        if (gpgpu == null) {
            this.gpgpu = new gpgpu_context_1.GPGPUContext(gpgpu_util.createWebGLContext(this.canvas));
            this.gpgpuCreatedLocally = true;
        }
        else {
            this.gpgpuCreatedLocally = false;
        }
        this.NUM_BYTES_BEFORE_PAGING =
            (window.screen.height * window.screen.width * window.devicePixelRatio) *
                BEFORE_PAGING_CONSTANT;
        this.textureManager = new texture_manager_1.TextureManager(this.gpgpu);
    }
    MathBackendWebGL.prototype.register = function (dataId, shape, dtype) {
        if (this.texData.has(dataId)) {
            throw new Error('Data buffer is already registered');
        }
        this.texData.set(dataId, {
            shape: shape,
            dtype: dtype,
            values: null,
            texture: null,
            texShape: null,
            usage: tex_util_1.TextureUsage.RENDER
        });
    };
    MathBackendWebGL.prototype.fromPixels = function (pixels, numChannels) {
        if (pixels == null) {
            throw new Error('MathBackendWebGL.writePixels(): pixels can not be null');
        }
        var texShape = [pixels.height, pixels.width];
        var outShape = [pixels.height, pixels.width, numChannels];
        if (pixels instanceof HTMLVideoElement) {
            if (this.fromPixelsCanvas == null) {
                if (!environment_1.ENV.get('IS_BROWSER')) {
                    throw new Error('Can\'t read pixels from HTMLImageElement outside the browser.');
                }
                if (document.readyState !== 'complete') {
                    throw new Error('The DOM is not ready yet. Please call tf.fromPixels() ' +
                        'once the DOM is ready. One way to do that is to add an event ' +
                        'listener for `DOMContentLoaded` on the document object');
                }
                this.fromPixelsCanvas = document.createElement('canvas');
            }
            this.fromPixelsCanvas.width = pixels.width;
            this.fromPixelsCanvas.height = pixels.height;
            this.fromPixelsCanvas.getContext('2d').drawImage(pixels, 0, 0, pixels.width, pixels.height);
            pixels = this.fromPixelsCanvas;
        }
        var tempPixelArray = tensor_1.Tensor.make(texShape, {}, 'int32');
        this.texData.get(tempPixelArray.dataId).usage = tex_util_1.TextureUsage.PIXELS;
        this.gpgpu.uploadPixelDataToTexture(this.getTexture(tempPixelArray.dataId), pixels);
        var program = new from_pixels_gpu_1.FromPixelsProgram(outShape);
        var res = this.compileAndRun(program, [tempPixelArray]);
        tempPixelArray.dispose();
        return res;
    };
    MathBackendWebGL.prototype.write = function (dataId, values) {
        if (values == null) {
            throw new Error('MathBackendWebGL.write(): values can not be null');
        }
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var texture = texData.texture, texShape = texData.texShape, usage = texData.usage;
        if (texture != null) {
            this.releaseTexture(dataId, texture, texShape, usage);
            texData.texture = null;
            texData.texShape = null;
        }
        texData.usage = tex_util_1.TextureUsage.UPLOAD;
        texData.values = values;
        if (!this.delayedStorage) {
            this.uploadToGPU(dataId);
        }
    };
    MathBackendWebGL.prototype.readSync = function (dataId) {
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var shape = texData.shape, texture = texData.texture, values = texData.values, texShape = texData.texShape, dtype = texData.dtype;
        if (values != null) {
            this.cacheOnCPU(dataId);
            return values;
        }
        var shouldTimeProgram = this.activeTimers != null;
        var start;
        if (shouldTimeProgram) {
            start = performance.now();
        }
        var float32Values;
        if (environment_1.ENV.get('WEBGL_DOWNLOAD_FLOAT_ENABLED')) {
            float32Values = this.gpgpu.downloadFloat32MatrixFromOutputTexture(texture, texShape[0], texShape[1]);
        }
        else {
            var tmpTarget = tensor_1.Tensor.make(shape, {});
            this.texData.get(tmpTarget.dataId).usage = tex_util_1.TextureUsage.DOWNLOAD;
            var tmpInput = tensor_1.Tensor.make(shape, { dataId: dataId }, dtype);
            var program = new encode_float_gpu_1.EncodeFloatProgram(shape);
            var res = this.compileAndRun(program, [tmpInput], tmpTarget);
            var tmpData = this.texData.get(tmpTarget.dataId);
            float32Values =
                this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(tmpData.texture, tmpData.texShape[0], tmpData.texShape[1]);
            res.dispose();
            tmpInput.dispose();
            tmpTarget.dispose();
        }
        if (shouldTimeProgram) {
            this.downloadWaitMs += performance.now() - start;
        }
        this.cacheOnCPU(dataId, float32Values);
        return texData.values;
    };
    MathBackendWebGL.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var subscribers_1, texData, texture, values, texShape, float32Values, subscribers, vals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pendingRead.has(dataId)) {
                            subscribers_1 = this.pendingRead.get(dataId);
                            return [2, new Promise(function (resolve) { return subscribers_1.push(resolve); })];
                        }
                        this.throwIfNoData(dataId);
                        texData = this.texData.get(dataId);
                        texture = texData.texture, values = texData.values, texShape = texData.texShape;
                        if (values != null) {
                            this.cacheOnCPU(dataId);
                            return [2, values];
                        }
                        if (!environment_1.ENV.get('WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED')) return [3, 2];
                        return [4, this.gpgpu.downloadMatrixFromTextureAsync(texture, texShape[0], texShape[1])];
                    case 1:
                        float32Values = _a.sent();
                        this.cacheOnCPU(dataId, float32Values);
                        return [2, texData.values];
                    case 2:
                        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') === 0) {
                            return [2, this.readSync(dataId)];
                        }
                        this.pendingRead.set(dataId, []);
                        return [4, this.gpgpu.runQuery(function () { })];
                    case 3:
                        _a.sent();
                        subscribers = this.pendingRead.get(dataId);
                        this.pendingRead.delete(dataId);
                        vals = this.readSync(dataId);
                        subscribers.forEach(function (resolve) { return resolve(vals); });
                        if (this.pendingDisposal.has(dataId)) {
                            this.pendingDisposal.delete(dataId);
                            this.disposeData(dataId);
                        }
                        return [2, vals];
                }
            });
        });
    };
    MathBackendWebGL.prototype.time = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var oldActiveTimers, newActiveTimers, outerMostTime, flattenedActiveTimers, kernelMs, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldActiveTimers = this.activeTimers;
                        newActiveTimers = [];
                        outerMostTime = false;
                        if (this.programTimersStack == null) {
                            this.programTimersStack = newActiveTimers;
                            outerMostTime = true;
                        }
                        else {
                            this.activeTimers.push(newActiveTimers);
                        }
                        this.activeTimers = newActiveTimers;
                        f();
                        flattenedActiveTimers = util.flatten(this.activeTimers);
                        this.activeTimers = oldActiveTimers;
                        if (outerMostTime) {
                            this.programTimersStack = null;
                        }
                        return [4, Promise.all(flattenedActiveTimers).then(function (results) {
                                var sum = 0;
                                results.forEach(function (result) { return sum += result; });
                                return sum;
                            })];
                    case 1:
                        kernelMs = _a.sent();
                        res = {
                            uploadWaitMs: this.uploadWaitMs,
                            downloadWaitMs: this.downloadWaitMs,
                            kernelMs: kernelMs,
                            wallMs: null
                        };
                        this.uploadWaitMs = 0;
                        this.downloadWaitMs = 0;
                        return [2, res];
                }
            });
        });
    };
    MathBackendWebGL.prototype.memory = function () {
        return { unreliable: false, numBytesInGPU: this.numBytesInGPU };
    };
    MathBackendWebGL.prototype.startTimer = function () {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
            return this.gpgpu.beginQuery();
        }
        return { startMs: performance.now(), endMs: null };
    };
    MathBackendWebGL.prototype.endTimer = function (query) {
        if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
            this.gpgpu.endQuery();
            return query;
        }
        query.endMs = performance.now();
        return query;
    };
    MathBackendWebGL.prototype.getQueryTime = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var timerQuery;
            return __generator(this, function (_a) {
                if (environment_1.ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION') > 0) {
                    return [2, this.gpgpu.pollQueryTime(query)];
                }
                timerQuery = query;
                return [2, timerQuery.endMs - timerQuery.startMs];
            });
        });
    };
    MathBackendWebGL.prototype.disposeData = function (dataId) {
        if (this.pendingDisposal.has(dataId)) {
            return;
        }
        if (this.pendingRead.has(dataId)) {
            this.pendingDisposal.add(dataId);
            return;
        }
        if (this.texData.has(dataId)) {
            var _a = this.texData.get(dataId), texture = _a.texture, texShape = _a.texShape, usage = _a.usage;
            if (texture != null) {
                this.releaseTexture(dataId, texture, texShape, usage);
            }
            this.texData.delete(dataId);
        }
    };
    MathBackendWebGL.prototype.getTexture = function (dataId) {
        this.uploadToGPU(dataId);
        return this.texData.get(dataId).texture;
    };
    MathBackendWebGL.prototype.getGPGPUContext = function () {
        return this.gpgpu;
    };
    MathBackendWebGL.prototype.getCanvas = function () {
        return this.canvas;
    };
    MathBackendWebGL.prototype.slice = function (x, begin, size) {
        var program = new slice_gpu_1.SliceProgram(size);
        var customSetup = program.getCustomSetupFunc(begin);
        return this.compileAndRun(program, [x], null, customSetup);
    };
    MathBackendWebGL.prototype.stridedSlice = function (x, begin, end, strides, beginMask, endMask) {
        var _a = slice_util_1.getStridedSlicedInfo(x.shape, begin, end, strides, beginMask, endMask), beginIndex = _a[0], size = _a[1];
        if (size.some(function (axis) { return axis === 0; })) {
            return ops.tensor([], size);
        }
        var program = new strided_slice_gpu_1.StridedSliceProgram(beginIndex, strides, size);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.reverse = function (x, axis) {
        var program = new reverse_gpu_1.ReverseProgram(x.shape, axis);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.concat = function (a, b) {
        var program = new concat_gpu_1.ConcatProgram(a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.neg = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.NEG);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.matMul = function (a, b, transposeA, transposeB) {
        var program = new mulmat_gpu_1.MatMulProgram(a.shape, b.shape, transposeA, transposeB);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.multiply = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MUL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var inputs = [x, mean, variance];
        var offsetShape = null;
        if (offset != null) {
            offsetShape = offset.shape;
            inputs.push(offset);
        }
        var scaleShape = null;
        if (scale != null) {
            scaleShape = scale.shape;
            inputs.push(scale);
        }
        var program = new batchnorm_gpu_1.BatchNormProgram(x.shape, mean.shape, variance.shape, offsetShape, scaleShape, varianceEpsilon);
        return this.compileAndRun(program, inputs);
    };
    MathBackendWebGL.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta) {
        var program = new lrn_gpu_1.LRNProgram(x.shape, radius, bias, alpha, beta);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tile = function (x, reps) {
        var program = new tile_gpu_1.TileProgram(x.shape, reps);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.pad = function (x, paddings, constantValue) {
        var program = new pad_gpu_1.PadProgram(x.shape, paddings, constantValue);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.transpose = function (x, perm) {
        var program = new transpose_gpu_1.TransposeProgram(x.shape, perm);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.gather = function (x, indices, axis) {
        var program = new gather_gpu_1.GatherProgram(x.shape, indices.size, axis);
        return this.compileAndRun(program, [x, indices]);
    };
    MathBackendWebGL.prototype.reduce = function (x, reduceType, dtype) {
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        var windowSize = reduce_util.computeOptimalWindowSize(inSize);
        var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
        var program = new reduce_gpu_1.ReduceProgram(reduceInfo, reduceType);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], dtype);
        this.compileAndRun(program, [x], output);
        if (output.shape[1] === 1) {
            return output;
        }
        return this.reduce(output, reduceType, dtype);
    };
    MathBackendWebGL.prototype.argReduce = function (x, reduceType, bestIndicesA) {
        if (bestIndicesA === void 0) { bestIndicesA = null; }
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        if (bestIndicesA != null) {
            batchSize = bestIndicesA.shape[0];
            inSize = bestIndicesA.shape[1];
        }
        var windowSize = reduce_util.computeOptimalWindowSize(inSize);
        var reduceInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize };
        var program = new argminmax_gpu_1.ArgMinMaxProgram(reduceInfo, reduceType, bestIndicesA == null);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], 'int32');
        var inputs = [x];
        if (bestIndicesA != null) {
            inputs.push(bestIndicesA);
        }
        this.compileAndRun(program, inputs, output);
        if (output.shape[1] === 1) {
            return output;
        }
        return this.argReduce(x, reduceType, output);
    };
    MathBackendWebGL.prototype.sum = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        var outputDType = types.sumOutType(x.dtype);
        return this.reduce(a2D, 'sum', outputDType).reshape(outShape);
    };
    MathBackendWebGL.prototype.unsortedSegmentSum = function (x, segmentIds, numSegments) {
        var axis = 0;
        var permutation = axis_util.getAxesPermutation([axis], x.rank);
        var permutedX = x;
        if (permutation != null) {
            permutedX = x.transpose(permutation);
            axis = axis_util.getInnerMostAxes(1, x.rank)[0];
        }
        var outShape = segment_util.computeOutShape(permutedX.shape, axis, numSegments);
        var inSize = util.sizeFromShape([permutedX.shape[axis]]);
        var a2D = permutedX.as2D(-1, inSize);
        var outputDType = types.sumOutType(x.dtype);
        var result = this.segOpCompute(a2D, 'unsortedSegmentSum', segmentIds, outputDType, numSegments)
            .reshape(outShape);
        if (permutation != null) {
            result = result.transpose(axis_util.getUndoAxesPermutation(permutation));
        }
        return result;
    };
    MathBackendWebGL.prototype.segOpCompute = function (x, segOpType, segmentIds, dtype, numSegments) {
        var batchSize = x.shape[0];
        var inSize = x.shape[1];
        var windowSize = segment_util.segOpComputeOptimalWindowSize(inSize, numSegments);
        var segOpInfo = { windowSize: windowSize, inSize: inSize, batchSize: batchSize, numSegments: numSegments };
        var program = new segment_gpu_1.SegmentOpProgram(segOpInfo, segOpType);
        var _a = program.outputShape, rows = _a[0], cols = _a[1];
        var output = this.makeOutputArray([rows, cols], dtype);
        this.compileAndRun(program, [x, segmentIds], output);
        if (output.shape[1] === numSegments) {
            return output;
        }
        segmentIds = ops.range(0, numSegments).tile([inSize / windowSize]);
        return this.segOpCompute(output, segOpType, segmentIds, dtype, numSegments);
    };
    MathBackendWebGL.prototype.argMin = function (x, axis) {
        var axes = [axis];
        axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.argReduce(a2D, 'min').reshape(outShape);
    };
    MathBackendWebGL.prototype.argMax = function (x, axis) {
        var axes = [axis];
        axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.argReduce(a2D, 'max').reshape(outShape);
    };
    MathBackendWebGL.prototype.cumsum = function (x, axis, exclusive, reverse) {
        if (axis !== x.rank - 1) {
            throw new Error("WebGL cumsum shader expects an inner-most axis=" + (x.rank - 1) + " " +
                ("but got axis=" + axis));
        }
        var program = new cumsum_gpu_1.CumSumProgram(x.shape, exclusive, reverse);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.equal = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.notEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.NOT_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.less = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LESS, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.lessEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LESS_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.greater = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.GREATER, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.greaterEqual = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.GREATER_EQUAL, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalNot = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOGICAL_NOT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.logicalAnd = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_AND, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.logicalOr = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.LOGICAL_OR, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, 'bool');
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.where = function (condition, a, b, dtype) {
        var program = new logical_gpu_1.WhereProgram(condition.rank, a.shape, a.rank);
        var output = this.makeOutputArray(program.outputShape, dtype);
        return this.compileAndRun(program, [condition, a, b], output);
    };
    MathBackendWebGL.prototype.topKValues = function (x, k) {
        throw new Error('topKValues GPU not yet implemented!');
    };
    MathBackendWebGL.prototype.topKIndices = function (x, k) {
        throw new Error('topKIndices GPU not yet implemented!');
    };
    MathBackendWebGL.prototype.min = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'min', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.minimum = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MIN, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.mod = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MOD, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.max = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'max', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.maximum = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.MAX, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.all = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('all', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var inSize = util.sizeFromShape(reduceShape);
        var a2D = x.as2D(-1, inSize);
        return this.reduce(a2D, 'all', a2D.dtype).reshape(outShape);
    };
    MathBackendWebGL.prototype.squaredDifference = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.SQUARED_DIFFERENCE, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.realDivide = function (a, b) {
        var op = binaryop_gpu.DIV;
        var outputDtype = 'float32';
        var program = new binaryop_gpu_1.BinaryOpProgram(op, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, outputDtype);
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.floorDiv = function (a, b) {
        var op = binaryop_gpu.INT_DIV;
        var outputDtype = 'int32';
        var program = new binaryop_gpu_1.BinaryOpProgram(op, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, outputDtype);
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.add = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ADD, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.subtract = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.SUB, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.pow = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.POW, a.shape, b.shape);
        var output = this.makeOutputArray(program.outputShape, types.upcastType(a.dtype, b.dtype));
        return this.compileAndRun(program, [a, b], output);
    };
    MathBackendWebGL.prototype.ceil = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.CEIL);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.floor = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.FLOOR);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sign = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIGN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.round = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ROUND);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.exp = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.EXP);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.expm1 = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.EXPM1);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.log = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOG);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.log1p = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.LOG1P);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sqrt = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SQRT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.rsqrt = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RSQRT);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.square = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SQUARE);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.reciprocal = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RECIPROCAL);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.relu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.RELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.elu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.eluDer = function (dy, y) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ELU_DER, dy.shape, y.shape);
        return this.compileAndRun(program, [dy, y]);
    };
    MathBackendWebGL.prototype.selu = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SELU);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.int = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TO_INT);
        var output = this.makeOutputArray(program.outputShape, 'int32');
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.clip = function (x, min, max) {
        var program = new clip_gpu_1.ClipProgram(x.shape, min, max);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.abs = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ABS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sigmoid = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIGMOID);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.softplus = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SOFTPLUS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.sin = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SIN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.cos = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.COS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tan = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TAN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.asin = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ASIN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.acos = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ACOS);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.atan = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ATAN);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.atan2 = function (a, b) {
        var program = new binaryop_gpu_1.BinaryOpProgram(binaryop_gpu.ATAN2, a.shape, b.shape);
        return this.compileAndRun(program, [a, b]);
    };
    MathBackendWebGL.prototype.sinh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.SINH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.cosh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.COSH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.tanh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.TANH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.asinh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ASINH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.acosh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ACOSH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.atanh = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ATANH);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.erf = function (x) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.ERF);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.step = function (x, alpha) {
        var program = new unaryop_gpu_1.UnaryOpProgram(x.shape, unary_op.STEP(alpha));
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.conv2d = function (x, filter, convInfo) {
        var program = new conv_gpu_1.Conv2DProgram(convInfo);
        return this.compileAndRun(program, [x, filter]);
    };
    MathBackendWebGL.prototype.conv2dDerInput = function (dy, filter, convInfo) {
        var program = new conv_backprop_gpu_1.Conv2DDerInputProgram(convInfo);
        return this.compileAndRun(program, [dy, filter]);
    };
    MathBackendWebGL.prototype.conv2dDerFilter = function (x, dy, convInfo) {
        var program = new conv_backprop_gpu_1.Conv2DDerFilterProgram(convInfo);
        return this.compileAndRun(program, [x, dy]);
    };
    MathBackendWebGL.prototype.depthwiseConv2D = function (x, filter, convInfo) {
        var program = new conv_gpu_depthwise_1.DepthwiseConv2DProgram(convInfo);
        return this.compileAndRun(program, [x, filter]);
    };
    MathBackendWebGL.prototype.depthwiseConv2DDerInput = function (dy, filter, convInfo) {
        var program = new conv_backprop_gpu_depthwise_1.DepthwiseConv2DDerInputProgram(convInfo);
        return this.compileAndRun(program, [dy, filter]);
    };
    MathBackendWebGL.prototype.depthwiseConv2DDerFilter = function (x, dy, convInfo) {
        var program = new conv_backprop_gpu_depthwise_1.DepthwiseConv2DDerFilterProgram(convInfo);
        return this.compileAndRun(program, [x, dy]);
    };
    MathBackendWebGL.prototype.maxPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'max', false);
        var output = this.makeOutputArray(program.outputShape, x.dtype);
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.avgPool = function (x, convInfo) {
        var program = new pool_gpu_1.Pool2DProgram(convInfo, 'avg', false);
        var output = this.makeOutputArray(program.outputShape, 'float32');
        return this.compileAndRun(program, [x], output);
    };
    MathBackendWebGL.prototype.maxPoolBackprop = function (dy, x, y, convInfo) {
        var getPositions = true;
        var maxPoolPositionsProgram = new pool_gpu_1.Pool2DProgram(convInfo, 'max', getPositions);
        var maxPoolPositions = this.compileAndRun(maxPoolPositionsProgram, [x]);
        var maxPoolBackPropProgram = new max_pool_backprop_gpu_1.MaxPool2DBackpropProgram(convInfo);
        var output = this.makeOutputArray(maxPoolBackPropProgram.outputShape, x.dtype);
        var result = this.compileAndRun(maxPoolBackPropProgram, [dy, maxPoolPositions], output);
        maxPoolPositions.dispose();
        return result;
    };
    MathBackendWebGL.prototype.avgPoolBackprop = function (dy, x, convInfo) {
        var avgPoolBackpropProgram = new avg_pool_backprop_gpu_1.AvgPool2DBackpropProgram(convInfo);
        var output = this.makeOutputArray(avgPoolBackpropProgram.outputShape, x.dtype);
        return this.compileAndRun(avgPoolBackpropProgram, [dy], output);
    };
    MathBackendWebGL.prototype.cast = function (x, dtype) {
        return backend_util.castTensor(x, dtype, this);
    };
    MathBackendWebGL.prototype.reshape = function (x, shape) {
        return backend_util.reshapeTensor(x, shape);
    };
    MathBackendWebGL.prototype.resizeBilinear = function (x, newHeight, newWidth, alignCorners) {
        var program = new resize_bilinear_gpu_1.ResizeBilinearProgram(x.shape, newHeight, newWidth, alignCorners);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.resizeBilinearBackprop = function (dy, x, alignCorners) {
        var program = new resize_bilinear_backprop_gpu_1.ResizeBilinearBackpropProgram(dy, x, alignCorners);
        return this.compileAndRun(program, [dy]);
    };
    MathBackendWebGL.prototype.resizeNearestNeighbor = function (x, newHeight, newWidth, alignCorners) {
        var program = new resize_nearest_neighbor_gpu_1.ResizeNearestNeighborProgram(x.shape, newHeight, newWidth, alignCorners);
        return this.compileAndRun(program, [x]);
    };
    MathBackendWebGL.prototype.multinomial = function (logits, normalized, numSamples, seed) {
        var probs = normalized ? logits : ops.softmax(logits);
        var batchSize = probs.shape[0];
        var numOutcomes = probs.shape[1];
        var program = new multinomial_gpu_1.MultinomialProgram(batchSize, numOutcomes, numSamples);
        var output = this.makeOutputArray(program.outputShape, 'int32');
        var customSetup = program.getCustomSetupFunc(seed);
        return this.compileAndRun(program, [probs], output, customSetup);
    };
    MathBackendWebGL.prototype.oneHot = function (indices, depth, onValue, offValue) {
        var program = new onehot_gpu_1.OneHotProgram(indices.size, depth, onValue, offValue);
        return this.compileAndRun(program, [indices]);
    };
    MathBackendWebGL.prototype.makeOutputArray = function (shape, dtype) {
        return tensor_1.Tensor.make(shape, {}, dtype);
    };
    MathBackendWebGL.prototype.compileAndRun = function (program, inputs, output, customSetup) {
        var _this = this;
        if (output == null) {
            output = this.makeOutputArray(program.outputShape, inputs[0].dtype);
        }
        var inputsData = inputs.map(function (tensor) {
            var texData = _this.texData.get(tensor.dataId);
            if (texData.texture == null && tensor.size <= exports.SIZE_UPLOAD_UNIFORM) {
                return { tensor: tensor, texData: null, isUniform: true };
            }
            _this.uploadToGPU(tensor.dataId);
            return { tensor: tensor, texData: texData, isUniform: false };
        });
        this.uploadToGPU(output.dataId);
        var outputData = {
            tensor: output,
            texData: this.texData.get(output.dataId),
            isUniform: false
        };
        var key = gpgpu_math.makeShaderKey(program, inputsData, outputData);
        var binary = this.getAndSaveBinary(key, function () {
            return gpgpu_math.compileProgram(_this.gpgpu, program, inputsData, outputData);
        });
        var shouldTimeProgram = this.activeTimers != null;
        var query;
        if (shouldTimeProgram) {
            query = this.startTimer();
        }
        gpgpu_math.runProgram(binary, inputsData, outputData, customSetup);
        if (this.numBytesInGPU > this.NUM_BYTES_BEFORE_PAGING) {
            var numBytesToPage = this.numBytesInGPU - this.NUM_BYTES_BEFORE_PAGING;
            while (numBytesToPage > 0) {
                var dataId = this.lruDataGPU.shift();
                var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
                numBytesToPage -= this.computeBytes(shape, dtype);
                this.read(dataId);
            }
        }
        if (shouldTimeProgram) {
            query = this.endTimer(query);
            this.activeTimers.push(this.getQueryTime(query));
        }
        return output;
    };
    MathBackendWebGL.prototype.getAndSaveBinary = function (key, getBinary) {
        if (!(key in this.binaryCache)) {
            this.binaryCache[key] = getBinary();
        }
        return this.binaryCache[key];
    };
    MathBackendWebGL.prototype.getTextureManager = function () {
        return this.textureManager;
    };
    MathBackendWebGL.prototype.dispose = function () {
        if (this.disposed) {
            return;
        }
        for (var key in this.binaryCache) {
            this.gpgpu.deleteProgram(this.binaryCache[key].webGLProgram);
        }
        this.textureManager.dispose();
        this.canvas.remove();
        if (this.fromPixelsCanvas != null) {
            this.fromPixelsCanvas.remove();
        }
        if (this.gpgpuCreatedLocally) {
            this.gpgpu.dispose();
        }
        this.disposed = true;
    };
    MathBackendWebGL.prototype.throwIfNoData = function (dataId) {
        if (!this.texData.has(dataId)) {
            throw new Error("WebGL backend: No data found for this tensor. " +
                "Did you change your backend in the middle of the program? " +
                "New backends can't use Tensors created with previous backends");
        }
    };
    MathBackendWebGL.prototype.uploadToGPU = function (dataId) {
        this.throwIfNoData(dataId);
        var texData = this.texData.get(dataId);
        var shape = texData.shape, values = texData.values, texture = texData.texture, dtype = texData.dtype, usage = texData.usage;
        if (texture != null) {
            this.lruDataGPU.splice(this.lruDataGPU.indexOf(dataId), 1);
            this.lruDataGPU.push(dataId);
            return;
        }
        var shouldTimeProgram = this.activeTimers != null;
        var start;
        if (shouldTimeProgram) {
            start = performance.now();
        }
        var texShape = webgl_util.getTextureShapeFromLogicalShape(this.gpgpu.gl, shape);
        texData.texShape = texShape;
        var newTexture = this.acquireTexture(dataId, texShape, usage);
        texData.texture = newTexture;
        if (values != null) {
            this.gpgpu.uploadMatrixToTexture(newTexture, texShape[0], texShape[1], typedArrayToFloat32(values, dtype));
            texData.values = null;
            if (shouldTimeProgram) {
                this.uploadWaitMs += performance.now() - start;
            }
        }
    };
    MathBackendWebGL.prototype.cacheOnCPU = function (dataId, float32Values) {
        var dontKeepCopyOnGPU = this.delayedStorage;
        var texData = this.texData.get(dataId);
        var texture = texData.texture, texShape = texData.texShape, dtype = texData.dtype, usage = texData.usage;
        if (dontKeepCopyOnGPU && texture != null) {
            this.releaseTexture(dataId, texture, texShape, usage);
            texData.texture = null;
            texData.texShape = null;
        }
        if (float32Values != null) {
            texData.values = float32ToTypedArray(float32Values, dtype);
        }
    };
    MathBackendWebGL.prototype.releaseTexture = function (dataId, texture, texShape, texType) {
        var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
        var idx = this.lruDataGPU.indexOf(dataId);
        if (idx >= 0) {
            this.lruDataGPU.splice(idx, 1);
        }
        this.numBytesInGPU -= this.computeBytes(shape, dtype);
        this.textureManager.releaseTexture(texture, texShape, texType);
    };
    MathBackendWebGL.prototype.acquireTexture = function (dataId, texShape, texType) {
        var _a = this.texData.get(dataId), shape = _a.shape, dtype = _a.dtype;
        this.lruDataGPU.push(dataId);
        this.numBytesInGPU += this.computeBytes(shape, dtype);
        return this.textureManager.acquireTexture(texShape, texType);
    };
    MathBackendWebGL.prototype.computeBytes = function (shape, dtype) {
        return util.sizeFromShape(shape) * util.bytesPerElement(dtype);
    };
    return MathBackendWebGL;
}());
exports.MathBackendWebGL = MathBackendWebGL;
if (environment_1.ENV.get('IS_BROWSER')) {
    environment_1.ENV.registerBackend('webgl', function () { return new MathBackendWebGL(); }, 2);
}
function float32ToTypedArray(a, dtype) {
    if (dtype === 'float32') {
        return a;
    }
    else if (dtype === 'int32' || dtype === 'bool') {
        var result = (dtype === 'int32') ? new Int32Array(a.length) :
            new Uint8Array(a.length);
        for (var i = 0; i < result.length; ++i) {
            result[i] = Math.round(a[i]);
        }
        return result;
    }
    else {
        throw new Error("Unknown dtype " + dtype);
    }
}
function typedArrayToFloat32(a, dtype) {
    return (a instanceof Float32Array) ? a : new Float32Array(a);
}
//# sourceMappingURL=backend_webgl.js.map