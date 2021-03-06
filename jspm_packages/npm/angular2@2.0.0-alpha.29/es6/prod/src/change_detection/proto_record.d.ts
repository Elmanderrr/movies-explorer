import { BindingRecord } from './binding_record';
import { DirectiveIndex } from './directive_record';
export declare enum RecordType {
    SELF = 0,
    CONST = 1,
    PRIMITIVE_OP = 2,
    PROPERTY = 3,
    LOCAL = 4,
    INVOKE_METHOD = 5,
    INVOKE_CLOSURE = 6,
    KEYED_ACCESS = 7,
    PIPE = 8,
    INTERPOLATE = 9,
    SAFE_PROPERTY = 10,
    SAFE_INVOKE_METHOD = 11,
    DIRECTIVE_LIFECYCLE = 12,
}
export declare class ProtoRecord {
    mode: RecordType;
    name: string;
    funcOrValue: any;
    args: List<any>;
    fixedArgs: List<any>;
    contextIndex: number;
    directiveIndex: DirectiveIndex;
    selfIndex: number;
    bindingRecord: BindingRecord;
    expressionAsString: string;
    lastInBinding: boolean;
    lastInDirective: boolean;
    constructor(mode: RecordType, name: string, funcOrValue: any, args: List<any>, fixedArgs: List<any>, contextIndex: number, directiveIndex: DirectiveIndex, selfIndex: number, bindingRecord: BindingRecord, expressionAsString: string, lastInBinding: boolean, lastInDirective: boolean);
    isPureFunction(): boolean;
    isPipeRecord(): boolean;
    isLifeCycleRecord(): boolean;
}
