import { ViewRef } from './view_ref';
import { RenderViewRef, RenderElementRef, Renderer } from 'angular2/src/render/api';
/**
 * @exportedAs angular2/view
 */
export declare class ElementRef implements RenderElementRef {
    parentView: ViewRef;
    boundElementIndex: number;
    private _renderer;
    constructor(parentView: ViewRef, boundElementIndex: number, _renderer: Renderer);
    renderView: RenderViewRef;
    /**
     * Exposes the underlying native element.
     * Attention: This won't work in a webworker scenario!
     */
    nativeElement: any;
}
