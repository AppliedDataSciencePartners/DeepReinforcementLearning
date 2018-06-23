import * as tfc from '@tensorflow/tfjs-core';
import { NamedTensorsMap } from '../../data/types';
import { ExecutionContext } from '../../executor/execution_context';
import { Node, ValueType } from '../types';
export declare function getParamValue(paramName: string, node: Node, tensorMap: NamedTensorsMap, context: ExecutionContext): ValueType;
export declare function getTensor(name: string, tensorsMap: NamedTensorsMap, context: ExecutionContext): tfc.Tensor;
export declare function getNodeNameAndIndex(inputName: string, context?: ExecutionContext): [string, number];
export declare function parseNodeName(name: string): [string, number];
export declare function split(arr: number[], size: number): number[][];
