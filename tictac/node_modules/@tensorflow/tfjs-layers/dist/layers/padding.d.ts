import { serialization, Tensor } from '@tensorflow/tfjs-core';
import { DataFormat } from '../common';
import { Layer, LayerConfig } from '../engine/topology';
import { Kwargs, Shape } from '../types';
export declare function temporalPadding(x: Tensor, padding?: [number, number]): Tensor;
export declare function spatial2dPadding(x: Tensor, padding?: [[number, number], [number, number]], dataFormat?: DataFormat): Tensor;
export interface ZeroPadding2DLayerConfig extends LayerConfig {
    padding?: number | [number, number] | [[number, number], [number, number]];
    dataFormat?: DataFormat;
}
export declare class ZeroPadding2D extends Layer {
    static className: string;
    readonly dataFormat: DataFormat;
    readonly padding: [[number, number], [number, number]];
    constructor(config?: ZeroPadding2DLayerConfig);
    computeOutputShape(inputShape: Shape | Shape[]): Shape | Shape[];
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor | Tensor[];
    getConfig(): serialization.ConfigDict;
}
