"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
var tex_util_1 = require("./tex_util");
var TextureManager = (function () {
    function TextureManager(gpgpu) {
        this.gpgpu = gpgpu;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
        this.freeTextures = {};
        this.logEnabled = false;
        this.usedTextures = {};
    }
    TextureManager.prototype.acquireTexture = function (shapeRC, usage) {
        var physicalTexType = getPhysicalFromLogicalTextureType(usage);
        var shapeKey = getKeyFromTextureShape(shapeRC, physicalTexType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        if (!(shapeKey in this.usedTextures)) {
            this.usedTextures[shapeKey] = [];
        }
        if (this.freeTextures[shapeKey].length > 0) {
            this.numFreeTextures--;
            this.numUsedTextures++;
            this.log();
            var newTexture_1 = this.freeTextures[shapeKey].shift();
            this.usedTextures[shapeKey].push(newTexture_1);
            return newTexture_1;
        }
        this.numUsedTextures++;
        this.log();
        var newTexture;
        if (physicalTexType === tex_util_1.PhysicalTextureType.FLOAT32) {
            newTexture =
                this.gpgpu.createFloat32MatrixTexture(shapeRC[0], shapeRC[1]);
        }
        else if (physicalTexType === tex_util_1.PhysicalTextureType.FLOAT16) {
            newTexture =
                this.gpgpu.createFloat16MatrixTexture(shapeRC[0], shapeRC[1]);
        }
        else if (physicalTexType === tex_util_1.PhysicalTextureType.UNSIGNED_BYTE) {
            newTexture =
                this.gpgpu.createUnsignedBytesMatrixTexture(shapeRC[0], shapeRC[1]);
        }
        this.usedTextures[shapeKey].push(newTexture);
        return newTexture;
    };
    TextureManager.prototype.releaseTexture = function (texture, shape, logicalTexType) {
        var physicalTexType = getPhysicalFromLogicalTextureType(logicalTexType);
        var shapeKey = getKeyFromTextureShape(shape, physicalTexType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        this.freeTextures[shapeKey].push(texture);
        this.numFreeTextures++;
        this.numUsedTextures--;
        var texList = this.usedTextures[shapeKey];
        var texIndex = texList.indexOf(texture);
        if (texIndex < 0) {
            throw new Error('Cannot release a texture that was never provided by this ' +
                'texture manager');
        }
        texList.splice(texIndex, 1);
        this.log();
    };
    TextureManager.prototype.log = function () {
        if (!this.logEnabled) {
            return;
        }
        var total = this.numFreeTextures + this.numUsedTextures;
        console.log('Free/Used', this.numFreeTextures + " / " + this.numUsedTextures, "(" + total + ")");
    };
    TextureManager.prototype.getNumUsedTextures = function () {
        return this.numUsedTextures;
    };
    TextureManager.prototype.getNumFreeTextures = function () {
        return this.numFreeTextures;
    };
    TextureManager.prototype.dispose = function () {
        var _this = this;
        if (this.freeTextures == null) {
            return;
        }
        for (var texShape in this.freeTextures) {
            this.freeTextures[texShape].forEach(function (tex) {
                _this.gpgpu.deleteMatrixTexture(tex);
            });
        }
        for (var texShape in this.usedTextures) {
            this.usedTextures[texShape].forEach(function (tex) {
                _this.gpgpu.deleteMatrixTexture(tex);
            });
        }
        this.freeTextures = null;
        this.usedTextures = null;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
    };
    return TextureManager;
}());
exports.TextureManager = TextureManager;
function getPhysicalFromLogicalTextureType(logicalTexType) {
    if (logicalTexType === tex_util_1.TextureUsage.DOWNLOAD ||
        logicalTexType === tex_util_1.TextureUsage.PIXELS) {
        return tex_util_1.PhysicalTextureType.UNSIGNED_BYTE;
    }
    else if (logicalTexType === tex_util_1.TextureUsage.UPLOAD) {
        return tex_util_1.PhysicalTextureType.FLOAT32;
    }
    else if (logicalTexType === tex_util_1.TextureUsage.RENDER) {
        return environment_1.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED') ?
            tex_util_1.PhysicalTextureType.FLOAT32 :
            tex_util_1.PhysicalTextureType.FLOAT16;
    }
    throw new Error("Unknown logical texture type " + logicalTexType);
}
function getKeyFromTextureShape(shapeRowsCol, physicalTexType) {
    return shapeRowsCol[0] + "_" + shapeRowsCol[1] + "_" + physicalTexType;
}
//# sourceMappingURL=texture_manager.js.map