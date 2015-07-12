/* */ 
'use strict';
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var di_1 = require("../../../di");
var collection_1 = require("../../facade/collection");
var eli = require("./element_injector");
var lang_1 = require("../../facade/lang");
var viewModule = require("./view");
var AppViewManagerUtils = (function() {
  function AppViewManagerUtils() {}
  AppViewManagerUtils.prototype.getComponentInstance = function(parentView, boundElementIndex) {
    var eli = parentView.elementInjectors[boundElementIndex];
    return eli.getComponent();
  };
  AppViewManagerUtils.prototype.createView = function(protoView, renderView, viewManager, renderer) {
    var view = new viewModule.AppView(renderer, protoView, protoView.protoLocals);
    view.render = renderView;
    var changeDetector = protoView.protoChangeDetector.instantiate(view);
    var binders = protoView.elementBinders;
    var elementInjectors = collection_1.ListWrapper.createFixedSize(binders.length);
    var rootElementInjectors = [];
    var preBuiltObjects = collection_1.ListWrapper.createFixedSize(binders.length);
    var componentChildViews = collection_1.ListWrapper.createFixedSize(binders.length);
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      var elementInjector = null;
      var protoElementInjector = binder.protoElementInjector;
      if (lang_1.isPresent(protoElementInjector)) {
        if (lang_1.isPresent(protoElementInjector.parent)) {
          var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
          elementInjector = protoElementInjector.instantiate(parentElementInjector);
        } else {
          elementInjector = protoElementInjector.instantiate(null);
          rootElementInjectors.push(elementInjector);
        }
      }
      elementInjectors[binderIdx] = elementInjector;
      if (lang_1.isPresent(elementInjector)) {
        var embeddedProtoView = binder.hasEmbeddedProtoView() ? binder.nestedProtoView : null;
        preBuiltObjects[binderIdx] = new eli.PreBuiltObjects(viewManager, view, embeddedProtoView);
      }
    }
    view.init(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews);
    return view;
  };
  AppViewManagerUtils.prototype.attachComponentView = function(hostView, boundElementIndex, componentView) {
    var childChangeDetector = componentView.changeDetector;
    hostView.changeDetector.addShadowDomChild(childChangeDetector);
    hostView.componentChildViews[boundElementIndex] = componentView;
  };
  AppViewManagerUtils.prototype.detachComponentView = function(hostView, boundElementIndex) {
    var componentView = hostView.componentChildViews[boundElementIndex];
    hostView.changeDetector.removeShadowDomChild(componentView.changeDetector);
    hostView.componentChildViews[boundElementIndex] = null;
  };
  AppViewManagerUtils.prototype.hydrateComponentView = function(hostView, boundElementIndex) {
    var elementInjector = hostView.elementInjectors[boundElementIndex];
    var componentView = hostView.componentChildViews[boundElementIndex];
    var component = this.getComponentInstance(hostView, boundElementIndex);
    this._hydrateView(componentView, null, elementInjector, component, null);
  };
  AppViewManagerUtils.prototype.hydrateRootHostView = function(hostView, injector) {
    this._hydrateView(hostView, injector, null, new Object(), null);
  };
  AppViewManagerUtils.prototype.attachViewInContainer = function(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, view) {
    if (lang_1.isBlank(contextView)) {
      contextView = parentView;
      contextBoundElementIndex = boundElementIndex;
    }
    parentView.changeDetector.addChild(view.changeDetector);
    var viewContainer = this._getOrCreateViewContainer(parentView, boundElementIndex);
    collection_1.ListWrapper.insert(viewContainer.views, atIndex, view);
    var sibling;
    if (atIndex == 0) {
      sibling = null;
    } else {
      sibling = collection_1.ListWrapper.last(viewContainer.views[atIndex - 1].rootElementInjectors);
    }
    var elementInjector = contextView.elementInjectors[contextBoundElementIndex];
    for (var i = view.rootElementInjectors.length - 1; i >= 0; i--) {
      if (lang_1.isPresent(elementInjector.parent)) {
        view.rootElementInjectors[i].linkAfter(elementInjector.parent, sibling);
      } else {
        contextView.rootElementInjectors.push(view.rootElementInjectors[i]);
      }
    }
  };
  AppViewManagerUtils.prototype.detachViewInContainer = function(parentView, boundElementIndex, atIndex) {
    var viewContainer = parentView.viewContainers[boundElementIndex];
    var view = viewContainer.views[atIndex];
    view.changeDetector.remove();
    collection_1.ListWrapper.removeAt(viewContainer.views, atIndex);
    for (var i = 0; i < view.rootElementInjectors.length; ++i) {
      var inj = view.rootElementInjectors[i];
      if (lang_1.isPresent(inj.parent)) {
        inj.unlink();
      } else {
        var removeIdx = collection_1.ListWrapper.indexOf(parentView.rootElementInjectors, inj);
        collection_1.ListWrapper.removeAt(parentView.rootElementInjectors, removeIdx);
      }
    }
  };
  AppViewManagerUtils.prototype.hydrateViewInContainer = function(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, bindings) {
    if (lang_1.isBlank(contextView)) {
      contextView = parentView;
      contextBoundElementIndex = boundElementIndex;
    }
    var viewContainer = parentView.viewContainers[boundElementIndex];
    var view = viewContainer.views[atIndex];
    var elementInjector = contextView.elementInjectors[contextBoundElementIndex];
    var injector = lang_1.isPresent(bindings) ? di_1.Injector.fromResolvedBindings(bindings) : null;
    this._hydrateView(view, injector, elementInjector.getHost(), contextView.context, contextView.locals);
  };
  AppViewManagerUtils.prototype._hydrateView = function(view, injector, hostElementInjector, context, parentLocals) {
    view.context = context;
    view.locals.parent = parentLocals;
    var binders = view.proto.elementBinders;
    for (var i = 0; i < binders.length; ++i) {
      var elementInjector = view.elementInjectors[i];
      if (lang_1.isPresent(elementInjector)) {
        elementInjector.hydrate(injector, hostElementInjector, view.preBuiltObjects[i]);
        this._populateViewLocals(view, elementInjector);
        this._setUpEventEmitters(view, elementInjector, i);
        this._setUpHostActions(view, elementInjector, i);
      }
    }
    view.changeDetector.hydrate(view.context, view.locals, view);
  };
  AppViewManagerUtils.prototype._populateViewLocals = function(view, elementInjector) {
    if (lang_1.isPresent(elementInjector.getDirectiveVariableBindings())) {
      collection_1.MapWrapper.forEach(elementInjector.getDirectiveVariableBindings(), function(directiveIndex, name) {
        if (lang_1.isBlank(directiveIndex)) {
          view.locals.set(name, elementInjector.getElementRef().nativeElement);
        } else {
          view.locals.set(name, elementInjector.getDirectiveAtIndex(directiveIndex));
        }
      });
    }
  };
  AppViewManagerUtils.prototype._getOrCreateViewContainer = function(parentView, boundElementIndex) {
    var viewContainer = parentView.viewContainers[boundElementIndex];
    if (lang_1.isBlank(viewContainer)) {
      viewContainer = new viewModule.AppViewContainer();
      parentView.viewContainers[boundElementIndex] = viewContainer;
    }
    return viewContainer;
  };
  AppViewManagerUtils.prototype._setUpEventEmitters = function(view, elementInjector, boundElementIndex) {
    var emitters = elementInjector.getEventEmitterAccessors();
    for (var directiveIndex = 0; directiveIndex < emitters.length; ++directiveIndex) {
      var directiveEmitters = emitters[directiveIndex];
      var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
      for (var eventIndex = 0; eventIndex < directiveEmitters.length; ++eventIndex) {
        var eventEmitterAccessor = directiveEmitters[eventIndex];
        eventEmitterAccessor.subscribe(view, boundElementIndex, directive);
      }
    }
  };
  AppViewManagerUtils.prototype._setUpHostActions = function(view, elementInjector, boundElementIndex) {
    var hostActions = elementInjector.getHostActionAccessors();
    for (var directiveIndex = 0; directiveIndex < hostActions.length; ++directiveIndex) {
      var directiveHostActions = hostActions[directiveIndex];
      var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
      for (var index = 0; index < directiveHostActions.length; ++index) {
        var hostActionAccessor = directiveHostActions[index];
        hostActionAccessor.subscribe(view, boundElementIndex, directive);
      }
    }
  };
  AppViewManagerUtils.prototype.dehydrateView = function(view) {
    var binders = view.proto.elementBinders;
    for (var i = 0; i < binders.length; ++i) {
      var elementInjector = view.elementInjectors[i];
      if (lang_1.isPresent(elementInjector)) {
        elementInjector.dehydrate();
      }
    }
    if (lang_1.isPresent(view.locals)) {
      view.locals.clearValues();
    }
    view.context = null;
    view.changeDetector.dehydrate();
  };
  AppViewManagerUtils = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], AppViewManagerUtils);
  return AppViewManagerUtils;
})();
exports.AppViewManagerUtils = AppViewManagerUtils;
exports.__esModule = true;
