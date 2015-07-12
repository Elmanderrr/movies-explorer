import {Injector, Binding, Injectable, ResolvedBinding} from 'angular2/di';
import {isPresent, isBlank, BaseException} from 'angular2/src/facade/lang';
import * as viewModule from './view';
import {ElementRef} from './element_ref';
import {ProtoViewRef, ViewRef, internalView, internalProtoView} from './view_ref';
import {ViewContainerRef} from './view_container_ref';
import {Renderer, RenderViewRef} from 'angular2/src/render/api';
import {AppViewManagerUtils} from './view_manager_utils';
import {AppViewPool} from './view_pool';
import {AppViewListener} from './view_listener';

/**
 * Entry point for creating, moving views in the view hierarchy and destroying views.
 * This manager contains all recursion and delegates to helper methods
 * in AppViewManagerUtils and the Renderer, so unit tests get simpler.
 */
@Injectable()
export class AppViewManager {
  constructor(public _viewPool: AppViewPool, public _viewListener: AppViewListener,
              public _utils: AppViewManagerUtils, public _renderer: Renderer) {}

  getComponentView(hostLocation: ElementRef): ViewRef {
    var hostView = internalView(hostLocation.parentView);
    var boundElementIndex = hostLocation.boundElementIndex;
    return hostView.componentChildViews[boundElementIndex].ref;
  }

  getViewContainer(location: ElementRef): ViewContainerRef {
    var hostView = internalView(location.parentView);
    return hostView.elementInjectors[location.boundElementIndex].getViewContainerRef();
  }

  getHostElement(hostViewRef: ViewRef): ElementRef {
    return internalView(hostViewRef).elementRefs[0];
  }

  /**
   * Returns an ElementRef for the element with the given variable name
   * in the component view of the component at the provided ElementRef.
   */
  getNamedElementInComponentView(hostLocation: ElementRef, variableName: string): ElementRef {
    var hostView = internalView(hostLocation.parentView);
    var boundElementIndex = hostLocation.boundElementIndex;
    var componentView = hostView.componentChildViews[boundElementIndex];
    if (isBlank(componentView)) {
      throw new BaseException(`There is no component directive at element ${boundElementIndex}`);
    }
    var elementIndex = componentView.proto.variableLocations.get(variableName);
    if (isBlank(elementIndex)) {
      throw new BaseException(`Could not find variable ${variableName}`);
    }
    return componentView.elementRefs[elementIndex];
  }

  getComponent(hostLocation: ElementRef): any {
    var hostView = internalView(hostLocation.parentView);
    var boundElementIndex = hostLocation.boundElementIndex;
    return this._utils.getComponentInstance(hostView, boundElementIndex);
  }

  createRootHostView(hostProtoViewRef: ProtoViewRef, overrideSelector: string,
                     injector: Injector): ViewRef {
    var hostProtoView = internalProtoView(hostProtoViewRef);
    var hostElementSelector = overrideSelector;
    if (isBlank(hostElementSelector)) {
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
  }

  destroyRootHostView(hostViewRef: ViewRef) {
    // Note: Don't detach the hostView as we want to leave the
    // root element in place. Also don't put the hostView into the view pool
    // as it is depending on the element for which it was created.
    var hostView = internalView(hostViewRef);
    // We do want to destroy the component view though.
    this._viewDehydrateRecurse(hostView, true);
    this._renderer.destroyView(hostView.render);
    this._viewListener.viewDestroyed(hostView);
  }

  createViewInContainer(viewContainerLocation: ElementRef, atIndex: number,
                        protoViewRef: ProtoViewRef, context: ElementRef = null,
                        bindings: ResolvedBinding[] = null): ViewRef {
    var protoView = internalProtoView(protoViewRef);
    var parentView = internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    var contextView = null;
    var contextBoundElementIndex = null;
    if (isPresent(context)) {
      contextView = internalView(context.parentView);
      contextBoundElementIndex = context.boundElementIndex;
    }

    var view = this._createPooledView(protoView);

    this._renderer.attachViewInContainer(viewContainerLocation, atIndex, view.render);
    this._utils.attachViewInContainer(parentView, boundElementIndex, contextView,
                                      contextBoundElementIndex, atIndex, view);
    this._utils.hydrateViewInContainer(parentView, boundElementIndex, contextView,
                                       contextBoundElementIndex, atIndex, bindings);
    this._viewHydrateRecurse(view);
    return view.ref;
  }

  destroyViewInContainer(viewContainerLocation: ElementRef, atIndex: number) {
    var parentView = internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    this._destroyViewInContainer(parentView, boundElementIndex, atIndex);
  }

  attachViewInContainer(viewContainerLocation: ElementRef, atIndex: number,
                        viewRef: ViewRef): ViewRef {
    var view = internalView(viewRef);
    var parentView = internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    // TODO(tbosch): the public methods attachViewInContainer/detachViewInContainer
    // are used for moving elements without the same container.
    // We will change this into an atomic `move` operation, which should preserve the
    // previous parent injector (see https://github.com/angular/angular/issues/1377).
    // Right now we are destroying any special
    // context view that might have been used.
    this._utils.attachViewInContainer(parentView, boundElementIndex, null, null, atIndex, view);
    this._renderer.attachViewInContainer(viewContainerLocation, atIndex, view.render);
    return viewRef;
  }

  detachViewInContainer(viewContainerLocation: ElementRef, atIndex: number): ViewRef {
    var parentView = internalView(viewContainerLocation.parentView);
    var boundElementIndex = viewContainerLocation.boundElementIndex;
    var viewContainer = parentView.viewContainers[boundElementIndex];
    var view = viewContainer.views[atIndex];
    this._utils.detachViewInContainer(parentView, boundElementIndex, atIndex);
    this._renderer.detachViewInContainer(viewContainerLocation, atIndex, view.render);
    return view.ref;
  }

  _createPooledView(protoView: viewModule.AppProtoView): viewModule.AppView {
    var view = this._viewPool.getView(protoView);
    if (isBlank(view)) {
      view = this._utils.createView(protoView, this._renderer.createView(protoView.render), this,
                                    this._renderer);
      this._renderer.setEventDispatcher(view.render, view);
      this._createViewRecurse(view);
      this._viewListener.viewCreated(view);
    }
    return view;
  }

  _createViewRecurse(view: viewModule.AppView) {
    var binders = view.proto.elementBinders;
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      if (binder.hasStaticComponent()) {
        var childView = this._createPooledView(binder.nestedProtoView);
        this._renderer.attachComponentView(view.elementRefs[binderIdx], childView.render);
        this._utils.attachComponentView(view, binderIdx, childView);
      }
    }
  }

  _destroyPooledView(view: viewModule.AppView) {
    var wasReturned = this._viewPool.returnView(view);
    if (!wasReturned) {
      this._renderer.destroyView(view.render);
      this._viewListener.viewDestroyed(view);
    }
  }

  _destroyViewInContainer(parentView, boundElementIndex, atIndex: number) {
    var viewContainer = parentView.viewContainers[boundElementIndex];
    var view = viewContainer.views[atIndex];
    this._viewDehydrateRecurse(view, false);
    this._utils.detachViewInContainer(parentView, boundElementIndex, atIndex);
    this._renderer.detachViewInContainer(parentView.elementRefs[boundElementIndex], atIndex,
                                         view.render);
    this._destroyPooledView(view);
  }

  _destroyComponentView(hostView, boundElementIndex, componentView) {
    this._viewDehydrateRecurse(componentView, false);
    this._renderer.detachComponentView(hostView.elementRefs[boundElementIndex],
                                       componentView.render);
    this._utils.detachComponentView(hostView, boundElementIndex);
    this._destroyPooledView(componentView);
  }

  _viewHydrateRecurse(view: viewModule.AppView) {
    this._renderer.hydrateView(view.render);

    var binders = view.proto.elementBinders;
    for (var i = 0; i < binders.length; ++i) {
      if (binders[i].hasStaticComponent()) {
        this._utils.hydrateComponentView(view, i);
        this._viewHydrateRecurse(view.componentChildViews[i]);
      }
    }
  }

  _viewDehydrateRecurse(view: viewModule.AppView, forceDestroyComponents) {
    this._utils.dehydrateView(view);
    this._renderer.dehydrateView(view.render);
    var binders = view.proto.elementBinders;
    for (var i = 0; i < binders.length; i++) {
      var componentView = view.componentChildViews[i];
      if (isPresent(componentView)) {
        if (forceDestroyComponents) {
          this._destroyComponentView(view, i, componentView);
        } else {
          this._viewDehydrateRecurse(componentView, false);
        }
      }
      var vc = view.viewContainers[i];
      if (isPresent(vc)) {
        for (var j = vc.views.length - 1; j >= 0; j--) {
          this._destroyViewInContainer(view, i, j);
        }
      }
    }
  }
}
