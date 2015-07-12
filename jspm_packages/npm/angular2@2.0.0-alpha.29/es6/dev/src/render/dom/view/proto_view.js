/* */ 
"format cjs";
import { isPresent } from 'angular2/src/facade/lang';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { NG_BINDING_CLASS } from '../util';
import { RenderProtoViewRef } from '../../api';
export function resolveInternalDomProtoView(protoViewRef) {
    return protoViewRef._protoView;
}
export class DomProtoViewRef extends RenderProtoViewRef {
    constructor(_protoView) {
        super();
        this._protoView = _protoView;
    }
}
export class DomProtoView {
    constructor({ elementBinders, element, transitiveContentTagCount, boundTextNodeCount }) {
        this.element = element;
        this.elementBinders = elementBinders;
        this.transitiveContentTagCount = transitiveContentTagCount;
        this.isTemplateElement = DOM.isTemplateElement(this.element);
        this.rootBindingOffset =
            (isPresent(this.element) && DOM.hasClass(this.element, NG_BINDING_CLASS)) ? 1 : 0;
        this.boundTextNodeCount = boundTextNodeCount;
        this.rootNodeCount =
            this.isTemplateElement ? DOM.childNodes(DOM.content(this.element)).length : 1;
    }
}
//# sourceMappingURL=proto_view.js.map