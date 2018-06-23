import { Scalar, serialization, Tensor } from '@tensorflow/tfjs-core';
export declare abstract class Regularizer extends serialization.Serializable {
    abstract apply(x: Tensor): Scalar;
}
export interface L1L2Config {
    l1?: number;
    l2?: number;
}
export interface L1Config {
    l1: number;
}
export interface L2Config {
    l2: number;
}
export declare class L1L2 extends Regularizer {
    static className: string;
    private readonly l1;
    private readonly l2;
    private readonly hasL1;
    private readonly hasL2;
    constructor(config?: L1L2Config);
    apply(x: Tensor): Scalar;
    getConfig(): serialization.ConfigDict;
    static fromConfig<T extends serialization.Serializable>(cls: serialization.SerializableConstructor<T>, config: serialization.ConfigDict): T;
}
export declare function l1(config?: L1Config): L1L2;
export declare function l2(config: L2Config): L1L2;
export declare type RegularizerIdentifier = 'l1l2' | string;
export declare const REGULARIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP: {
    [identifier in RegularizerIdentifier]: string;
};
export declare function serializeRegularizer(constraint: Regularizer): serialization.ConfigDictValue;
export declare function deserializeRegularizer(config: serialization.ConfigDict, customObjects?: serialization.ConfigDict): Regularizer;
export declare function getRegularizer(identifier: RegularizerIdentifier | serialization.ConfigDict | Regularizer): Regularizer;
