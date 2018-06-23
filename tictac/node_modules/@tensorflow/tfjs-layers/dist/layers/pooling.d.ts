import { serialization, Tensor } from '@tensorflow/tfjs-core';
import { DataFormat, PaddingMode, PoolMode } from '../common';
import { Layer, LayerConfig } from '../engine/topology';
import { Kwargs, Shape } from '../types';
export declare function pool2d(x: Tensor, poolSize: [number, number], strides?: [number, number], padding?: PaddingMode, dataFormat?: DataFormat, poolMode?: PoolMode): Tensor;
export interface Pooling1DLayerConfig extends LayerConfig {
    poolSize?: number;
    strides?: number;
    padding?: PaddingMode;
}
export declare abstract class Pooling1D extends Layer {
    protected readonly poolSize: [number];
    protected readonly strides: [number];
    protected readonly padding: PaddingMode;
    constructor(config: Pooling1DLayerConfig);
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    protected abstract poolingFunction(inputs: Tensor, poolSize: [number, number], strides: [number, number], padding: PaddingMode, dataFormat: DataFormat): Tensor;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    getConfig(): serialization.ConfigDict;
}
export declare class MaxPooling1D extends Pooling1D {
    static className: string;
    constructor(config: Pooling1DLayerConfig);
    protected poolingFunction(inputs: Tensor, poolSize: [number, number], strides: [number, number], padding: PaddingMode, dataFormat: DataFormat): Tensor;
}
export declare class AveragePooling1D extends Pooling1D {
    static className: string;
    constructor(config: Pooling1DLayerConfig);
    protected poolingFunction(inputs: Tensor, poolSize: [number, number], strides: [number, number], padding: PaddingMode, dataFormat: DataFormat): Tensor;
}
export interface Pooling2DLayerConfig extends LayerConfig {
    poolSize?: number | [number, number];
    strides?: number | [number, number];
    padding?: PaddingMode;
    dataFormat?: DataFormat;
}
export declare abstract class Pooling2D extends Layer {
    protected readonly poolSize: [number, number];
    protected readonly strides: [number, number];
    protected readonly padding: PaddingMode;
    protected readonly dataFormat: DataFormat;
    constructor(config: Pooling2DLayerConfig);
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    protected abstract poolingFunction(inputs: Tensor, poolSize: [number, number], strides: [number, number], padding: PaddingMode, dataFormat: DataFormat): Tensor;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    getConfig(): serialization.ConfigDict;
}
export declare class MaxPooling2D extends Pooling2D {
    static className: string;
    constructor(config: Pooling2DLayerConfig);
    protected poolingFunction(inputs: Tensor, poolSize: [number, number], strides: [number, number], padding: PaddingMode, dataFormat: DataFormat): Tensor;
}
export declare class AveragePooling2D extends Pooling2D {
    static className: string;
    constructor(config: Pooling2DLayerConfig);
    protected poolingFunction(inputs: Tensor, poolSize: [number, number], strides: [number, number], padding: PaddingMode, dataFormat: DataFormat): Tensor;
}
export declare abstract class GlobalPooling1D extends Layer {
    constructor(config: LayerConfig);
    computeOutputShape(inputShape: Shape): Shape;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
}
export declare class GlobalAveragePooling1D extends GlobalPooling1D {
    static className: string;
    constructor(config: LayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
}
export declare class GlobalMaxPooling1D extends GlobalPooling1D {
    static className: string;
    constructor(config: LayerConfig);
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
}
export interface GlobalPooling2DLayerConfig extends LayerConfig {
    dataFormat?: DataFormat;
}
export declare abstract class GlobalPooling2D extends Layer {
    protected dataFormat: DataFormat;
    constructor(config: GlobalPooling2DLayerConfig);
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    getConfig(): serialization.ConfigDict;
}
export declare class GlobalAveragePooling2D extends GlobalPooling2D {
    static className: string;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
}
export declare class GlobalMaxPooling2D extends GlobalPooling2D {
    static className: string;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
}
