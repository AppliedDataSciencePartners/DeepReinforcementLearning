import * as tfc from '@tensorflow/tfjs-core';
import { getParamValue } from './utils';
export var executeOp = function (node, tensorMap, context) {
    switch (node.op) {
        case 'resizeBilinear': {
            var images = getParamValue('images', node, tensorMap, context);
            var size = getParamValue('size', node, tensorMap, context);
            var alignCorners = getParamValue('alignCorners', node, tensorMap, context);
            return [tfc.image.resizeBilinear(images, [size[0], size[1]], alignCorners)];
        }
        case 'resizeNearestNeighbor': {
            var images = getParamValue('images', node, tensorMap, context);
            var size = getParamValue('size', node, tensorMap, context);
            var alignCorners = getParamValue('alignCorners', node, tensorMap, context);
            return [tfc.image.resizeNearestNeighbor(images, [size[0], size[1]], alignCorners)];
        }
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
};
export var CATEGORY = 'image';
//# sourceMappingURL=image_executor.js.map