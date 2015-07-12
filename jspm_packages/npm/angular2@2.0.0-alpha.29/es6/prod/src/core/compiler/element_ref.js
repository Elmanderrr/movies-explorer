/* */ 
"format cjs";
import { BaseException } from 'angular2/src/facade/lang';
/**
 * @exportedAs angular2/view
 */
export class ElementRef {
    constructor(parentView, boundElementIndex, _renderer) {
        this.parentView = parentView;
        this.boundElementIndex = boundElementIndex;
        this._renderer = _renderer;
    }
    get renderView() { return this.parentView.render; }
    // TODO(tbosch): remove this once Typescript supports declaring interfaces
    // that contain getters
    set renderView(viewRef) { throw new BaseException('Abstract setter'); }
    /**
     * Exposes the underlying native element.
     * Attention: This won't work in a webworker scenario!
     */
    get nativeElement() { return this._renderer.getNativeElementSync(this); }
}
//# sourceMappingURL=element_ref.js.map