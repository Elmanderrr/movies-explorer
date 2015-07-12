import { Injector, ResolvedBinding } from 'angular2/di';
import * as eli from './element_injector';
import * as viewModule from './view';
import * as avmModule from './view_manager';
import { Renderer } from 'angular2/src/render/api';
import { Locals } from 'angular2/change_detection';
import { RenderViewRef } from 'angular2/src/render/api';
export declare class AppViewManagerUtils {
    constructor();
    getComponentInstance(parentView: viewModule.AppView, boundElementIndex: number): any;
    createView(protoView: viewModule.AppProtoView, renderView: RenderViewRef, viewManager: avmModule.AppViewManager, renderer: Renderer): viewModule.AppView;
    attachComponentView(hostView: viewModule.AppView, boundElementIndex: number, componentView: viewModule.AppView): void;
    detachComponentView(hostView: viewModule.AppView, boundElementIndex: number): void;
    hydrateComponentView(hostView: viewModule.AppView, boundElementIndex: number): void;
    hydrateRootHostView(hostView: viewModule.AppView, injector: Injector): void;
    attachViewInContainer(parentView: viewModule.AppView, boundElementIndex: number, contextView: viewModule.AppView, contextBoundElementIndex: number, atIndex: number, view: viewModule.AppView): void;
    detachViewInContainer(parentView: viewModule.AppView, boundElementIndex: number, atIndex: number): void;
    hydrateViewInContainer(parentView: viewModule.AppView, boundElementIndex: number, contextView: viewModule.AppView, contextBoundElementIndex: number, atIndex: number, bindings: ResolvedBinding[]): void;
    _hydrateView(view: viewModule.AppView, injector: Injector, hostElementInjector: eli.ElementInjector, context: Object, parentLocals: Locals): void;
    _populateViewLocals(view: viewModule.AppView, elementInjector: eli.ElementInjector): void;
    _getOrCreateViewContainer(parentView: viewModule.AppView, boundElementIndex: number): viewModule.AppViewContainer;
    _setUpEventEmitters(view: viewModule.AppView, elementInjector: eli.ElementInjector, boundElementIndex: number): void;
    _setUpHostActions(view: viewModule.AppView, elementInjector: eli.ElementInjector, boundElementIndex: number): void;
    dehydrateView(view: viewModule.AppView): void;
}
export declare var __esModule: boolean;
