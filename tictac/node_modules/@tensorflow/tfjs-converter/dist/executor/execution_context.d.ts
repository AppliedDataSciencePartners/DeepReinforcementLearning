import { Tensor } from '@tensorflow/tfjs-core';
import { NamedTensorsMap } from '../data/types';
export interface ExecutionContextInfo {
    id: number;
    frameName: string;
    iterationId: number;
}
export declare class ExecutionContext {
    weightMap: NamedTensorsMap;
    private rootContext;
    private contexts;
    private lastId;
    private _currentContextIds;
    constructor(weightMap: NamedTensorsMap);
    private newFrame(id, frameName);
    currentContext: ExecutionContextInfo[];
    readonly currentContextId: string;
    readonly currentContextIds: string[];
    private generateCurrentContextIds();
    private contextIdforContexts(contexts);
    enterFrame(frameId: string): void;
    exitFrame(): void;
    nextIteration(): void;
    getWeight(name: string): Tensor[];
}
