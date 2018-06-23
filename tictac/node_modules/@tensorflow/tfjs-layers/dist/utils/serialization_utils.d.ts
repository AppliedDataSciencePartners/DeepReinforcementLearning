import { serialization } from '@tensorflow/tfjs-core';
import { JsonValue } from '../types';
export declare function convertPythonicToTs(pythonicConfig: JsonValue, key?: string): serialization.ConfigDictValue;
export declare function convertTsToPythonic(tsConfig: serialization.ConfigDictValue, key?: string): JsonValue;
