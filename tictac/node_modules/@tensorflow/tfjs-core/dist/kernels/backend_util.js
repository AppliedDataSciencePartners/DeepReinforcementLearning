"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var array_ops_1 = require("../ops/array_ops");
function castTensor(x, dtype, backend) {
    if (!__1.util.hasEncodingLoss(x.dtype, dtype)) {
        return __1.Tensor.make(x.shape, { dataId: x.dataId }, dtype);
    }
    if (dtype === 'int32') {
        return backend.int(x);
    }
    else if (dtype === 'bool') {
        return backend.notEqual(x, array_ops_1.ArrayOps.scalar(0, x.dtype));
    }
    else {
        throw new Error("Error in Cast: unknown dtype argument (" + dtype + ")");
    }
}
exports.castTensor = castTensor;
function reshapeTensor(x, shape) {
    return __1.Tensor.make(shape, { dataId: x.dataId }, x.dtype);
}
exports.reshapeTensor = reshapeTensor;
//# sourceMappingURL=backend_util.js.map