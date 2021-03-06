import { Type } from 'angular2/src/facade/lang';
import { Predicate } from 'angular2/src/facade/collection';
import { ElementInjector } from 'angular2/src/core/compiler/element_injector';
import { AppView } from 'angular2/src/core/compiler/view';
import { ElementRef } from 'angular2/src/core/compiler/element_ref';
/**
 * @exportedAs angular2/test
 *
 * An DebugElement contains information from the Angular compiler about an
 * element and provides access to the corresponding ElementInjector and
 * underlying dom Element, as well as a way to query for children.
 */
export declare class DebugElement {
    private _parentView;
    private _boundElementIndex;
    _elementInjector: ElementInjector;
    constructor(_parentView: AppView, _boundElementIndex: number);
    static create(elementRef: ElementRef): DebugElement;
    componentInstance: any;
    nativeElement: any;
    elementRef: ElementRef;
    getDirectiveInstance(directiveIndex: number): any;
    /**
     * Get child DebugElements from within the Light DOM.
     *
     * @return {List<DebugElement>}
     */
    children: List<DebugElement>;
    /**
     * Get the root DebugElement children of a component. Returns an empty
     * list if the current DebugElement is not a component root.
     *
     * @return {List<DebugElement>}
     */
    componentViewChildren: List<DebugElement>;
    triggerEventHandler(eventName: any, eventObj: any): void;
    hasDirective(type: Type): boolean;
    inject(type: Type): any;
    getLocal(name: string): any;
    /**
     * Return the first descendant TestElement matching the given predicate
     * and scope.
     *
     * @param {Function: boolean} predicate
     * @param {Scope} scope
     *
     * @return {DebugElement}
     */
    query(predicate: Predicate<DebugElement>, scope?: typeof Scope.all): DebugElement;
    /**
     * Return descendant TestElememts matching the given predicate
     * and scope.
     *
     * @param {Function: boolean} predicate
     * @param {Scope} scope
     *
     * @return {List<DebugElement>}
     */
    queryAll(predicate: Predicate<DebugElement>, scope?: typeof Scope.all): List<DebugElement>;
    _getChildElements(view: AppView, parentBoundElementIndex: number): List<DebugElement>;
}
export declare function inspectElement(elementRef: ElementRef): DebugElement;
export declare function asNativeElements(arr: List<DebugElement>): List<any>;
/**
 * @exportedAs angular2/test
 */
export declare class Scope {
    static all(debugElement: any): List<DebugElement>;
    static light(debugElement: any): List<DebugElement>;
    static view(debugElement: any): List<DebugElement>;
}
/**
 * @exportedAs angular2/test
 */
export declare class By {
    static all(): Function;
    static css(selector: string): Predicate<DebugElement>;
    static directive(type: Type): Predicate<DebugElement>;
}
export declare var __esModule: boolean;
