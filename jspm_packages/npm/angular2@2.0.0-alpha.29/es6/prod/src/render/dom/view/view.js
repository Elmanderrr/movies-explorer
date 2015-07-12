/* */ 
"format cjs";
import { DOM } from 'angular2/src/dom/dom_adapter';
import { Map } from 'angular2/src/facade/collection';
import { isPresent, stringify } from 'angular2/src/facade/lang';
import { RenderViewRef } from '../../api';
import { camelCaseToDashCase } from '../util';
export function resolveInternalDomView(viewRef) {
    return viewRef._view;
}
export class DomViewRef extends RenderViewRef {
    constructor(_view) {
        super();
        this._view = _view;
    }
}
/**
 * Const of making objects: http://jsperf.com/instantiate-size-of-object
 */
export class DomView {
    constructor(proto, rootNodes, boundTextNodes, boundElements) {
        this.proto = proto;
        this.rootNodes = rootNodes;
        this.boundTextNodes = boundTextNodes;
        this.boundElements = boundElements;
        this.hostLightDom = null;
        this.shadowRoot = null;
        this.hydrated = false;
        this.eventDispatcher = null;
        this.eventHandlerRemovers = [];
    }
    getDirectParentElement(boundElementIndex) {
        var binder = this.proto.elementBinders[boundElementIndex];
        var parent = null;
        if (binder.parentIndex !== -1 && binder.distanceToParent === 1) {
            parent = this.boundElements[binder.parentIndex];
        }
        return parent;
    }
    setElementProperty(elementIndex, propertyName, value) {
        DOM.setProperty(this.boundElements[elementIndex].element, propertyName, value);
    }
    setElementAttribute(elementIndex, attributeName, value) {
        var element = this.boundElements[elementIndex].element;
        var dashCasedAttributeName = camelCaseToDashCase(attributeName);
        if (isPresent(value)) {
            DOM.setAttribute(element, dashCasedAttributeName, stringify(value));
        }
        else {
            DOM.removeAttribute(element, dashCasedAttributeName);
        }
    }
    setElementClass(elementIndex, className, isAdd) {
        var element = this.boundElements[elementIndex].element;
        var dashCasedClassName = camelCaseToDashCase(className);
        if (isAdd) {
            DOM.addClass(element, dashCasedClassName);
        }
        else {
            DOM.removeClass(element, dashCasedClassName);
        }
    }
    setElementStyle(elementIndex, styleName, value) {
        var element = this.boundElements[elementIndex].element;
        var dashCasedStyleName = camelCaseToDashCase(styleName);
        if (isPresent(value)) {
            DOM.setStyle(element, dashCasedStyleName, stringify(value));
        }
        else {
            DOM.removeStyle(element, dashCasedStyleName);
        }
    }
    invokeElementMethod(elementIndex, methodName, args) {
        var element = this.boundElements[elementIndex].element;
        DOM.invoke(element, methodName, args);
    }
    setText(textIndex, value) { DOM.setText(this.boundTextNodes[textIndex], value); }
    dispatchEvent(elementIndex, eventName, event) {
        var allowDefaultBehavior = true;
        if (isPresent(this.eventDispatcher)) {
            var evalLocals = new Map();
            evalLocals.set('$event', event);
            // TODO(tbosch): reenable this when we are parsing element properties
            // out of action expressions
            // var localValues = this.proto.elementBinders[elementIndex].eventLocals.eval(null, new
            // Locals(null, evalLocals));
            // this.eventDispatcher.dispatchEvent(elementIndex, eventName, localValues);
            allowDefaultBehavior =
                this.eventDispatcher.dispatchEvent(elementIndex, eventName, evalLocals);
            if (!allowDefaultBehavior) {
                event.preventDefault();
            }
        }
        return allowDefaultBehavior;
    }
}
//# sourceMappingURL=view.js.map