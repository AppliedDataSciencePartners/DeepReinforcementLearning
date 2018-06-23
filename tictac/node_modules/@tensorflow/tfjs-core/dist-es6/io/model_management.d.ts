import { ModelArtifactsInfo, ModelStoreManager } from './types';
export declare class ModelStoreManagerRegistry {
    private static instance;
    private managers;
    private constructor();
    private static getInstance();
    static registerManager(scheme: string, manager: ModelStoreManager): void;
    static getManager(scheme: string): ModelStoreManager;
    static getSchemes(): string[];
}
export declare function listModels(): Promise<{
    [url: string]: ModelArtifactsInfo;
}>;
export declare function removeModel(url: string): Promise<ModelArtifactsInfo>;
export declare function copyModel(sourceURL: string, destURL: string): Promise<ModelArtifactsInfo>;
export declare function moveModel(sourceURL: string, destURL: string): Promise<ModelArtifactsInfo>;
