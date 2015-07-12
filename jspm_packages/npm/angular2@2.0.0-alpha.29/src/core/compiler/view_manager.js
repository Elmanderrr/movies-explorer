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
var lang_1 = require("../../facade/lang");
var view_ref_1 = require("./view_ref");
var api_1 = require("../../render/api");
var view_manager_utils_1 = require("./view_manager_utils");
var view_pool_1 = require("./view_pool");
var view_listener_1 = require("./view_listener");
var AppViewManager = (function() {
  function AppViewManager(_viewPool, _viewListener, _utils, _renderer) {
    this._viewPool = _viewPool;
    this._viewListener = _viewListener;
    this._utils = _utils;
    this._renderer = _renderer;
  }
  AppViewManager.prototype.getComponentView = function(hostLocation) {
    var hostView = view_ref_1.internalView(hostLocation.parentView);
    var boundElementIndex = hostLocation.boundElementIndex;
    return hostView.componentChildViews[boundElementIndex].ref;
  };
  AppViewManager.prototype.getViewContainer = function(location) {
    var hostView = view_ref_1.internalView(location.parentView);
    return hostView.elementInjectors[location.boundElementIndex].getViewContainerRef();
  };
  AppViewManager.prototype.getHostElement = function(hostViewRef) {
    return view_ref_1.internalView(hostViewRef).elementRefs[0];
  };
  AppViewManager.prototype.getNamedElementInComponentView = function(hostLocation, variableName) {
    var hostView = view_ref_1.internalView(hostLocation.parentView);
    var boundElementIndex = hostLocation.boundElementIndex;
    var componentView = hostView.componentChildViews[boundElementIndex];
    if (lang_1.isBlank(componentView)) {
      throw new lang_1.BaseException("There is no component directive at element " + boundElementIndex);
    }
    var elementIndex = componentView.proto.variableLocations.get(variableName);
    if (lang_1.isBlank(elementIndex)) {
      throw new lang_1.BaseException("Could not find variable " + variableName);
    }
    return componentView.elementRefs[elementIndex];
  };
  AppViewManager.prototype.getComponent = function(hostLocation) {
    var hostView = view_ref_1.internalView(hostLocation.parentView);
    var boundElementIndex = hostLocation.boundElementIndex;
    return this._utils.getComponentInstance(hostView, boundElementIndex);
  };
  AppViewManager.prototype.createRootHostView = function(hostProtoViewRef, overrideSelector, injector) {
    var hostProtoView = view_ref_1.internalProtoView(hostProtoViewRef);
    var hostElementSelector = overrideSelector;
    if (lang_1.isBlank(hostElementSelector)) {
      hostElementSelector = hostProtoView.elementBinders[0].componentDirective.metadata.selector;
    }
    var renderView = this._renderer.createRootHostView(hostProtoView.render, hostElementSelector);
    var hostView = this._utils.createView(hostProtoView, renderView, this, this._renderer);
    this._renderer.setEventDispatcher(hostView.render, hostView);
    this._createViewRecurse(hostView);
    this._viewListener.viewCreated(hostView);
    this._utils.hydrateRootHostView(hostView, injector);
    this._viewHydrateRecurse(hostView);
    return hostView.ref;
  };
  AppViewManager.prototype.destroyRootHostView = function(hostViewRef) {
    var hostView = view_ref_1.internalView(hostViewRef);
    this._viewDehydrateRecurse(hostView, true);
    this._renderer.destroyView(hostView.render);
    this._viewListener.viewDestroyed(hostView);
  };
  AppViewManager.prototype.createViewInContainer = function(viewContainerLocation, atIndex, protoViewRef, context, bindings) {
    if (context === void 0) {
      context = null;
    }
    if (bindings === void 0) {
      bindings = null;
    }
    var protoView = view_ref_1.internalProtoView(protoViewRef);
    var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    var contextView = null;
    var contextBoundElementIndex = null;
    if (lang_1.isPresent(context)) {
      contextView = view_ref_1.internalView(context.parentView);
      contextBoundElementIndex = context.boundElementIndex;
    }
    var view = this._createPooledView(protoView);
    this._renderer.attachViewInContainer(viewContainerLocation, atIndex, view.render);
    this._utils.attachViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, view);
    this._utils.hydrateViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, bindings);
    this._viewHydrateRecurse(view);
    return view.ref;
  };
  AppViewManager.prototype.destroyViewInContainer = function(viewContainerLocation, atIndex) {
    var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    this._destroyViewInContainer(parentView, boundElementIndex, atIndex);
  };
  AppViewManager.prototype.attachViewInContainer = function(viewContainerLocation, atIndex, viewRef) {
    var view = view_ref_1.internalView(viewRef);
    var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    this._utils.attachViewInContainer(parentView, boundElementIndex, null, null, atIndex, view);
    this._renderer.attachViewInContainer(viewContainerLocation, atIndex, view.render);
    return viewRef;
  };
  AppViewManager.prototype.detachViewInContainer = function(viewContainerLocation, atIndex) {
    var parentView = view_ref_1.internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    var viewContainer = parentView.viewContainers[boundElementIndex];
    var view = viewContainer.views[atIndex];
    this._utils.detachViewInContainer(parentView, boundElementIndex, atIndex);
    this._renderer.detachViewInContainer(viewContainerLocation, atIndex, view.render);
    return view.ref;
  };
  AppViewManager.prototype._createPooledView = function(protoView) {
    var view = this._viewPool.getView(protoView);
    if (lang_1.isBlank(view)) {
      view = this._utils.createView(protoView, this._renderer.createView(protoView.render), this, this._renderer);
      this._renderer.setEventDispatcher(view.render, view);
      this._createViewRecurse(view);
      this._viewListener.viewCreated(view);
    }
    return view;
  };
  AppViewManager.prototype._createViewRecurse = function(view) {
    var binders = view.proto.elementBinders;
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      if (binder.hasStaticComponent()) {
        var childView = this._createPooledView(binder.nestedProtoView);
        this._renderer.attachComponentView(view.elementRefs[binderIdx], childView.render);
        this._utils.attachComponentView(view, binderIdx, childView);
      }
    }
  };
  AppViewManager.prototype._destroyPooledView = function(view) {
    var wasReturned = this._viewPool.returnView(view);
    if (!wasReturned) {
      this._renderer.destroyView(view.render);
      this._viewListener.viewDestroyed(view);
    }
  };
  AppViewManager.prototype._destroyViewInContainer = function(parentView, boundElementIndex, atIndex) {
    var viewContainer = parentView.viewContainers[boundElementIndex];
    var view = viewContainer.views[atIndex];
    this._viewDehydrateRecurse(view, false);
    this._utils.detachViewInContainer(parentView, boundElementIndex, atIndex);
    this._renderer.detachViewInContainer(parentView.elementRefs[boundElementIndex], atIndex, view.render);
    this._destroyPooledView(view);
  };
  AppViewManager.prototype._destroyComponentView = function(hostView, boundElementIndex, componentView) {
    this._viewDehydrateRecurse(componentView, false);
    this._renderer.detachComponentView(hostView.elementRefs[boundElementIndex], componentView.render);
    this._utils.detachComponentView(hostView, boundElementIndex);
    this._destroyPooledView(componentView);
  };
  AppViewManager.prototype._viewHydrateRecurse = function(view) {
    this._renderer.hydrateView(view.render);
    var binders = view.proto.elementBinders;
    for (var i = 0; i < binders.length; ++i) {
      if (binders[i].hasStaticComponent()) {
        this._utils.hydrateComponentView(view, i);
        this._viewHydrateRecurse(view.componentChildViews[i]);
      }
    }
  };
  AppViewManager.prototype._viewDehydrateRecurse = function(view, forceDestroyComponents) {
    this._utils.dehydrateView(view);
    this._renderer.dehydrateView(view.render);
    var binders = view.proto.elementBinders;
    for (var i = 0; i < binders.length; i++) {
      var componentView = view.componentChildViews[i];
      if (lang_1.isPresent(componentView)) {
        if (forceDestroyComponents) {
          this._destroyComponentView(view, i, componentView);
        } else {
          this._viewDehydrateRecurse(componentView, false);
        }
      }
      var vc = view.viewContainers[i];
      if (lang_1.isPresent(vc)) {
        for (var j = vc.views.length - 1; j >= 0; j--) {
          this._destroyViewInContainer(view, i, j);
        }
      }
    }
  };
  AppViewManager = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [view_pool_1.AppViewPool, view_listener_1.AppViewListener, view_manager_utils_1.AppViewManagerUtils, api_1.Renderer])], AppViewManager);
  return AppViewManager;
})();
exports.AppViewManager = AppViewManager;
exports.__esModule = true;
