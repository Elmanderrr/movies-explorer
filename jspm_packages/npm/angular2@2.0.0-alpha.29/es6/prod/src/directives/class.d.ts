import { ElementRef } from 'angular2/core';
import { PipeRegistry } from 'angular2/src/change_detection/pipes/pipe_registry';
import { Pipe } from 'angular2/src/change_detection/pipes/pipe';
import { Renderer } from 'angular2/src/render/api';
export declare class CSSClass {
    private _pipeRegistry;
    private _ngEl;
    private _renderer;
    _pipe: Pipe;
    _rawClass: any;
    constructor(_pipeRegistry: PipeRegistry, _ngEl: ElementRef, _renderer: Renderer);
    rawClass: any;
    onCheck(): void;
    private _cleanupClasses(rawClassVal);
    private _applyObjectChanges(diff);
    private _applyArrayChanges(diff);
    private _toggleClass(className, enabled);
}
