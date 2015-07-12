import { Type, BaseException } from 'angular2/src/facade/lang';
import { Injector, ProtoInjector, Key, Dependency, Binding, ResolvedBinding } from 'angular2/di';
import { BindingWithVisibility } from 'angular2/src/di/injector';
import { Query } from 'angular2/src/core/annotations_impl/di';
import * as viewModule from './view';
import * as avmModule from './view_manager';
import { ViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';
import { Directive } from 'angular2/src/core/annotations_impl/annotations';
import { QueryList } from './query_list';
import { DirectiveMetadata } from 'angular2/src/render/api';
export declare class TreeNode<T extends TreeNode<any>> {
    _parent: T;
    _head: T;
    _tail: T;
    _next: T;
    constructor(parent: T);
    /**
     * Adds a child to the parent node. The child MUST NOT be a part of a tree.
     */
    addChild(child: T): void;
    /**
     * Adds a child to the parent node after a given sibling.
     * The child MUST NOT be a part of a tree and the sibling must be present.
     */
    addChildAfter(child: T, prevSibling: T): void;
    /**
     * Detaches a node from the parent's tree.
     */
    remove(): void;
    /**
     * Finds a previous sibling or returns null if first child.
     * Assumes the node has a parent.
     * TODO(rado): replace with DoublyLinkedList to avoid O(n) here.
     */
    _findPrev(): any;
    parent: T;
    children: T[];
}
export declare class DirectiveDependency extends Dependency {
    attributeName: string;
    queryDecorator: Query;
    constructor(key: Key, optional: boolean, visibility: any, properties: List<any>, attributeName: string, queryDecorator: Query);
    _verify(): void;
    static createFrom(d: Dependency): Dependency;
    static _attributeName(properties: any): string;
    static _query(properties: any): Query;
}
export declare class DirectiveBinding extends ResolvedBinding {
    resolvedHostInjectables: List<ResolvedBinding>;
    resolvedViewInjectables: List<ResolvedBinding>;
    metadata: DirectiveMetadata;
    constructor(key: Key, factory: Function, dependencies: List<Dependency>, resolvedHostInjectables: List<ResolvedBinding>, resolvedViewInjectables: List<ResolvedBinding>, metadata: DirectiveMetadata);
    callOnDestroy: boolean;
    callOnChange: boolean;
    callOnAllChangesDone: boolean;
    displayName: string;
    eventEmitters: List<string>;
    hostActions: Map<string, string>;
    changeDetection: string;
    static createFromBinding(binding: Binding, ann: Directive): DirectiveBinding;
    static _readAttributes(deps: any): any[];
    static createFromType(type: Type, annotation: Directive): DirectiveBinding;
}
export declare class PreBuiltObjects {
    viewManager: avmModule.AppViewManager;
    view: viewModule.AppView;
    protoView: viewModule.AppProtoView;
    constructor(viewManager: avmModule.AppViewManager, view: viewModule.AppView, protoView: viewModule.AppProtoView);
}
export declare class EventEmitterAccessor {
    eventName: string;
    getter: Function;
    constructor(eventName: string, getter: Function);
    subscribe(view: viewModule.AppView, boundElementIndex: number, directive: Object): Object;
}
export declare class HostActionAccessor {
    methodName: string;
    getter: Function;
    constructor(methodName: string, getter: Function);
    subscribe(view: viewModule.AppView, boundElementIndex: number, directive: Object): Object;
}
export declare class ProtoElementInjector {
    parent: ProtoElementInjector;
    index: int;
    distanceToParent: number;
    _firstBindingIsComponent: boolean;
    directiveVariableBindings: Map<string, number>;
    view: viewModule.AppView;
    attributes: Map<string, string>;
    eventEmitterAccessors: List<List<EventEmitterAccessor>>;
    hostActionAccessors: List<List<HostActionAccessor>>;
    protoInjector: ProtoInjector;
    static create(parent: ProtoElementInjector, index: number, bindings: List<ResolvedBinding>, firstBindingIsComponent: boolean, distanceToParent: number, directiveVariableBindings: Map<string, number>): ProtoElementInjector;
    private static _createDirectiveBindingWithVisibility(dirBindings, bd, firstBindingIsComponent);
    private static _createHostInjectorBindingWithVisibility(dirBindings, bd, firstBindingIsComponent);
    private static _createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, binding);
    private static _createViewInjectorBindingWithVisibility(bindings, bd);
    constructor(parent: ProtoElementInjector, index: int, bwv: BindingWithVisibility[], distanceToParent: number, _firstBindingIsComponent: boolean, directiveVariableBindings: Map<string, number>);
    instantiate(parent: ElementInjector): ElementInjector;
    directParent(): ProtoElementInjector;
    hasBindings: boolean;
    getBindingAtIndex(index: number): any;
}
export declare class ElementInjector extends TreeNode<ElementInjector> {
    _proto: ProtoElementInjector;
    private _host;
    private _preBuiltObjects;
    private _query0;
    private _query1;
    private _query2;
    hydrated: boolean;
    private _injector;
    private _strategy;
    constructor(_proto: ProtoElementInjector, parent: ElementInjector);
    dehydrate(): void;
    onAllChangesDone(): void;
    hydrate(imperativelyCreatedInjector: Injector, host: ElementInjector, preBuiltObjects: PreBuiltObjects): void;
    private _hydrateInjector(imperativelyCreatedInjector, host);
    private _getParentInjector(injector, host);
    private _reattachInjector(injector, parentInjector, isBoundary);
    hasVariableBinding(name: string): boolean;
    getVariableBinding(name: string): any;
    get(token: any): any;
    hasDirective(type: Type): boolean;
    getEventEmitterAccessors(): List<List<EventEmitterAccessor>>;
    getHostActionAccessors(): List<List<HostActionAccessor>>;
    getDirectiveVariableBindings(): Map<string, number>;
    getComponent(): any;
    getElementRef(): ElementRef;
    getViewContainerRef(): ViewContainerRef;
    directParent(): ElementInjector;
    isComponentKey(key: Key): boolean;
    getDependency(dep: any): any;
    private _buildAttribute(dep);
    _buildQueriesForDeps(deps: List<DirectiveDependency>): void;
    private _addVarBindingsToQueries();
    private _addDirectivesToQueries();
    private _addVarBindingsToQuery(queryRef);
    private _addDirectivesToQuery(queryRef);
    private _createQueryRef(query);
    addDirectivesMatchingQuery(query: Query, list: any[]): void;
    private _buildQueries();
    private _findQuery(query);
    _hasQuery(query: QueryRef): boolean;
    link(parent: ElementInjector): void;
    linkAfter(parent: ElementInjector, prevSibling: ElementInjector): void;
    private _addParentQueries();
    unlink(): void;
    private _pruneQueryFromTree(query);
    private _addQueryToTree(queryRef);
    private _addQueryToTreeSelfAndRecurse(queryRef);
    private _assignQueryRef(query);
    private _removeQueryRef(query);
    getDirectiveAtIndex(index: number): any;
    hasInstances(): boolean;
    getHost(): ElementInjector;
    getBoundElementIndex(): number;
}
export declare class QueryError extends BaseException {
    message: string;
    constructor();
    toString(): string;
}
export declare class QueryRef {
    query: Query;
    list: QueryList<any>;
    originator: ElementInjector;
    constructor(query: Query, list: QueryList<any>, originator: ElementInjector);
    update(): void;
    visit(inj: ElementInjector, aggregator: any[]): void;
    private _aggregateVariableBindings(inj, aggregator);
    private _aggregateDirective(inj, aggregator);
}
