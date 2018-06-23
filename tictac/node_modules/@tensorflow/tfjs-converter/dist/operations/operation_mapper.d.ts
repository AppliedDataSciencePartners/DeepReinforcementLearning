import { tensorflow } from '../data/compiled_api';
import { Graph } from './types';
export declare class OperationMapper {
    private static _instance;
    private opMappers;
    static readonly Instance: OperationMapper;
    private constructor();
    private isControlFlow(node);
    transformGraph(graph: tensorflow.IGraphDef): Graph;
    private mapNode(node);
    private getStringParam(attrs, name, def, keepCase?);
    private getBoolParam(attrs, name, def);
    private getNumberParam(attrs, name, def);
    private getDtypeParam(attrs, name, def);
    private getTensorShapeParam(attrs, name, def?);
    private getNumericArrayParam(attrs, name, def);
}
