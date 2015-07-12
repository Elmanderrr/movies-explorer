import { ProtoChangeDetector, ChangeDetector, ChangeDetectorDefinition } from './interfaces';
export declare class JitProtoChangeDetector implements ProtoChangeDetector {
    private _pipeRegistry;
    private definition;
    _factory: Function;
    constructor(_pipeRegistry: any, definition: ChangeDetectorDefinition);
    static isSupported(): boolean;
    instantiate(dispatcher: any): ChangeDetector;
    _createFactory(definition: ChangeDetectorDefinition): Function;
}
export declare var __esModule: boolean;
