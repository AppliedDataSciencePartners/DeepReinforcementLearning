import { NamedTensorMap } from '../types';
import { WeightsManifestConfig } from './types';
export declare function loadWeights(manifest: WeightsManifestConfig, filePathPrefix?: string, weightNames?: string[], requestOptions?: RequestInit): Promise<NamedTensorMap>;
