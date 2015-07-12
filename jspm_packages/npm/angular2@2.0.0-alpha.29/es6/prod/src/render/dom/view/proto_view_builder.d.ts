import { ASTWithSource, AST, AstTransformer, AccessMember } from 'angular2/change_detection';
import { Event } from './element_binder';
import * as api from '../../api';
export declare class ProtoViewBuilder {
    rootElement: any;
    type: api.ViewType;
    variableBindings: Map<string, string>;
    elements: List<ElementBinderBuilder>;
    constructor(rootElement: any, type: api.ViewType);
    bindElement(element: any, description?: any): ElementBinderBuilder;
    bindVariable(name: any, value: any): void;
    build(): api.ProtoViewDto;
    private _analyzeChildNodes(parentElement, boundTextNodes);
}
export declare class ElementBinderBuilder {
    index: number;
    element: any;
    parent: ElementBinderBuilder;
    distanceToParent: number;
    directives: List<DirectiveBuilder>;
    nestedProtoView: ProtoViewBuilder;
    propertyBindings: Map<string, ASTWithSource>;
    variableBindings: Map<string, string>;
    propertyBindingsToDirectives: Set<string>;
    eventBindings: List<api.EventBinding>;
    eventBuilder: EventBuilder;
    textBindingNodes: List<any>;
    textBindings: List<ASTWithSource>;
    contentTagSelector: string;
    readAttributes: Map<string, string>;
    componentId: string;
    constructor(index: number, element: any, description: string);
    setParent(parent: ElementBinderBuilder, distanceToParent: any): ElementBinderBuilder;
    readAttribute(attrName: string): void;
    bindDirective(directiveIndex: number): DirectiveBuilder;
    bindNestedProtoView(rootElement: any): ProtoViewBuilder;
    bindProperty(name: string, expression: ASTWithSource): void;
    bindPropertyToDirective(name: string): void;
    bindVariable(name: any, value: any): void;
    bindEvent(name: any, expression: any, target?: any): void;
    bindText(textNode: any, expression: any): void;
    setContentTagSelector(value: string): void;
    setComponentId(componentId: string): void;
}
export declare class DirectiveBuilder {
    directiveIndex: number;
    propertyBindings: Map<string, ASTWithSource>;
    templatePropertyNames: List<string>;
    hostPropertyBindings: Map<string, ASTWithSource>;
    eventBindings: List<api.EventBinding>;
    eventBuilder: EventBuilder;
    constructor(directiveIndex: number);
    bindProperty(name: string, expression: ASTWithSource, elProp: string): void;
    bindHostProperty(name: string, expression: ASTWithSource): void;
    bindEvent(name: any, expression: any, target?: any): void;
}
export declare class EventBuilder extends AstTransformer {
    locals: List<AST>;
    localEvents: List<Event>;
    globalEvents: List<Event>;
    _implicitReceiver: AST;
    constructor();
    add(name: string, source: ASTWithSource, target: string): api.EventBinding;
    visitAccessMember(ast: AccessMember): AccessMember;
    buildEventLocals(): List<AST>;
    buildLocalEvents(): List<Event>;
    buildGlobalEvents(): List<Event>;
    merge(eventBuilder: EventBuilder): void;
    _merge(host: List<Event>, tobeAdded: List<Event>): void;
}
