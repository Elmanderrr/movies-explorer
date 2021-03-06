import { Binding } from 'angular2/di';
import { AppViewListener } from 'angular2/src/core/compiler/view_listener';
import { AppView } from 'angular2/src/core/compiler/view';
import { Renderer } from 'angular2/src/render/api';
import { DebugElement } from './debug_element';
export declare function inspectNativeElement(element: any): DebugElement;
export declare class DebugElementViewListener implements AppViewListener {
    private _renderer;
    constructor(_renderer: Renderer);
    viewCreated(view: AppView): void;
    viewDestroyed(view: AppView): void;
}
export declare var ELEMENT_PROBE_CONFIG: (Binding | typeof DebugElementViewListener)[];
export declare var __esModule: boolean;
