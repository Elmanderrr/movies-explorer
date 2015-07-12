/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, onCheck } from 'angular2/annotations';
import { ElementRef } from 'angular2/core';
import { PipeRegistry } from 'angular2/src/change_detection/pipes/pipe_registry';
import { isPresent } from 'angular2/src/facade/lang';
import { Renderer } from 'angular2/src/render/api';
export let NgStyle = class {
    constructor(_pipeRegistry, _ngEl, _renderer) {
        this._pipeRegistry = _pipeRegistry;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
    }
    set rawStyle(v) {
        this._rawStyle = v;
        this._pipe = this._pipeRegistry.get('keyValDiff', this._rawStyle);
    }
    onCheck() {
        var diff = this._pipe.transform(this._rawStyle, null);
        if (isPresent(diff) && isPresent(diff.wrapped)) {
            this._applyChanges(diff.wrapped);
        }
    }
    _applyChanges(diff) {
        diff.forEachAddedItem((record) => { this._setStyle(record.key, record.currentValue); });
        diff.forEachChangedItem((record) => { this._setStyle(record.key, record.currentValue); });
        diff.forEachRemovedItem((record) => { this._setStyle(record.key, null); });
    }
    _setStyle(name, val) {
        this._renderer.setElementStyle(this._ngEl, name, val);
    }
};
NgStyle = __decorate([
    Directive({ selector: '[ng-style]', lifecycle: [onCheck], properties: ['rawStyle: ng-style'] }), 
    __metadata('design:paramtypes', [PipeRegistry, ElementRef, Renderer])
], NgStyle);
//# sourceMappingURL=ng_style.js.map