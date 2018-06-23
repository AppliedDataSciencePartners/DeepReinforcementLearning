import * as tfc from '@tensorflow/tfjs-core';
import { NamedTensorsMap } from '../../data/types';
import { ExecutionContext } from '../../executor/execution_context';
import { Node } from '../types';
export declare function executeOp(node: Node, tensorMap: NamedTensorsMap, context: ExecutionContext): Promise<tfc.Tensor[]>;
export declare const CATEGORY = "control";
