import { DomAdapter } from 'angular2/src/dom/dom_adapter';
import { ElementRef } from 'angular2/src/core/compiler/element_ref';
export declare class Rectangle {
    left: any;
    right: any;
    top: any;
    bottom: any;
    height: any;
    width: any;
    constructor(left: any, top: any, width: any, height: any);
}
export declare class Ruler {
    domAdapter: DomAdapter;
    constructor(domAdapter: DomAdapter);
    measure(el: ElementRef): Promise<Rectangle>;
}
export declare var __esModule: boolean;
