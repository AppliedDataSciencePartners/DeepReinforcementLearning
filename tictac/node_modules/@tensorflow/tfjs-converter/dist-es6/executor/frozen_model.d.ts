import * as tfc from '@tensorflow/tfjs-core';
import { TensorInfo } from '@tensorflow/tfjs-core/dist/types';
export declare class FrozenModel implements tfc.InferenceModel {
    private modelUrl;
    private weightManifestUrl;
    private requestOption;
    private executor;
    private version;
    private weightManifest;
    private pathPrefix;
    readonly modelVersion: string;
    readonly inputNodes: string[];
    readonly outputNodes: string[];
    readonly inputs: TensorInfo[];
    readonly outputs: TensorInfo[];
    constructor(modelUrl: string, weightManifestUrl: string, requestOption?: RequestInit);
    getPathPrefix(): string;
    private loadRemoteProtoFile();
    private loadWeightManifest();
    load(): Promise<boolean>;
    predict(inputs: tfc.Tensor | tfc.Tensor[] | tfc.NamedTensorMap, config?: tfc.ModelPredictConfig): tfc.Tensor | tfc.Tensor[] | tfc.NamedTensorMap;
    private constructTensorMap(inputs);
    execute(inputs: tfc.Tensor | tfc.Tensor[] | tfc.NamedTensorMap, outputs?: string | string[]): tfc.Tensor | tfc.Tensor[];
    executeAsync(inputs: tfc.Tensor | tfc.Tensor[] | tfc.NamedTensorMap, outputs?: string | string[]): Promise<tfc.Tensor | tfc.Tensor[]>;
    private convertTensorMapToTensorsMap(map);
    dispose(): void;
}
export declare function loadFrozenModel(modelUrl: string, weightsManifestUrl: string, requestOption?: RequestInit): Promise<FrozenModel>;
