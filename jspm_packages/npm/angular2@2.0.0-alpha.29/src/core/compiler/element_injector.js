/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var lang_1 = require("../../facade/lang");
var async_1 = require("../../facade/async");
var collection_1 = require("../../facade/collection");
var di_1 = require("../../../di");
var injector_1 = require("../../di/injector");
var di_2 = require("../annotations_impl/di");
var avmModule = require("./view_manager");
var view_container_ref_1 = require("./view_container_ref");
var element_ref_1 = require("./element_ref");
var view_ref_1 = require("./view_ref");
var annotations_1 = require("../annotations_impl/annotations");
var directive_lifecycle_reflector_1 = require("./directive_lifecycle_reflector");
var change_detection_1 = require("../../../change_detection");
var query_list_1 = require("./query_list");
var reflection_1 = require("../../reflection/reflection");
var api_1 = require("../../render/api");
var _staticKeys;
var StaticKeys = (function() {
  function StaticKeys() {
    this.viewManagerId = di_1.Key.get(avmModule.AppViewManager).id;
    this.protoViewId = di_1.Key.get(view_ref_1.ProtoViewRef).id;
    this.viewContainerId = di_1.Key.get(view_container_ref_1.ViewContainerRef).id;
    this.changeDetectorRefId = di_1.Key.get(change_detection_1.ChangeDetectorRef).id;
    this.elementRefId = di_1.Key.get(element_ref_1.ElementRef).id;
  }
  StaticKeys.instance = function() {
    if (lang_1.isBlank(_staticKeys))
      _staticKeys = new StaticKeys();
    return _staticKeys;
  };
  return StaticKeys;
})();
var TreeNode = (function() {
  function TreeNode(parent) {
    this._head = null;
    this._tail = null;
    this._next = null;
    if (lang_1.isPresent(parent))
      parent.addChild(this);
  }
  TreeNode.prototype.addChild = function(child) {
    if (lang_1.isPresent(this._tail)) {
      this._tail._next = child;
      this._tail = child;
    } else {
      this._tail = this._head = child;
    }
    child._next = null;
    child._parent = this;
  };
  TreeNode.prototype.addChildAfter = function(child, prevSibling) {
    if (lang_1.isBlank(prevSibling)) {
      var prevHead = this._head;
      this._head = child;
      child._next = prevHead;
      if (lang_1.isBlank(this._tail))
        this._tail = child;
    } else if (lang_1.isBlank(prevSibling._next)) {
      this.addChild(child);
      return ;
    } else {
      child._next = prevSibling._next;
      prevSibling._next = child;
    }
    child._parent = this;
  };
  TreeNode.prototype.remove = function() {
    if (lang_1.isBlank(this.parent))
      return ;
    var nextSibling = this._next;
    var prevSibling = this._findPrev();
    if (lang_1.isBlank(prevSibling)) {
      this.parent._head = this._next;
    } else {
      prevSibling._next = this._next;
    }
    if (lang_1.isBlank(nextSibling)) {
      this._parent._tail = prevSibling;
    }
    this._parent = null;
    this._next = null;
  };
  TreeNode.prototype._findPrev = function() {
    var node = this.parent._head;
    if (node == this)
      return null;
    while (node._next !== this)
      node = node._next;
    return node;
  };
  Object.defineProperty(TreeNode.prototype, "parent", {
    get: function() {
      return this._parent;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TreeNode.prototype, "children", {
    get: function() {
      var res = [];
      var child = this._head;
      while (child != null) {
        res.push(child);
        child = child._next;
      }
      return res;
    },
    enumerable: true,
    configurable: true
  });
  return TreeNode;
})();
exports.TreeNode = TreeNode;
var DirectiveDependency = (function(_super) {
  __extends(DirectiveDependency, _super);
  function DirectiveDependency(key, optional, visibility, properties, attributeName, queryDecorator) {
    _super.call(this, key, optional, visibility, properties);
    this.attributeName = attributeName;
    this.queryDecorator = queryDecorator;
    this._verify();
  }
  DirectiveDependency.prototype._verify = function() {
    var count = 0;
    if (lang_1.isPresent(this.queryDecorator))
      count++;
    if (lang_1.isPresent(this.attributeName))
      count++;
    if (count > 1)
      throw new lang_1.BaseException('A directive injectable can contain only one of the following @Attribute or @Query.');
  };
  DirectiveDependency.createFrom = function(d) {
    return new DirectiveDependency(d.key, d.optional, d.visibility, d.properties, DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
  };
  DirectiveDependency._attributeName = function(properties) {
    var p = collection_1.ListWrapper.find(properties, function(p) {
      return p instanceof di_2.Attribute;
    });
    return lang_1.isPresent(p) ? p.attributeName : null;
  };
  DirectiveDependency._query = function(properties) {
    return collection_1.ListWrapper.find(properties, function(p) {
      return p instanceof di_2.Query;
    });
  };
  return DirectiveDependency;
})(di_1.Dependency);
exports.DirectiveDependency = DirectiveDependency;
var DirectiveBinding = (function(_super) {
  __extends(DirectiveBinding, _super);
  function DirectiveBinding(key, factory, dependencies, resolvedHostInjectables, resolvedViewInjectables, metadata) {
    _super.call(this, key, factory, dependencies);
    this.resolvedHostInjectables = resolvedHostInjectables;
    this.resolvedViewInjectables = resolvedViewInjectables;
    this.metadata = metadata;
  }
  Object.defineProperty(DirectiveBinding.prototype, "callOnDestroy", {
    get: function() {
      return this.metadata.callOnDestroy;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveBinding.prototype, "callOnChange", {
    get: function() {
      return this.metadata.callOnChange;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveBinding.prototype, "callOnAllChangesDone", {
    get: function() {
      return this.metadata.callOnAllChangesDone;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveBinding.prototype, "displayName", {
    get: function() {
      return this.key.displayName;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveBinding.prototype, "eventEmitters", {
    get: function() {
      return lang_1.isPresent(this.metadata) && lang_1.isPresent(this.metadata.events) ? this.metadata.events : [];
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveBinding.prototype, "hostActions", {
    get: function() {
      return lang_1.isPresent(this.metadata) && lang_1.isPresent(this.metadata.hostActions) ? this.metadata.hostActions : new Map();
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveBinding.prototype, "changeDetection", {
    get: function() {
      return this.metadata.changeDetection;
    },
    enumerable: true,
    configurable: true
  });
  DirectiveBinding.createFromBinding = function(binding, ann) {
    if (lang_1.isBlank(ann)) {
      ann = new annotations_1.Directive();
    }
    var rb = binding.resolve();
    var deps = collection_1.ListWrapper.map(rb.dependencies, DirectiveDependency.createFrom);
    var resolvedHostInjectables = lang_1.isPresent(ann.hostInjector) ? di_1.resolveBindings(ann.hostInjector) : [];
    var resolvedViewInjectables = ann instanceof annotations_1.Component && lang_1.isPresent(ann.viewInjector) ? di_1.resolveBindings(ann.viewInjector) : [];
    var metadata = api_1.DirectiveMetadata.create({
      id: lang_1.stringify(rb.key.token),
      type: ann instanceof annotations_1.Component ? api_1.DirectiveMetadata.COMPONENT_TYPE : api_1.DirectiveMetadata.DIRECTIVE_TYPE,
      selector: ann.selector,
      compileChildren: ann.compileChildren,
      events: ann.events,
      host: lang_1.isPresent(ann.host) ? collection_1.MapWrapper.createFromStringMap(ann.host) : null,
      properties: ann.properties,
      readAttributes: DirectiveBinding._readAttributes(deps),
      callOnDestroy: directive_lifecycle_reflector_1.hasLifecycleHook(annotations_1.onDestroy, rb.key.token, ann),
      callOnChange: directive_lifecycle_reflector_1.hasLifecycleHook(annotations_1.onChange, rb.key.token, ann),
      callOnCheck: directive_lifecycle_reflector_1.hasLifecycleHook(annotations_1.onCheck, rb.key.token, ann),
      callOnInit: directive_lifecycle_reflector_1.hasLifecycleHook(annotations_1.onInit, rb.key.token, ann),
      callOnAllChangesDone: directive_lifecycle_reflector_1.hasLifecycleHook(annotations_1.onAllChangesDone, rb.key.token, ann),
      changeDetection: ann instanceof annotations_1.Component ? ann.changeDetection : null,
      exportAs: ann.exportAs
    });
    return new DirectiveBinding(rb.key, rb.factory, deps, resolvedHostInjectables, resolvedViewInjectables, metadata);
  };
  DirectiveBinding._readAttributes = function(deps) {
    var readAttributes = [];
    collection_1.ListWrapper.forEach(deps, function(dep) {
      if (lang_1.isPresent(dep.attributeName)) {
        readAttributes.push(dep.attributeName);
      }
    });
    return readAttributes;
  };
  DirectiveBinding.createFromType = function(type, annotation) {
    var binding = new di_1.Binding(type, {toClass: type});
    return DirectiveBinding.createFromBinding(binding, annotation);
  };
  return DirectiveBinding;
})(di_1.ResolvedBinding);
exports.DirectiveBinding = DirectiveBinding;
var PreBuiltObjects = (function() {
  function PreBuiltObjects(viewManager, view, protoView) {
    this.viewManager = viewManager;
    this.view = view;
    this.protoView = protoView;
  }
  return PreBuiltObjects;
})();
exports.PreBuiltObjects = PreBuiltObjects;
var EventEmitterAccessor = (function() {
  function EventEmitterAccessor(eventName, getter) {
    this.eventName = eventName;
    this.getter = getter;
  }
  EventEmitterAccessor.prototype.subscribe = function(view, boundElementIndex, directive) {
    var _this = this;
    var eventEmitter = this.getter(directive);
    return async_1.ObservableWrapper.subscribe(eventEmitter, function(eventObj) {
      return view.triggerEventHandlers(_this.eventName, eventObj, boundElementIndex);
    });
  };
  return EventEmitterAccessor;
})();
exports.EventEmitterAccessor = EventEmitterAccessor;
var HostActionAccessor = (function() {
  function HostActionAccessor(methodName, getter) {
    this.methodName = methodName;
    this.getter = getter;
  }
  HostActionAccessor.prototype.subscribe = function(view, boundElementIndex, directive) {
    var _this = this;
    var eventEmitter = this.getter(directive);
    return async_1.ObservableWrapper.subscribe(eventEmitter, function(actionArgs) {
      return view.invokeElementMethod(boundElementIndex, _this.methodName, actionArgs);
    });
  };
  return HostActionAccessor;
})();
exports.HostActionAccessor = HostActionAccessor;
function _createEventEmitterAccessors(bwv) {
  var binding = bwv.binding;
  if (!(binding instanceof DirectiveBinding))
    return [];
  var db = binding;
  return collection_1.ListWrapper.map(db.eventEmitters, function(eventConfig) {
    var fieldName;
    var eventName;
    var colonIdx = eventConfig.indexOf(':');
    if (colonIdx > -1) {
      fieldName = lang_1.StringWrapper.substring(eventConfig, 0, colonIdx).trim();
      eventName = lang_1.StringWrapper.substring(eventConfig, colonIdx + 1).trim();
    } else {
      fieldName = eventName = eventConfig;
    }
    return new EventEmitterAccessor(eventName, reflection_1.reflector.getter(fieldName));
  });
}
function _createHostActionAccessors(bwv) {
  var binding = bwv.binding;
  if (!(binding instanceof DirectiveBinding))
    return [];
  var res = [];
  var db = binding;
  collection_1.MapWrapper.forEach(db.hostActions, function(actionExpression, actionName) {
    res.push(new HostActionAccessor(actionExpression, reflection_1.reflector.getter(actionName)));
  });
  return res;
}
var ProtoElementInjector = (function() {
  function ProtoElementInjector(parent, index, bwv, distanceToParent, _firstBindingIsComponent, directiveVariableBindings) {
    this.parent = parent;
    this.index = index;
    this.distanceToParent = distanceToParent;
    this._firstBindingIsComponent = _firstBindingIsComponent;
    this.directiveVariableBindings = directiveVariableBindings;
    var length = bwv.length;
    this.protoInjector = new di_1.ProtoInjector(bwv, distanceToParent);
    this.eventEmitterAccessors = collection_1.ListWrapper.createFixedSize(length);
    this.hostActionAccessors = collection_1.ListWrapper.createFixedSize(length);
    for (var i = 0; i < length; ++i) {
      this.eventEmitterAccessors[i] = _createEventEmitterAccessors(bwv[i]);
      this.hostActionAccessors[i] = _createHostActionAccessors(bwv[i]);
    }
  }
  ProtoElementInjector.create = function(parent, index, bindings, firstBindingIsComponent, distanceToParent, directiveVariableBindings) {
    var bd = [];
    ProtoElementInjector._createDirectiveBindingWithVisibility(bindings, bd, firstBindingIsComponent);
    if (firstBindingIsComponent) {
      ProtoElementInjector._createViewInjectorBindingWithVisibility(bindings, bd);
    }
    ProtoElementInjector._createHostInjectorBindingWithVisibility(bindings, bd, firstBindingIsComponent);
    return new ProtoElementInjector(parent, index, bd, distanceToParent, firstBindingIsComponent, directiveVariableBindings);
  };
  ProtoElementInjector._createDirectiveBindingWithVisibility = function(dirBindings, bd, firstBindingIsComponent) {
    collection_1.ListWrapper.forEach(dirBindings, function(dirBinding) {
      bd.push(ProtoElementInjector._createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, dirBinding));
    });
  };
  ProtoElementInjector._createHostInjectorBindingWithVisibility = function(dirBindings, bd, firstBindingIsComponent) {
    collection_1.ListWrapper.forEach(dirBindings, function(dirBinding) {
      collection_1.ListWrapper.forEach(dirBinding.resolvedHostInjectables, function(b) {
        bd.push(ProtoElementInjector._createBindingWithVisibility(firstBindingIsComponent, dirBinding, dirBindings, b));
      });
    });
  };
  ProtoElementInjector._createBindingWithVisibility = function(firstBindingIsComponent, dirBinding, dirBindings, binding) {
    var isComponent = firstBindingIsComponent && dirBindings[0] === dirBinding;
    return new injector_1.BindingWithVisibility(binding, isComponent ? di_1.PUBLIC_AND_PRIVATE : di_1.PUBLIC);
  };
  ProtoElementInjector._createViewInjectorBindingWithVisibility = function(bindings, bd) {
    var db = bindings[0];
    collection_1.ListWrapper.forEach(db.resolvedViewInjectables, function(b) {
      return bd.push(new injector_1.BindingWithVisibility(b, di_1.PRIVATE));
    });
  };
  ProtoElementInjector.prototype.instantiate = function(parent) {
    return new ElementInjector(this, parent);
  };
  ProtoElementInjector.prototype.directParent = function() {
    return this.distanceToParent < 2 ? this.parent : null;
  };
  Object.defineProperty(ProtoElementInjector.prototype, "hasBindings", {
    get: function() {
      return this.eventEmitterAccessors.length > 0;
    },
    enumerable: true,
    configurable: true
  });
  ProtoElementInjector.prototype.getBindingAtIndex = function(index) {
    return this.protoInjector.getBindingAtIndex(index);
  };
  return ProtoElementInjector;
})();
exports.ProtoElementInjector = ProtoElementInjector;
var ElementInjector = (function(_super) {
  __extends(ElementInjector, _super);
  function ElementInjector(_proto, parent) {
    _super.call(this, parent);
    this._proto = _proto;
    this._preBuiltObjects = null;
    this._injector = new di_1.Injector(this._proto.protoInjector);
    this._injector.ei = this;
    var injectorStrategy = this._injector.internalStrategy;
    this._strategy = injectorStrategy instanceof injector_1.InjectorInlineStrategy ? new ElementInjectorInlineStrategy(injectorStrategy, this) : new ElementInjectorDynamicStrategy(injectorStrategy, this);
    this.hydrated = false;
    this._buildQueries();
    this._addParentQueries();
  }
  ElementInjector.prototype.dehydrate = function() {
    this.hydrated = false;
    this._host = null;
    this._preBuiltObjects = null;
    this._strategy.callOnDestroy();
    this._injector.internalStrategy.dehydrate();
  };
  ElementInjector.prototype.onAllChangesDone = function() {
    if (lang_1.isPresent(this._query0) && this._query0.originator === this) {
      this._query0.list.fireCallbacks();
    }
    if (lang_1.isPresent(this._query1) && this._query1.originator === this) {
      this._query1.list.fireCallbacks();
    }
    if (lang_1.isPresent(this._query2) && this._query2.originator === this) {
      this._query2.list.fireCallbacks();
    }
  };
  ElementInjector.prototype.hydrate = function(imperativelyCreatedInjector, host, preBuiltObjects) {
    this._host = host;
    this._preBuiltObjects = preBuiltObjects;
    this._hydrateInjector(imperativelyCreatedInjector, host);
    this._addDirectivesToQueries();
    this._addVarBindingsToQueries();
    this.hydrated = true;
  };
  ElementInjector.prototype._hydrateInjector = function(imperativelyCreatedInjector, host) {
    if (lang_1.isPresent(this._parent)) {
      this._reattachInjector(this._injector, this._parent._injector, false);
    } else {
      if (lang_1.isPresent(imperativelyCreatedInjector) && lang_1.isPresent(host)) {
        this._reattachInjector(imperativelyCreatedInjector, host._injector, true);
      }
      var parent = this._getParentInjector(imperativelyCreatedInjector, host);
      this._reattachInjector(this._injector, parent, true);
    }
  };
  ElementInjector.prototype._getParentInjector = function(injector, host) {
    if (lang_1.isPresent(injector)) {
      return injector;
    } else if (lang_1.isPresent(host)) {
      return host._injector;
    } else {
      return null;
    }
  };
  ElementInjector.prototype._reattachInjector = function(injector, parentInjector, isBoundary) {
    injector.internalStrategy.attach(parentInjector, isBoundary);
    injector.internalStrategy.hydrate();
  };
  ElementInjector.prototype.hasVariableBinding = function(name) {
    var vb = this._proto.directiveVariableBindings;
    return lang_1.isPresent(vb) && vb.has(name);
  };
  ElementInjector.prototype.getVariableBinding = function(name) {
    var index = this._proto.directiveVariableBindings.get(name);
    return lang_1.isPresent(index) ? this.getDirectiveAtIndex(index) : this.getElementRef();
  };
  ElementInjector.prototype.get = function(token) {
    return this._injector.get(token);
  };
  ElementInjector.prototype.hasDirective = function(type) {
    return lang_1.isPresent(this._injector.getOptional(type));
  };
  ElementInjector.prototype.getEventEmitterAccessors = function() {
    return this._proto.eventEmitterAccessors;
  };
  ElementInjector.prototype.getHostActionAccessors = function() {
    return this._proto.hostActionAccessors;
  };
  ElementInjector.prototype.getDirectiveVariableBindings = function() {
    return this._proto.directiveVariableBindings;
  };
  ElementInjector.prototype.getComponent = function() {
    return this._strategy.getComponent();
  };
  ElementInjector.prototype.getElementRef = function() {
    return this._preBuiltObjects.view.elementRefs[this._proto.index];
  };
  ElementInjector.prototype.getViewContainerRef = function() {
    return new view_container_ref_1.ViewContainerRef(this._preBuiltObjects.viewManager, this.getElementRef());
  };
  ElementInjector.prototype.directParent = function() {
    return this._proto.distanceToParent < 2 ? this.parent : null;
  };
  ElementInjector.prototype.isComponentKey = function(key) {
    return this._strategy.isComponentKey(key);
  };
  ElementInjector.prototype.getDependency = function(dep) {
    var key = dep.key;
    if (!(dep instanceof DirectiveDependency))
      return di_1.undefinedValue;
    var dirDep = dep;
    var staticKeys = StaticKeys.instance();
    if (key.id === staticKeys.viewManagerId)
      return this._preBuiltObjects.viewManager;
    if (lang_1.isPresent(dirDep.attributeName))
      return this._buildAttribute(dirDep);
    if (lang_1.isPresent(dirDep.queryDecorator))
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
      if (lang_1.isBlank(this._preBuiltObjects.protoView)) {
        if (dirDep.optional) {
          return null;
        }
        throw new di_1.NoBindingError(dirDep.key);
      }
      return new view_ref_1.ProtoViewRef(this._preBuiltObjects.protoView);
    }
    return di_1.undefinedValue;
  };
  ElementInjector.prototype._buildAttribute = function(dep) {
    var attributes = this._proto.attributes;
    if (lang_1.isPresent(attributes) && attributes.has(dep.attributeName)) {
      return attributes.get(dep.attributeName);
    } else {
      return null;
    }
  };
  ElementInjector.prototype._buildQueriesForDeps = function(deps) {
    for (var i = 0; i < deps.length; i++) {
      var dep = deps[i];
      if (lang_1.isPresent(dep.queryDecorator)) {
        this._createQueryRef(dep.queryDecorator);
      }
    }
  };
  ElementInjector.prototype._addVarBindingsToQueries = function() {
    this._addVarBindingsToQuery(this._query0);
    this._addVarBindingsToQuery(this._query1);
    this._addVarBindingsToQuery(this._query2);
  };
  ElementInjector.prototype._addDirectivesToQueries = function() {
    this._addDirectivesToQuery(this._query0);
    this._addDirectivesToQuery(this._query1);
    this._addDirectivesToQuery(this._query2);
  };
  ElementInjector.prototype._addVarBindingsToQuery = function(queryRef) {
    if (lang_1.isBlank(queryRef) || !queryRef.query.isVarBindingQuery)
      return ;
    var vb = queryRef.query.varBindings;
    for (var i = 0; i < vb.length; ++i) {
      if (this.hasVariableBinding(vb[i])) {
        queryRef.list.add(this.getVariableBinding(vb[i]));
      }
    }
  };
  ElementInjector.prototype._addDirectivesToQuery = function(queryRef) {
    if (lang_1.isBlank(queryRef) || queryRef.query.isVarBindingQuery)
      return ;
    var matched = [];
    this.addDirectivesMatchingQuery(queryRef.query, matched);
    matched.forEach(function(s) {
      return queryRef.list.add(s);
    });
  };
  ElementInjector.prototype._createQueryRef = function(query) {
    var queryList = new query_list_1.QueryList();
    if (lang_1.isBlank(this._query0)) {
      this._query0 = new QueryRef(query, queryList, this);
    } else if (lang_1.isBlank(this._query1)) {
      this._query1 = new QueryRef(query, queryList, this);
    } else if (lang_1.isBlank(this._query2)) {
      this._query2 = new QueryRef(query, queryList, this);
    } else {
      throw new QueryError();
    }
  };
  ElementInjector.prototype.addDirectivesMatchingQuery = function(query, list) {
    this._strategy.addDirectivesMatchingQuery(query, list);
  };
  ElementInjector.prototype._buildQueries = function() {
    if (lang_1.isPresent(this._proto)) {
      this._strategy.buildQueries();
    }
  };
  ElementInjector.prototype._findQuery = function(query) {
    if (lang_1.isPresent(this._query0) && this._query0.query === query) {
      return this._query0;
    }
    if (lang_1.isPresent(this._query1) && this._query1.query === query) {
      return this._query1;
    }
    if (lang_1.isPresent(this._query2) && this._query2.query === query) {
      return this._query2;
    }
    throw new lang_1.BaseException("Cannot find query for directive " + query + ".");
  };
  ElementInjector.prototype._hasQuery = function(query) {
    return this._query0 == query || this._query1 == query || this._query2 == query;
  };
  ElementInjector.prototype.link = function(parent) {
    parent.addChild(this);
    this._addParentQueries();
  };
  ElementInjector.prototype.linkAfter = function(parent, prevSibling) {
    parent.addChildAfter(this, prevSibling);
    this._addParentQueries();
  };
  ElementInjector.prototype._addParentQueries = function() {
    if (lang_1.isBlank(this.parent))
      return ;
    if (lang_1.isPresent(this.parent._query0)) {
      this._addQueryToTree(this.parent._query0);
      if (this.hydrated)
        this.parent._query0.update();
    }
    if (lang_1.isPresent(this.parent._query1)) {
      this._addQueryToTree(this.parent._query1);
      if (this.hydrated)
        this.parent._query1.update();
    }
    if (lang_1.isPresent(this.parent._query2)) {
      this._addQueryToTree(this.parent._query2);
      if (this.hydrated)
        this.parent._query2.update();
    }
  };
  ElementInjector.prototype.unlink = function() {
    var queriesToUpdate = [];
    if (lang_1.isPresent(this.parent._query0)) {
      this._pruneQueryFromTree(this.parent._query0);
      queriesToUpdate.push(this.parent._query0);
    }
    if (lang_1.isPresent(this.parent._query1)) {
      this._pruneQueryFromTree(this.parent._query1);
      queriesToUpdate.push(this.parent._query1);
    }
    if (lang_1.isPresent(this.parent._query2)) {
      this._pruneQueryFromTree(this.parent._query2);
      queriesToUpdate.push(this.parent._query2);
    }
    this.remove();
    collection_1.ListWrapper.forEach(queriesToUpdate, function(q) {
      return q.update();
    });
  };
  ElementInjector.prototype._pruneQueryFromTree = function(query) {
    this._removeQueryRef(query);
    var child = this._head;
    while (lang_1.isPresent(child)) {
      child._pruneQueryFromTree(query);
      child = child._next;
    }
  };
  ElementInjector.prototype._addQueryToTree = function(queryRef) {
    if (queryRef.query.descendants == false) {
      if (this == queryRef.originator) {
        this._addQueryToTreeSelfAndRecurse(queryRef);
      } else if (this.parent == queryRef.originator) {
        this._assignQueryRef(queryRef);
      }
    } else {
      this._addQueryToTreeSelfAndRecurse(queryRef);
    }
  };
  ElementInjector.prototype._addQueryToTreeSelfAndRecurse = function(queryRef) {
    this._assignQueryRef(queryRef);
    var child = this._head;
    while (lang_1.isPresent(child)) {
      child._addQueryToTree(queryRef);
      child = child._next;
    }
  };
  ElementInjector.prototype._assignQueryRef = function(query) {
    if (lang_1.isBlank(this._query0)) {
      this._query0 = query;
      return ;
    } else if (lang_1.isBlank(this._query1)) {
      this._query1 = query;
      return ;
    } else if (lang_1.isBlank(this._query2)) {
      this._query2 = query;
      return ;
    }
    throw new QueryError();
  };
  ElementInjector.prototype._removeQueryRef = function(query) {
    if (this._query0 == query)
      this._query0 = null;
    if (this._query1 == query)
      this._query1 = null;
    if (this._query2 == query)
      this._query2 = null;
  };
  ElementInjector.prototype.getDirectiveAtIndex = function(index) {
    return this._injector.getAt(index);
  };
  ElementInjector.prototype.hasInstances = function() {
    return this._proto.hasBindings && this.hydrated;
  };
  ElementInjector.prototype.getHost = function() {
    return this._host;
  };
  ElementInjector.prototype.getBoundElementIndex = function() {
    return this._proto.index;
  };
  return ElementInjector;
})(TreeNode);
exports.ElementInjector = ElementInjector;
var ElementInjectorInlineStrategy = (function() {
  function ElementInjectorInlineStrategy(injectorStrategy, _ei) {
    this.injectorStrategy = injectorStrategy;
    this._ei = _ei;
  }
  ElementInjectorInlineStrategy.prototype.callOnDestroy = function() {
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
  };
  ElementInjectorInlineStrategy.prototype.getComponent = function() {
    return this.injectorStrategy.obj0;
  };
  ElementInjectorInlineStrategy.prototype.isComponentKey = function(key) {
    return this._ei._proto._firstBindingIsComponent && lang_1.isPresent(key) && key.id === this.injectorStrategy.protoStrategy.keyId0;
  };
  ElementInjectorInlineStrategy.prototype.buildQueries = function() {
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
  };
  ElementInjectorInlineStrategy.prototype.addDirectivesMatchingQuery = function(query, list) {
    var i = this.injectorStrategy;
    var p = i.protoStrategy;
    if (lang_1.isPresent(p.binding0) && p.binding0.key.token === query.selector)
      list.push(i.obj0);
    if (lang_1.isPresent(p.binding1) && p.binding1.key.token === query.selector)
      list.push(i.obj1);
    if (lang_1.isPresent(p.binding2) && p.binding2.key.token === query.selector)
      list.push(i.obj2);
    if (lang_1.isPresent(p.binding3) && p.binding3.key.token === query.selector)
      list.push(i.obj3);
    if (lang_1.isPresent(p.binding4) && p.binding4.key.token === query.selector)
      list.push(i.obj4);
    if (lang_1.isPresent(p.binding5) && p.binding5.key.token === query.selector)
      list.push(i.obj5);
    if (lang_1.isPresent(p.binding6) && p.binding6.key.token === query.selector)
      list.push(i.obj6);
    if (lang_1.isPresent(p.binding7) && p.binding7.key.token === query.selector)
      list.push(i.obj7);
    if (lang_1.isPresent(p.binding8) && p.binding8.key.token === query.selector)
      list.push(i.obj8);
    if (lang_1.isPresent(p.binding9) && p.binding9.key.token === query.selector)
      list.push(i.obj9);
  };
  ElementInjectorInlineStrategy.prototype.getComponentBinding = function() {
    var p = this.injectorStrategy.protoStrategy;
    return p.binding0;
  };
  return ElementInjectorInlineStrategy;
})();
var ElementInjectorDynamicStrategy = (function() {
  function ElementInjectorDynamicStrategy(injectorStrategy, _ei) {
    this.injectorStrategy = injectorStrategy;
    this._ei = _ei;
  }
  ElementInjectorDynamicStrategy.prototype.callOnDestroy = function() {
    var ist = this.injectorStrategy;
    var p = ist.protoStrategy;
    for (var i = 0; i < p.bindings.length; i++) {
      if (p.bindings[i] instanceof DirectiveBinding && p.bindings[i].callOnDestroy) {
        ist.objs[i].onDestroy();
      }
    }
  };
  ElementInjectorDynamicStrategy.prototype.getComponent = function() {
    return this.injectorStrategy.objs[0];
  };
  ElementInjectorDynamicStrategy.prototype.isComponentKey = function(key) {
    var p = this.injectorStrategy.protoStrategy;
    return this._ei._proto._firstBindingIsComponent && lang_1.isPresent(key) && key.id === p.keyIds[0];
  };
  ElementInjectorDynamicStrategy.prototype.buildQueries = function() {
    var p = this.injectorStrategy.protoStrategy;
    for (var i = 0; i < p.bindings.length; i++) {
      if (p.bindings[i] instanceof DirectiveBinding) {
        this._ei._buildQueriesForDeps(p.bindings[i].dependencies);
      }
    }
  };
  ElementInjectorDynamicStrategy.prototype.addDirectivesMatchingQuery = function(query, list) {
    var ist = this.injectorStrategy;
    var p = ist.protoStrategy;
    for (var i = 0; i < p.bindings.length; i++) {
      if (p.bindings[i].key.token === query.selector)
        list.push(ist.objs[i]);
    }
  };
  ElementInjectorDynamicStrategy.prototype.getComponentBinding = function() {
    var p = this.injectorStrategy.protoStrategy;
    return p.bindings[0];
  };
  return ElementInjectorDynamicStrategy;
})();
var QueryError = (function(_super) {
  __extends(QueryError, _super);
  function QueryError() {
    _super.call(this);
    this.message = 'Only 3 queries can be concurrently active in a template.';
  }
  QueryError.prototype.toString = function() {
    return this.message;
  };
  return QueryError;
})(lang_1.BaseException);
exports.QueryError = QueryError;
var QueryRef = (function() {
  function QueryRef(query, list, originator) {
    this.query = query;
    this.list = list;
    this.originator = originator;
  }
  QueryRef.prototype.update = function() {
    var aggregator = [];
    this.visit(this.originator, aggregator);
    this.list.reset(aggregator);
  };
  QueryRef.prototype.visit = function(inj, aggregator) {
    if (lang_1.isBlank(inj) || !inj._hasQuery(this))
      return ;
    if (this.query.isVarBindingQuery) {
      this._aggregateVariableBindings(inj, aggregator);
    } else {
      this._aggregateDirective(inj, aggregator);
    }
    var child = inj._head;
    while (lang_1.isPresent(child)) {
      this.visit(child, aggregator);
      child = child._next;
    }
  };
  QueryRef.prototype._aggregateVariableBindings = function(inj, aggregator) {
    var vb = this.query.varBindings;
    for (var i = 0; i < vb.length; ++i) {
      if (inj.hasVariableBinding(vb[i])) {
        aggregator.push(inj.getVariableBinding(vb[i]));
      }
    }
  };
  QueryRef.prototype._aggregateDirective = function(inj, aggregator) {
    inj.addDirectivesMatchingQuery(this.query, aggregator);
  };
  return QueryRef;
})();
exports.QueryRef = QueryRef;
exports.__esModule = true;
