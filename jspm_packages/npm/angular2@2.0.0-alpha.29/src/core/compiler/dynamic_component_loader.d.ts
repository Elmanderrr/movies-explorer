import { Injector, ResolvedBinding, Binding } from 'angular2/di';
import { Compiler } from './compiler';
import { Type } from 'angular2/src/facade/lang';
import { AppViewManager } from 'angular2/src/core/compiler/view_manager';
import { ElementRef } from './element_ref';
import { ViewRef } from './view_ref';
/**
 * @exportedAs angular2/view
 */
export declare class ComponentRef {
    location: ElementRef;
    instance: any;
    dispose: Function;
    constructor(location: ElementRef, instance: any, dispose: Function);
    hostView: ViewRef;
}
/**
 * Service for dynamically loading a Component into an arbitrary position in the internal Angular
 * application tree.
 *
 * @exportedAs angular2/view
 */
export declare class DynamicComponentLoader {
    private _compiler;
    private _viewManager;
    constructor(_compiler: Compiler, _viewManager: AppViewManager);
    /**
     * Loads a root component that is placed at the first element that matches the
     * component's selector.
     * The loaded component receives injection normally as a hosted view.
     */
    loadAsRoot(typeOrBinding: Type | Binding, overrideSelector: string, injector: Injector): Promise<ComponentRef>;
    /**
     * Loads a component into the component view of the provided ElementRef
     * next to the element with the given name
     * The loaded component receives
     * injection normally as a hosted view.
     */
    loadIntoLocation(typeOrBinding: Type | Binding, hostLocation: ElementRef, anchorName: string, bindings?: ResolvedBinding[]): Promise<ComponentRef>;
    /**
     * Loads a component next to the provided ElementRef. The loaded component receives
     * injection normally as a hosted view.
     */
    loadNextToLocation(typeOrBinding: Type | Binding, location: ElementRef, bindings?: ResolvedBinding[]): Promise<ComponentRef>;
}
export declare var __esModule: boolean;
