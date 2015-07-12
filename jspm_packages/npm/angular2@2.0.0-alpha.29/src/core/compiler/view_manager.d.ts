import { Injector, ResolvedBinding } from 'angular2/di';
import * as viewModule from './view';
import { ElementRef } from './element_ref';
import { ProtoViewRef, ViewRef } from './view_ref';
import { ViewContainerRef } from './view_container_ref';
import { Renderer } from 'angular2/src/render/api';
import { AppViewManagerUtils } from './view_manager_utils';
import { AppViewPool } from './view_pool';
import { AppViewListener } from './view_listener';
/**
 * Entry point for creating, moving views in the view hierarchy and destroying views.
 * This manager contains all recursion and delegates to helper methods
 * in AppViewManagerUtils and the Renderer, so unit tests get simpler.
 */
export declare class AppViewManager {
    _viewPool: AppViewPool;
    _viewListener: AppViewListener;
    _utils: AppViewManagerUtils;
    _renderer: Renderer;
    constructor(_viewPool: AppViewPool, _viewListener: AppViewListener, _utils: AppViewManagerUtils, _renderer: Renderer);
    getComponentView(hostLocation: ElementRef): ViewRef;
    getViewContainer(location: ElementRef): ViewContainerRef;
    getHostElement(hostViewRef: ViewRef): ElementRef;
    /**
     * Returns an ElementRef for the element with the given variable name
     * in the component view of the component at the provided ElementRef.
     */
    getNamedElementInComponentView(hostLocation: ElementRef, variableName: string): ElementRef;
    getComponent(hostLocation: ElementRef): any;
    createRootHostView(hostProtoViewRef: ProtoViewRef, overrideSelector: string, injector: Injector): ViewRef;
    destroyRootHostView(hostViewRef: ViewRef): void;
    createViewInContainer(viewContainerLocation: ElementRef, atIndex: number, protoViewRef: ProtoViewRef, context?: ElementRef, bindings?: ResolvedBinding[]): ViewRef;
    destroyViewInContainer(viewContainerLocation: ElementRef, atIndex: number): void;
    attachViewInContainer(viewContainerLocation: ElementRef, atIndex: number, viewRef: ViewRef): ViewRef;
    detachViewInContainer(viewContainerLocation: ElementRef, atIndex: number): ViewRef;
    _createPooledView(protoView: viewModule.AppProtoView): viewModule.AppView;
    _createViewRecurse(view: viewModule.AppView): void;
    _destroyPooledView(view: viewModule.AppView): void;
    _destroyViewInContainer(parentView: any, boundElementIndex: any, atIndex: number): void;
    _destroyComponentView(hostView: any, boundElementIndex: any, componentView: any): void;
    _viewHydrateRecurse(view: viewModule.AppView): void;
    _viewDehydrateRecurse(view: viewModule.AppView, forceDestroyComponents: any): void;
}
export declare var __esModule: boolean;
