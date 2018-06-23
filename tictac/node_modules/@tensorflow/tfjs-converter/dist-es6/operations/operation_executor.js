import * as arithmetic from './executors/arithmetic_executor';
import * as basicMath from './executors/basic_math_executor';
import * as control from './executors/control_executor';
import * as convolution from './executors/convolution_executor';
import * as creation from './executors/creation_executor';
import * as graph from './executors/graph_executor';
import * as image from './executors/image_executor';
import * as logical from './executors/logical_executor';
import * as matrices from './executors/matrices_executor';
import * as normalization from './executors/normalization_executor';
import * as reduction from './executors/reduction_executor';
import * as sliceJoin from './executors/slice_join_executor';
import * as transformation from './executors/transformation_executor';
export function executeOp(node, tensorMap, context) {
    switch (node.category) {
        case 'arithmetic':
            return arithmetic.executeOp(node, tensorMap, context);
        case 'basic_math':
            return basicMath.executeOp(node, tensorMap, context);
        case 'control':
            return control.executeOp(node, tensorMap, context);
        case 'convolution':
            return convolution.executeOp(node, tensorMap, context);
        case 'creation':
            return creation.executeOp(node, tensorMap, context);
        case 'image':
            return image.executeOp(node, tensorMap, context);
        case 'graph':
            return graph.executeOp(node, tensorMap, context);
        case 'logical':
            return logical.executeOp(node, tensorMap, context);
        case 'matrices':
            return matrices.executeOp(node, tensorMap, context);
        case 'normalization':
            return normalization.executeOp(node, tensorMap, context);
        case 'reduction':
            return reduction.executeOp(node, tensorMap, context);
        case 'slice_join':
            return sliceJoin.executeOp(node, tensorMap, context);
        case 'transformation':
            return transformation.executeOp(node, tensorMap, context);
        default:
            throw TypeError("Node type " + node.op + " is not implemented");
    }
}
//# sourceMappingURL=operation_executor.js.map