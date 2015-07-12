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
import { isBlank } from 'angular2/src/facade/lang';
import { DOM } from 'angular2/src/dom/dom_adapter';
export let AppRootUrl = class {
    get value() {
        if (isBlank(this._value)) {
            var a = DOM.createElement('a');
            DOM.resolveAndSetHref(a, './', null);
            this._value = DOM.getHref(a);
        }
        return this._value;
    }
};
AppRootUrl = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], AppRootUrl);
//# sourceMappingURL=app_root_url.js.map