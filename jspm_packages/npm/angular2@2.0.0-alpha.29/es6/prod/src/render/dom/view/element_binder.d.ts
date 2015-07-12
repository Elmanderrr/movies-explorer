import { AST } from 'angular2/change_detection';
import * as protoViewModule from './proto_view';
export declare class ElementBinder {
    contentTagSelector: string;
    textNodeIndices: List<number>;
    nestedProtoView: protoViewModule.DomProtoView;
    eventLocals: AST;
    localEvents: List<Event>;
    globalEvents: List<Event>;
    componentId: string;
    parentIndex: number;
    distanceToParent: number;
    elementIsEmpty: boolean;
    constructor({textNodeIndices, contentTagSelector, nestedProtoView, componentId, eventLocals, localEvents, globalEvents, parentIndex, distanceToParent, elementIsEmpty}?: {
        contentTagSelector?: string;
        textNodeIndices?: List<number>;
        nestedProtoView?: protoViewModule.DomProtoView;
        eventLocals?: AST;
        localEvents?: List<Event>;
        globalEvents?: List<Event>;
        componentId?: string;
        parentIndex?: number;
        distanceToParent?: number;
        elementIsEmpty?: boolean;
    });
}
export declare class Event {
    name: string;
    target: string;
    fullName: string;
    constructor(name: string, target: string, fullName: string);
}
export declare class HostAction {
    actionName: string;
    actionExpression: string;
    expression: AST;
    constructor(actionName: string, actionExpression: string, expression: AST);
}
