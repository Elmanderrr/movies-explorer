/* */ 
"format cjs";
import { isPresent, isBlank, BaseException, stringify, StringWrapper } from 'angular2/src/facade/lang';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { ListWrapper, MapWrapper } from 'angular2/src/facade/collection';
import { Injector, ProtoInjector, PUBLIC_AND_PRIVATE, PUBLIC, PRIVATE, undefinedValue, Key, Dependency, Binding, ResolvedBinding, NoBindingError, resolveBindings } from 'angular2/di';
import { InjectorInlineStrategy, BindingWithVisibility } from 'angular2/src/di/injector';
import { Attribute, Query } from 'angular2/src/core/annotations_impl/di';
import * as avmModule from './view_manager';
import { ViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';
import { ProtoViewRef } from './view_ref';
import { Directive, Component, onChange, onDestroy, onCheck, onInit, onAllChangesDone } from 'angular2/src/core/annotations_impl/annotations';
import { hasLifecycleHook } from './directive_lifecycle_reflector';
import { ChangeDetectorRef } from 'angular2/change_detection';
import { QueryList } from './query_list';
import { reflector } from 'angular2/src/reflection/reflection';
import { DirectiveMetadata } from 'angular2/src/render/api';
var _staticKeys;
class StaticKeys {
    constructor() {
        // TODO: vsavkin Key.annotate(Key.get(AppView), 'static')
        this.viewManagerId = Key.get(avmModule.AppViewManager).id;
        this.protoViewId = Key.get(ProtoViewRef).id;
        this.viewContainerId = Key.get(ViewContainerRef).id;
        this.changeDetectorRefId = Key.get(ChangeDetectorRef).id;
        this.elementRefId = Key.get(ElementRef).id;
    }
    static instance() {
        if (isBlank(_staticKeys))
            _staticKeys = new StaticKeys();
        return _staticKeys;
    }
}
export class TreeNode {
    constructor(parent) {
        this._head = null;
        this._tail = null;
        this._next = null;
        if (isPresent(parent))
            parent.addChild(this);
    }
    /**
     * Adds a child to the parent node. The child MUST NOT be a part of a tree.
     */
    addChild(child) {
        if (isPresent(this._tail)) {
            this._tail._next = child;
            this._tail = child;
        }
        else {
            this._tail = this._head = child;
        }
        child._next = null;
        child._parent = this;
    }
    /**
     * Adds a child to the parent node after a given sibling.
     * The child MUST NOT be a part of a tree and the sibling must be present.
     */
    addChildAfter(child, prevSibling) {
        if (isBlank(prevSibling)) {
            var prevHead = this._head;
            this._head = child;
            child._next = prevHead;
            if (isBlank(this._tail))
                this._tail = child;
        }
        else if (isBlank(prevSibling._next)) {
            this.addChild(child);
            return;
        }
        else {
            child._next = prevSibling._next;
            prevSibling._next = child;
        }
        child._parent = this;
    }
    /**
     * Detaches a node from the parent's tree.
     */
    remove() {
        if (isBlank(this.parent))
            return;
        var nextSibling = this._next;
        var prevSibling = this._findPrev();
        if (isBlank(prevSibling)) {
            this.parent._head = this._next;
        }
        else {
            prevSibling._next = this._next;
        }
        if (isBlank(nextSibling)) {
            this._parent._tail = prevSibling;
        }
        this._parent = null;
        this._next = null;
    }
    /**
     * Finds a previous sibling or returns null if first child.
     * Assumes the node has a parent.
     * TODO(rado): replace with DoublyLinkedList to avoid O(n) here.
     */
    _findPrev() {
        var node = this.parent._head;
        if (node == this)
            return null;
        while (node._next !== this)
            node = node._next;
        return node;
    }
    get parent() { return this._parent; }
    // TODO(rado): replace with a function call, does too much work for a getter.
    get children() {
        var res = [];
        var child = this._head;
        while (child != null) {
            res.push(child);
            child = child._next;
        }
        return res;
    }
}
export class DirectiveDependency extends Dependency {
    constructor(key, optional, visibility, properties, attributeName, queryDecorator) {
        super(key, optional, visibility, properties);
        this.attributeName = attributeName;
        this.queryDecorator = queryDecorator;
        this._verify();
    }
    _verify() {
        var count = 0;
        if (isPresent(this.queryDecorator))
            count++;
        if (isPresent(this.attributeName))
            count++;
        if (count > 1)
            throw new BaseException('A directive injectable can contain only one of the following @Attribute or @Query.');
    }
    static createFrom(d) {
        return new DirectiveDependency(d.key, d.optional, d.visibility, d.properties, DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
    }
    static _attributeName(properties) {
        var p = ListWrapper.find(properties, (p) => p instanceof Attribute);
        return isPresent(p) ? p.attributeName : null;
    }
    static _query(properties) {
        return ListWrapper.find(properties, (p) => p instanceof Query);
    }
}
export class DirectiveBinding extends ResolvedBinding {
    constructor(key, factory, dependencies, resolvedHostInjectables, resolvedViewInjectables, metadata) {
        super(key, factory, dependencies);
        this.resolvedHostInjectables = resolvedHostInjectables;
        this.resolvedViewInjectables = resolvedViewInjectables;
        this.metadata = metadata;
    }
    get callOnDestroy() { return this.metadata.callOnDestroy; }
    get callOnChange() { return this.metadata.callOnChange; }
    get callOnAllChangesDone() { return this.metadata.callOnAllChangesDone; }
    get displayName() { return this.key.displayName; }
    get eventEmitters() {
        return isPresent(this.metadata) && isPresent(this.metadata.events) ? this.metadata.events : [];
    }
    get hostActions() {
        return isPresent(this.metadata) && isPresent(this.metadata.hostActions) ?
            this.metadata.hostActions :
            new Map();
    }
    get changeDetection() { return this.metadata.changeDetection; }
    static createFromBinding(binding, ann) {
        if (isBlank(ann)) {
            ann = new Directive();
        }
        var rb = binding.resolve();
        var deps = ListWrapper.map(rb.dependencies, DirectiveDependency.createFrom);
        var resolvedHostInjectables = isPresent(ann.hostInjector) ? resolveBindings(ann.hostInjector) : [];
        var resolvedViewInjectables = ann instanceof Component && isPresent(ann.viewInjector) ?
            resolveBindings(ann.viewInjector) :
            [];
        var metadata = DirectiveMetadata.create({
            id: stringify(rb.key.token),
            type: ann instanceof
                Component ? DirectiveMetadata.COMPONENT_TYPE : DirectiveMetadata.DIRECTIVE_TYPE,
            selector: ann.selector,
            compileChildren: ann.compileChildren,
            events: ann.events,
            host: isPresent(ann.host) ? MapWrapper.createFromStringMap(ann.host) : null,
            properties: ann.properties,
            readAttributes: DirectiveBinding._readAttributes(deps),
            callOnDestroy: hasLifecycleHook(onDestroy, rb.key.token, ann),
            callOnChange: hasLifecycleHook(onChange, rb.key.token, ann),
            callOnCheck: hasLifecycleHook(onCheck, rb.key.token, ann),
            callOnInit: hasLifecycleHook(onInit, rb.key.token, ann),
            callOnAllChangesDone: hasLifecycleHook(onAllChangesDone, rb.key.token, ann),
            changeDetection: ann instanceof
                Component ? ann.changeDetection : null,
            exportAs: ann.exportAs
        });
        return new DirectiveBinding(rb.key, rb.factory, deps, resolvedHostInjectables, resolvedViewInjectables, metadata);
    }
    static _readAttributes(deps) {
        var readAttributes = [];
        ListWrapper.forEach(deps, (dep) => {
            if (isPresent(dep.attributeName)) {
                readAttributes.push(dep.attributeName);
            }
        });
        return readAttributes;
    }
    static createFromType(type, annotation) {
        var binding = new Binding(type, { toClass: type });
        return DirectiveBinding.createFromBinding(binding, annotation);
    }
}
// TODO(rado): benchmark and consider rolling in as ElementInjector fields.
export class PreBuiltObjects {
    constructor(viewManager, view, protoView) {
        this.viewManager = viewManager;
        this.view = view;
        this.protoView = protoView;
    }
}
export class EventEmitterAccessor {
    constructor(eventName, getter) {
        this.eventName = eventName;
        this.getter = getter;
    }
    subscribe(view, boundElementIndex, directive) {
        var eventEmitter = this.getter(directive);
        return ObservableWrapper.subscribe(eventEmitter, eventObj => view.triggerEventHandlers(this.eventName, eventObj, boundElementIndex));
    }
}
export class HostActionAccessor {
    constructor(methodName, getter) {
        this.methodName = methodName;
        this.getter = getter;
    }
    subscribe(view, boundElementIndex, directive) {
        var eventEmitter = this.getter(directive);
        return ObservableWrapper.subscribe(eventEmitter, actionArgs => view.invokeElementMethod(boundElementIndex, this.methodName, actionArgs));
    }
}
function _createEventEmitterAccessors(bwv) {
    var binding = bwv.binding;
    if (!(binding instanceof DirectiveBinding))
        return [];
    var db = binding;
    return ListWrapper.map(db.eventEmitters, eventConfig => {
        let fieldName;
        let eventName;
        var colonIdx = eventConfig.indexOf(':');
        if (colonIdx > -1) {
            // long format: 'fieldName: eventName'
            fieldName = StringWrapper.substring(eventConfig, 0, colonIdx).trim();
            eventName = StringWrapper.substring(eventConfig, colonIdx + 1).trim();
        }
        else {
            // short format: 'name' when fieldName and eventName are the same
            fieldName = eventName = eventConfig;
        }
        return new EventEmitterAccessor(eventName, reflector.getter(fieldName));
    });
}
function _createHostActionAccessors(bwv) {
    var binding = bwv.binding;
    if (!(binding instanceof DirectiveBinding))
        return [];
    var res = [];
    var db = binding;
    MapWrapper.forEach(db.hostActions, (actionExpression, actionName) => {
        res.push(new HostActionAccessor(actionExpression, reflector.getter(actionName)));
    });
    return res;
}
export class ProtoElementInjector {
    constructor(parent, index, bwv, distanceToParent, _firstBindingIsComponent, directiveVariableBindings) {
        this.parent = parent;
        this.index = index;
        this.distanceToParent = distanceToParent;
        this._firstBindingIsComponent = _firstBindingIsComponent;
        this.directiveVariableBindings = directiveVariableBindings;
        var length = bwv.length;
        this.protoInjector = new ProtoInjector(bwv, distanceToParent);
        this.eventEmitterAccessors = ListWrapper.createFixedSize(length);
        this.hostActionAccessors = ListWrapper.createFixedSize(length);
        for (var i = 0; i < length; ++i) {
            this.eventEmitterAccessors[i] = _createEventEmitterAccessors(bwv[i]);
            this.hostActionAccessors[i] = _createHostActionAccessors(bwv[i]);
        }
    }
    static create(parent, index, bindings, firstBindingIsComponent, distanceToParent, directiveVariableBindings) {
        var bd = [];
        ProtoElementInjector._createDirectiveBindingWithVisibility(bindings, bd, firstBindingIsComponent);
        if (firstBindingIsComponent) {
            ProtoElementInjector._createViewInjectorBindingWithVisibility(bindings, bd);
        }
        ProtoElementInjector._createHostInjectorBindingWithVisibility(bindings, bd, firstBindingIsComponent);
        return new ProtoElementInjector(parent, index, bd, distanceToParent, firstBindingIsComponent, directiveVariableBindings);
    }
    static _createDirectiveBindingWithVisibility(dirBindings, bd, firstBindingIsComponent) {
        ListWrapper.forEach(dirBindings, dirBinding => {
            bd.push(ProtoElementInjector._createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, dirBinding));
        });
    }
    static _createHostInjectorBindingWithVisibility(dirBindings, bd, firstBindingIsComponent) {
        ListWrapper.forEach(dirBindings, dirBinding => {
            ListWrapper.forEach(dirBinding.resolvedHostInjectables, b => {
                bd.push(ProtoElementInjector._createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, b));
            });
        });
    }
    static _createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, binding) {
        var isComponent = firstBindingIsComponent && dirBindings[0] === dirBinding;
        return new BindingWithVisibility(binding, isComponent ? PUBLIC_AND_PRIVATE : PUBLIC);
    }
    static _createViewInjectorBindingWithVisibility(bindings, bd) {
        var db = bindings[0];
        ListWrapper.forEach(db.resolvedViewInjectables, b => bd.push(new BindingWithVisibility(b, PRIVATE)));
    }
    instantiate(parent) {
        return new ElementInjector(this, parent);
    }
    directParent() { return this.distanceToParent < 2 ? this.parent : null; }
    get hasBindings() { return this.eventEmitterAccessors.length > 0; }
    getBindingAtIndex(index) { return this.protoInjector.getBindingAtIndex(index); }
}
export class ElementInjector extends TreeNode {
    constructor(_proto, parent) {
        super(parent);
        this._proto = _proto;
        this._preBuiltObjects = null;
        this._injector = new Injector(this._proto.protoInjector);
        this._injector.ei = this; // TODO savkin remove after mergin DI and EI
        // we couple ourselves to the injector strategy to avoid polymoprhic calls
        var injectorStrategy = this._injector.internalStrategy;
        this._strategy = injectorStrategy instanceof InjectorInlineStrategy ?
            new ElementInjectorInlineStrategy(injectorStrategy, this) :
            new ElementInjectorDynamicStrategy(injectorStrategy, this);
        this.hydrated = false;
        this._buildQueries();
        this._addParentQueries();
    }
    dehydrate() {
        this.hydrated = false;
        this._host = null;
        this._preBuiltObjects = null;
        this._strategy.callOnDestroy();
        this._injector.internalStrategy.dehydrate();
    }
    onAllChangesDone() {
        if (isPresent(this._query0) && this._query0.originator === this) {
            this._query0.list.fireCallbacks();
        }
        if (isPresent(this._query1) && this._query1.originator === this) {
            this._query1.list.fireCallbacks();
        }
        if (isPresent(this._query2) && this._query2.originator === this) {
            this._query2.list.fireCallbacks();
        }
    }
    hydrate(imperativelyCreatedInjector, host, preBuiltObjects) {
        this._host = host;
        this._preBuiltObjects = preBuiltObjects;
        this._hydrateInjector(imperativelyCreatedInjector, host);
        this._addDirectivesToQueries();
        this._addVarBindingsToQueries();
        this.hydrated = true;
    }
    _hydrateInjector(imperativelyCreatedInjector, host) {
        if (isPresent(this._parent)) {
            this._reattachInjector(this._injector, this._parent._injector, false);
        }
        else {
            // This injector is at the boundary.
            //
            // The injector tree we are assembling:
            //
            // host._injector (only if present)
            //   |
            //   |boundary
            //   |
            // imperativelyCreatedInjector (only if present)
            //   |
            //   |boundary
            //   |
            // this._injector
            //
            // host._injector (only if present)
            //   |
            //   |boundary
            //   |
            // imperativelyCreatedInjector (only if present)
            if (isPresent(imperativelyCreatedInjector) && isPresent(host)) {
                this._reattachInjector(imperativelyCreatedInjector, host._injector, true);
            }
            // host._injector OR imperativelyCreatedInjector OR null
            //   |
            //   |boundary
            //   |
            // this._injector
            var parent = this._getParentInjector(imperativelyCreatedInjector, host);
            this._reattachInjector(this._injector, parent, true);
        }
    }
    _getParentInjector(injector, host) {
        if (isPresent(injector)) {
            return injector;
        }
        else if (isPresent(host)) {
            return host._injector;
        }
        else {
            return null;
        }
    }
    _reattachInjector(injector, parentInjector, isBoundary) {
        injector.internalStrategy.attach(parentInjector, isBoundary);
        injector.internalStrategy.hydrate();
    }
    hasVariableBinding(name) {
        var vb = this._proto.directiveVariableBindings;
        return isPresent(vb) && vb.has(name);
    }
    getVariableBinding(name) {
        var index = this._proto.directiveVariableBindings.get(name);
        return isPresent(index) ? this.getDirectiveAtIndex(index) : this.getElementRef();
    }
    get(token) { return this._injector.get(token); }
    hasDirective(type) { return isPresent(this._injector.getOptional(type)); }
    getEventEmitterAccessors() {
        return this._proto.eventEmitterAccessors;
    }
    getHostActionAccessors() {
        return this._proto.hostActionAccessors;
    }
    getDirectiveVariableBindings() {
        return this._proto.directiveVariableBindings;
    }
    getComponent() { return this._strategy.getComponent(); }
    getElementRef() { return this._preBuiltObjects.view.elementRefs[this._proto.index]; }
    getViewContainerRef() {
        return new ViewContainerRef(this._preBuiltObjects.viewManager, this.getElementRef());
    }
    directParent() { return this._proto.distanceToParent < 2 ? this.parent : null; }
    isComponentKey(key) { return this._strategy.isComponentKey(key); }
    getDependency(dep) {
        var key = dep.key;
        if (!(dep instanceof DirectiveDependency))
            return undefinedValue;
        var dirDep = dep;
        var staticKeys = StaticKeys.instance();
        if (key.id === staticKeys.viewManagerId)
            return this._preBuiltObjects.viewManager;
        if (isPresent(dirDep.attributeName))
            return this._buildAttribute(dirDep);
        if (isPresent(dirDep.queryDecorator))
            return this._findQuery(dirDep.queryDecorator).list;
        if (dirDep.key.id === StaticKeys.instance().changeDetectorRefId) {
            var componentView = this._preBuiltObjects.view.componentChildViews[this._proto.index];
            return componentView.changeDetector.ref;
        }
        if (dirDep.key.id === StaticKeys.instance().elementRefId) {
            return this.getElementRef();
        }
        if (dirDep.key.id === StaticKeys.instance().viewContainerId) {
            return this.getViewContainerRef();
        }
        if (dirDep.key.id === StaticKeys.instance().protoViewId) {
            if (isBlank(this._preBuiltObjects.protoView)) {
                if (dirDep.optional) {
                    return null;
                }
                throw new NoBindingError(dirDep.key);
            }
            return new ProtoViewRef(this._preBuiltObjects.protoView);
        }
        return undefinedValue;
    }
    _buildAttribute(dep) {
        var attributes = this._proto.attributes;
        if (isPresent(attributes) && attributes.has(dep.attributeName)) {
            return attributes.get(dep.attributeName);
        }
        else {
            return null;
        }
    }
    _buildQueriesForDeps(deps) {
        for (var i = 0; i < deps.length; i++) {
            var dep = deps[i];
            if (isPresent(dep.queryDecorator)) {
                this._createQueryRef(dep.queryDecorator);
            }
        }
    }
    _addVarBindingsToQueries() {
        this._addVarBindingsToQuery(this._query0);
        this._addVarBindingsToQuery(this._query1);
        this._addVarBindingsToQuery(this._query2);
    }
    _addDirectivesToQueries() {
        this._addDirectivesToQuery(this._query0);
        this._addDirectivesToQuery(this._query1);
        this._addDirectivesToQuery(this._query2);
    }
    _addVarBindingsToQuery(queryRef) {
        if (isBlank(queryRef) || !queryRef.query.isVarBindingQuery)
            return;
        var vb = queryRef.query.varBindings;
        for (var i = 0; i < vb.length; ++i) {
            if (this.hasVariableBinding(vb[i])) {
                queryRef.list.add(this.getVariableBinding(vb[i]));
            }
        }
    }
    _addDirectivesToQuery(queryRef) {
        if (isBlank(queryRef) || queryRef.query.isVarBindingQuery)
            return;
        var matched = [];
        this.addDirectivesMatchingQuery(queryRef.query, matched);
        matched.forEach(s => queryRef.list.add(s));
    }
    _createQueryRef(query) {
        var queryList = new QueryList();
        if (isBlank(this._query0)) {
            this._query0 = new QueryRef(query, queryList, this);
        }
        else if (isBlank(this._query1)) {
            this._query1 = new QueryRef(query, queryList, this);
        }
        else if (isBlank(this._query2)) {
            this._query2 = new QueryRef(query, queryList, this);
        }
        else {
            throw new QueryError();
        }
    }
    addDirectivesMatchingQuery(query, list) {
        this._strategy.addDirectivesMatchingQuery(query, list);
    }
    _buildQueries() {
        if (isPresent(this._proto)) {
            this._strategy.buildQueries();
        }
    }
    _findQuery(query) {
        if (isPresent(this._query0) && this._query0.query === query) {
            return this._query0;
        }
        if (isPresent(this._query1) && this._query1.query === query) {
            return this._query1;
        }
        if (isPresent(this._query2) && this._query2.query === query) {
            return this._query2;
        }
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
    _hasQuery(query) {
        return this._query0 == query || this._query1 == query || this._query2 == query;
    }
    link(parent) {
        parent.addChild(this);
        this._addParentQueries();
    }
    linkAfter(parent, prevSibling) {
        parent.addChildAfter(this, prevSibling);
        this._addParentQueries();
    }
    _addParentQueries() {
        if (isBlank(this.parent))
            return;
        if (isPresent(this.parent._query0)) {
            this._addQueryToTree(this.parent._query0);
            if (this.hydrated)
                this.parent._query0.update();
        }
        if (isPresent(this.parent._query1)) {
            this._addQueryToTree(this.parent._query1);
            if (this.hydrated)
                this.parent._query1.update();
        }
        if (isPresent(this.parent._query2)) {
            this._addQueryToTree(this.parent._query2);
            if (this.hydrated)
                this.parent._query2.update();
        }
    }
    unlink() {
        var queriesToUpdate = [];
        if (isPresent(this.parent._query0)) {
            this._pruneQueryFromTree(this.parent._query0);
            queriesToUpdate.push(this.parent._query0);
        }
        if (isPresent(this.parent._query1)) {
            this._pruneQueryFromTree(this.parent._query1);
            queriesToUpdate.push(this.parent._query1);
        }
        if (isPresent(this.parent._query2)) {
            this._pruneQueryFromTree(this.parent._query2);
            queriesToUpdate.push(this.parent._query2);
        }
        this.remove();
        ListWrapper.forEach(queriesToUpdate, (q) => q.update());
    }
    _pruneQueryFromTree(query) {
        this._removeQueryRef(query);
        var child = this._head;
        while (isPresent(child)) {
            child._pruneQueryFromTree(query);
            child = child._next;
        }
    }
    _addQueryToTree(queryRef) {
        if (queryRef.query.descendants == false) {
            if (this == queryRef.originator) {
                this._addQueryToTreeSelfAndRecurse(queryRef);
            }
            else if (this.parent == queryRef.originator) {
                this._assignQueryRef(queryRef);
            }
        }
        else {
            this._addQueryToTreeSelfAndRecurse(queryRef);
        }
    }
    _addQueryToTreeSelfAndRecurse(queryRef) {
        this._assignQueryRef(queryRef);
        var child = this._head;
        while (isPresent(child)) {
            child._addQueryToTree(queryRef);
            child = child._next;
        }
    }
    _assignQueryRef(query) {
        if (isBlank(this._query0)) {
            this._query0 = query;
            return;
        }
        else if (isBlank(this._query1)) {
            this._query1 = query;
            return;
        }
        else if (isBlank(this._query2)) {
            this._query2 = query;
            return;
        }
        throw new QueryError();
    }
    _removeQueryRef(query) {
        if (this._query0 == query)
            this._query0 = null;
        if (this._query1 == query)
            this._query1 = null;
        if (this._query2 == query)
            this._query2 = null;
    }
    getDirectiveAtIndex(index) { return this._injector.getAt(index); }
    hasInstances() { return this._proto.hasBindings && this.hydrated; }
    getHost() { return this._host; }
    getBoundElementIndex() { return this._proto.index; }
}
/**
 * Strategy used by the `ElementInjector` when the number of bindings is 10 or less.
 * In such a case, inlining fields is benefitial for performances.
 */
class ElementInjectorInlineStrategy {
    constructor(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    callOnDestroy() {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        if (p.binding0 instanceof DirectiveBinding && p.binding0.callOnDestroy) {
            i.obj0.onDestroy();
        }
        if (p.binding1 instanceof DirectiveBinding && p.binding1.callOnDestroy) {
            i.obj1.onDestroy();
        }
        if (p.binding2 instanceof DirectiveBinding && p.binding2.callOnDestroy) {
            i.obj2.onDestroy();
        }
        if (p.binding3 instanceof DirectiveBinding && p.binding3.callOnDestroy) {
            i.obj3.onDestroy();
        }
        if (p.binding4 instanceof DirectiveBinding && p.binding4.callOnDestroy) {
            i.obj4.onDestroy();
        }
        if (p.binding5 instanceof DirectiveBinding && p.binding5.callOnDestroy) {
            i.obj5.onDestroy();
        }
        if (p.binding6 instanceof DirectiveBinding && p.binding6.callOnDestroy) {
            i.obj6.onDestroy();
        }
        if (p.binding7 instanceof DirectiveBinding && p.binding7.callOnDestroy) {
            i.obj7.onDestroy();
        }
        if (p.binding8 instanceof DirectiveBinding && p.binding8.callOnDestroy) {
            i.obj8.onDestroy();
        }
        if (p.binding9 instanceof DirectiveBinding && p.binding9.callOnDestroy) {
            i.obj9.onDestroy();
        }
    }
    getComponent() { return this.injectorStrategy.obj0; }
    isComponentKey(key) {
        return this._ei._proto._firstBindingIsComponent && isPresent(key) &&
            key.id === this.injectorStrategy.protoStrategy.keyId0;
    }
    buildQueries() {
        var p = this.injectorStrategy.protoStrategy;
        if (p.binding0 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding0.dependencies);
        }
        if (p.binding1 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding1.dependencies);
        }
        if (p.binding2 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding2.dependencies);
        }
        if (p.binding3 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding3.dependencies);
        }
        if (p.binding4 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding4.dependencies);
        }
        if (p.binding5 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding5.dependencies);
        }
        if (p.binding6 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding6.dependencies);
        }
        if (p.binding7 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding7.dependencies);
        }
        if (p.binding8 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding8.dependencies);
        }
        if (p.binding9 instanceof DirectiveBinding) {
            this._ei._buildQueriesForDeps(p.binding9.dependencies);
        }
    }
    addDirectivesMatchingQuery(query, list) {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        if (isPresent(p.binding0) && p.binding0.key.token === query.selector)
            list.push(i.obj0);
        if (isPresent(p.binding1) && p.binding1.key.token === query.selector)
            list.push(i.obj1);
        if (isPresent(p.binding2) && p.binding2.key.token === query.selector)
            list.push(i.obj2);
        if (isPresent(p.binding3) && p.binding3.key.token === query.selector)
            list.push(i.obj3);
        if (isPresent(p.binding4) && p.binding4.key.token === query.selector)
            list.push(i.obj4);
        if (isPresent(p.binding5) && p.binding5.key.token === query.selector)
            list.push(i.obj5);
        if (isPresent(p.binding6) && p.binding6.key.token === query.selector)
            list.push(i.obj6);
        if (isPresent(p.binding7) && p.binding7.key.token === query.selector)
            list.push(i.obj7);
        if (isPresent(p.binding8) && p.binding8.key.token === query.selector)
            list.push(i.obj8);
        if (isPresent(p.binding9) && p.binding9.key.token === query.selector)
            list.push(i.obj9);
    }
    getComponentBinding() {
        var p = this.injectorStrategy.protoStrategy;
        return p.binding0;
    }
}
/**
 * Strategy used by the `ElementInjector` when the number of bindings is 10 or less.
 * In such a case, inlining fields is benefitial for performances.
 */
class ElementInjectorDynamicStrategy {
    constructor(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    callOnDestroy() {
        var ist = this.injectorStrategy;
        var p = ist.protoStrategy;
        for (var i = 0; i < p.bindings.length; i++) {
            if (p.bindings[i] instanceof DirectiveBinding &&
                p.bindings[i].callOnDestroy) {
                ist.objs[i].onDestroy();
            }
        }
    }
    getComponent() { return this.injectorStrategy.objs[0]; }
    isComponentKey(key) {
        var p = this.injectorStrategy.protoStrategy;
        return this._ei._proto._firstBindingIsComponent && isPresent(key) && key.id === p.keyIds[0];
    }
    buildQueries() {
        var p = this.injectorStrategy.protoStrategy;
        for (var i = 0; i < p.bindings.length; i++) {
            if (p.bindings[i] instanceof DirectiveBinding) {
                this._ei._buildQueriesForDeps(p.bindings[i].dependencies);
            }
        }
    }
    addDirectivesMatchingQuery(query, list) {
        var ist = this.injectorStrategy;
        var p = ist.protoStrategy;
        for (var i = 0; i < p.bindings.length; i++) {
            if (p.bindings[i].key.token === query.selector)
                list.push(ist.objs[i]);
        }
    }
    getComponentBinding() {
        var p = this.injectorStrategy.protoStrategy;
        return p.bindings[0];
    }
}
export class QueryError extends BaseException {
    // TODO(rado): pass the names of the active directives.
    constructor() {
        super();
        this.message = 'Only 3 queries can be concurrently active in a template.';
    }
    toString() { return this.message; }
}
export class QueryRef {
    constructor(query, list, originator) {
        this.query = query;
        this.list = list;
        this.originator = originator;
    }
    update() {
        var aggregator = [];
        this.visit(this.originator, aggregator);
        this.list.reset(aggregator);
    }
    visit(inj, aggregator) {
        if (isBlank(inj) || !inj._hasQuery(this))
            return;
        if (this.query.isVarBindingQuery) {
            this._aggregateVariableBindings(inj, aggregator);
        }
        else {
            this._aggregateDirective(inj, aggregator);
        }
        var child = inj._head;
        while (isPresent(child)) {
            this.visit(child, aggregator);
            child = child._next;
        }
    }
    _aggregateVariableBindings(inj, aggregator) {
        var vb = this.query.varBindings;
        for (var i = 0; i < vb.length; ++i) {
            if (inj.hasVariableBinding(vb[i])) {
                aggregator.push(inj.getVariableBinding(vb[i]));
            }
        }
    }
    _aggregateDirective(inj, aggregator) {
        inj.addDirectivesMatchingQuery(this.query, aggregator);
    }
}
//# sourceMappingURL=element_injector.js.map