import { Tensor } from '@tensorflow/tfjs-core';
export declare function expectTensorsClose(actual: Tensor | number[], expected: Tensor | number[], epsilon?: number): void;
export declare function expectTensorsValuesInRange(actual: Tensor, low: number, high: number): void;
export declare function describeMathCPUAndGPU(testName: string, tests: () => void): void;
export declare function describeMathCPU(testName: string, tests: () => void): void;
export declare function describeMathGPU(testName: string, tests: () => void): void;
export declare function expectNoLeakedTensors(testFunc: () => any, numNewTensors: number): void;
