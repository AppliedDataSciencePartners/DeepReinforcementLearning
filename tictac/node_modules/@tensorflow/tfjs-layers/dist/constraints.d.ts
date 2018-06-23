import { serialization, Tensor } from '@tensorflow/tfjs-core';
export declare abstract class Constraint extends serialization.Serializable {
    abstract apply(w: Tensor): Tensor;
    getConfig(): serialization.ConfigDict;
}
export interface MaxNormConfig {
    maxValue?: number;
    axis?: number;
}
export declare class MaxNorm extends Constraint {
    static readonly className: string;
    private maxValue;
    private axis;
    private readonly defaultMaxValue;
    private readonly defaultAxis;
    constructor(config: MaxNormConfig);
    apply(w: Tensor): Tensor;
    getConfig(): serialization.ConfigDict;
}
export interface UnitNormConfig {
    axis?: number;
}
export declare class UnitNorm extends Constraint {
    static readonly className: string;
    private axis;
    private readonly defaultAxis;
    constructor(config: UnitNormConfig);
    apply(w: Tensor): Tensor;
    getConfig(): serialization.ConfigDict;
}
export declare class NonNeg extends Constraint {
    static readonly className: string;
    apply(w: Tensor): Tensor;
}
export interface MinMaxNormConfig {
    minValue?: number;
    maxValue?: number;
    axis?: number;
    rate?: number;
}
export declare class MinMaxNorm extends Constraint {
    static readonly className: string;
    private minValue;
    private maxValue;
    private rate;
    private axis;
    private readonly defaultMinValue;
    private readonly defaultMaxValue;
    private readonly defaultRate;
    private readonly defaultAxis;
    constructor(config: MinMaxNormConfig);
    apply(w: Tensor): Tensor;
    getConfig(): serialization.ConfigDict;
}
export declare type ConstraintIdentifier = 'maxNorm' | 'minMaxNorm' | 'nonNeg' | 'unitNorm' | string;
export declare const CONSTRAINT_IDENTIFIER_REGISTRY_SYMBOL_MAP: {
    [identifier in ConstraintIdentifier]: string;
};
export declare function serializeConstraint(constraint: Constraint): serialization.ConfigDictValue;
export declare function deserializeConstraint(config: serialization.ConfigDict, customObjects?: serialization.ConfigDict): Constraint;
export declare function getConstraint(identifier: ConstraintIdentifier | serialization.ConfigDict | Constraint): Constraint;
