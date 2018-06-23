import { PaddingMode } from '../common';
export declare function normalizeArray(value: number | number[], n: number, name: string): number[];
export declare function convOutputLength(inputLength: number, filterSize: number, padding: PaddingMode, stride: number, dilation?: number): number;
export declare function deconvLength(dimSize: number, strideSize: number, kernelSize: number, padding: PaddingMode): number;
