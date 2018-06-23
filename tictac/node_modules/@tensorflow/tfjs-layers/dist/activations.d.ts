import { serialization, Tensor } from '@tensorflow/tfjs-core';
export declare abstract class Activation extends serialization.Serializable {
    abstract apply(tensor: Tensor, axis?: number): Tensor;
    getConfig(): serialization.ConfigDict;
}
export declare type ActivationIdentifier = 'elu' | 'hardSigmoid' | 'linear' | 'relu' | 'relu6' | 'selu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'tanh' | string;
export declare class Elu extends Activation {
    static readonly className: string;
    apply(x: Tensor, alpha?: number): Tensor;
}
export declare class Selu extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Relu extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Relu6 extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Linear extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Sigmoid extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class HardSigmoid extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Softplus extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Softsign extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Tanh extends Activation {
    static readonly className: string;
    apply(x: Tensor): Tensor;
}
export declare class Softmax extends Activation {
    static readonly className: string;
    apply(x: Tensor, axis?: number): Tensor;
}
export declare function serializeActivation(activation: Activation): string;
export declare function deserializeActivation(config: serialization.ConfigDict, customObjects?: serialization.ConfigDict): Activation;
export declare function getActivation(identifier: ActivationIdentifier | serialization.ConfigDict | Activation): Activation;
