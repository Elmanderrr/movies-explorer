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
import { Renderer } from 'angular2/src/render/api';
import { IterableChanges } from 'angular2/src/change_detection/pipes/iterable_changes';
import { isPresent, isString } from 'angular2/src/facade/lang';
import { ListWrapper, StringMapWrapper, isListLikeIterable } from 'angular2/src/facade/collection';
export let CSSClass = class {
    constructor(_pipeRegistry, _ngEl, _renderer) {
        this._pipeRegistry = _pipeRegistry;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
    }
    set rawClass(v) {
        this._cleanupClasses(this._rawClass);
        if (isString(v)) {
            v = v.split(' ');
        }
        this._rawClass = v;
        this._pipe = this._pipeRegistry.get(isListLikeIterable(v) ? 'iterableDiff' : 'keyValDiff', v);
    }
    onCheck() {
        var diff = this._pipe.transform(this._rawClass, null);
        if (isPresent(diff) && isPresent(diff.wrapped)) {
            if (diff.wrapped instanceof IterableChanges) {
                this._applyArrayChanges(diff.wrapped);
            }
            else {
                this._applyObjectChanges(diff.wrapped);
            }
        }
    }
    _cleanupClasses(rawClassVal) {
        if (isPresent(rawClassVal)) {
            if (isListLikeIterable(rawClassVal)) {
                ListWrapper.forEach(rawClassVal, (className) => { this._toggleClass(className, false); });
            }
            else {
                StringMapWrapper.forEach(rawClassVal, (expVal, className) => {
                    if (expVal)
                        this._toggleClass(className, false);
                });
            }
        }
    }
    _applyObjectChanges(diff) {
        diff.forEachAddedItem((record) => { this._toggleClass(record.key, record.currentValue); });
        diff.forEachChangedItem((record) => { this._toggleClass(record.key, record.currentValue); });
        diff.forEachRemovedItem((record) => {
            if (record.previousValue) {
                this._toggleClass(record.key, false);
            }
        });
    }
    _applyArrayChanges(diff) {
        diff.forEachAddedItem((record) => { this._toggleClass(record.item, true); });
        diff.forEachRemovedItem((record) => { this._toggleClass(record.item, false); });
    }
    _toggleClass(className, enabled) {
        this._renderer.setElementClass(this._ngEl, className, enabled);
    }
};
CSSClass = __decorate([
    Directive({ selector: '[class]', lifecycle: [onCheck], properties: ['rawClass: class'] }), 
    __metadata('design:paramtypes', [PipeRegistry, ElementRef, Renderer])
], CSSClass);
//# sourceMappingURL=class.js.map