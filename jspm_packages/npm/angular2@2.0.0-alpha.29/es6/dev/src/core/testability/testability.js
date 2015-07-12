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
import { Injectable } from 'angular2/di';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { Map, ListWrapper } from 'angular2/src/facade/collection';
import { BaseException } from 'angular2/src/facade/lang';
import * as getTestabilityModule from './get_testability';
/**
 * The Testability service provides testing hooks that can be accessed from
 * the browser and by services such as Protractor. Each bootstrapped Angular
 * application on the page will have an instance of Testability.
 */
export let Testability = class {
    constructor() {
        this._pendingCount = 0;
        this._callbacks = [];
    }
    increaseCount(delta = 1) {
        this._pendingCount += delta;
        if (this._pendingCount < 0) {
            throw new BaseException('pending async requests below zero');
        }
        else if (this._pendingCount == 0) {
            this._runCallbacks();
        }
        return this._pendingCount;
    }
    _runCallbacks() {
        while (this._callbacks.length !== 0) {
            ListWrapper.removeLast(this._callbacks)();
        }
    }
    whenStable(callback) {
        this._callbacks.push(callback);
        if (this._pendingCount === 0) {
            this._runCallbacks();
        }
        // TODO(juliemr) - hook into the zone api.
    }
    getPendingCount() { return this._pendingCount; }
    findBindings(using, binding, exactMatch) {
        // TODO(juliemr): implement.
        return [];
    }
};
Testability = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], Testability);
export let TestabilityRegistry = class {
    constructor() {
        this._applications = new Map();
        getTestabilityModule.GetTestability.addToWindow(this);
    }
    registerApplication(token, testability) {
        this._applications.set(token, testability);
    }
    findTestabilityInTree(elem) {
        if (elem == null) {
            return null;
        }
        if (this._applications.has(elem)) {
            return this._applications.get(elem);
        }
        if (DOM.isShadowRoot(elem)) {
            return this.findTestabilityInTree(DOM.getHost(elem));
        }
        return this.findTestabilityInTree(DOM.parentElement(elem));
    }
};
TestabilityRegistry = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], TestabilityRegistry);
//# sourceMappingURL=testability.js.map