import { DomProtoView } from './proto_view';
import { LightDom } from '../shadow_dom/light_dom';
import { DomElement } from './element';
import { RenderViewRef, EventDispatcher } from '../../api';
export declare function resolveInternalDomView(viewRef: RenderViewRef): DomView;
export declare class DomViewRef extends RenderViewRef {
    _view: DomView;
    constructor(_view: DomView);
}
/**
 * Const of making objects: http://jsperf.com/instantiate-size-of-object
 */
export declare class DomView {
    proto: DomProtoView;
    rootNodes: List<any>;
    boundTextNodes: List<any>;
    boundElements: List<DomElement>;
    hostLightDom: LightDom;
    shadowRoot: any;
    hydrated: boolean;
    eventDispatcher: EventDispatcher;
    eventHandlerRemovers: List<Function>;
    constructor(proto: DomProtoView, rootNodes: List<any>, boundTextNodes: List<any>, boundElements: List<DomElement>);
    getDirectParentElement(boundElementIndex: number): DomElement;
    setElementProperty(elementIndex: number, propertyName: string, value: any): void;
    setElementAttribute(elementIndex: number, attributeName: string, value: string): void;
    setElementClass(elementIndex: number, className: string, isAdd: boolean): void;
    setElementStyle(elementIndex: number, styleName: string, value: string): void;
    invokeElementMethod(elementIndex: number, methodName: string, args: List<any>): void;
    setText(textIndex: number, value: string): void;
    dispatchEvent(elementIndex: any, eventName: any, event: any): boolean;
}
