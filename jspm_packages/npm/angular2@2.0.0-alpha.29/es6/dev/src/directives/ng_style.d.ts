import { ElementRef } from 'angular2/core';
import { Pipe } from 'angular2/src/change_detection/pipes/pipe';
import { PipeRegistry } from 'angular2/src/change_detection/pipes/pipe_registry';
import { Renderer } from 'angular2/src/render/api';
export declare class NgStyle {
    private _pipeRegistry;
    private _ngEl;
    private _renderer;
    _pipe: Pipe;
    _rawStyle: any;
    constructor(_pipeRegistry: PipeRegistry, _ngEl: ElementRef, _renderer: Renderer);
    rawStyle: any;
    onCheck(): void;
    private _applyChanges(diff);
    private _setStyle(name, val);
}
