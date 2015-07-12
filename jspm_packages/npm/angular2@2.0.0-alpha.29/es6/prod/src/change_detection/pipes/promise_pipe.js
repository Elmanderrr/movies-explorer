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
import { isBlank, isPresent, isPromise, CONST } from 'angular2/src/facade/lang';
import { WrappedValue } from './pipe';
/**
 * Implements async bindings to Promise.
 *
 * # Example
 *
 * In this example we bind the description promise to the DOM.
 * The async pipe will convert a promise to the value with which it is resolved. It will also
 * request a change detection check when the promise is resolved.
 *
 *  ```
 * @Component({
 *   selector: "task-cmp",
 *   changeDetection: ON_PUSH
 * })
 * @View({
 *   template: "Task Description {{ description | async }}"
 * })
 * class Task {
 *   description:Promise<string>;
 * }
 *
 * ```
 *
 * @exportedAs angular2/pipes
 */
export class PromisePipe {
    constructor(_ref) {
        this._ref = _ref;
        this._latestValue = null;
        this._latestReturnedValue = null;
    }
    supports(promise) { return isPromise(promise); }
    onDestroy() {
        if (isPresent(this._sourcePromise)) {
            this._latestValue = null;
            this._latestReturnedValue = null;
            this._sourcePromise = null;
        }
    }
    transform(promise, args = null) {
        if (isBlank(this._sourcePromise)) {
            this._sourcePromise = promise;
            promise.then((val) => {
                if (this._sourcePromise === promise) {
                    this._updateLatestValue(val);
                }
            });
            return null;
        }
        if (promise !== this._sourcePromise) {
            this._sourcePromise = null;
            return this.transform(promise);
        }
        if (this._latestValue === this._latestReturnedValue) {
            return this._latestReturnedValue;
        }
        else {
            this._latestReturnedValue = this._latestValue;
            return WrappedValue.wrap(this._latestValue);
        }
    }
    _updateLatestValue(value) {
        this._latestValue = value;
        this._ref.requestCheck();
    }
}
/**
 * Provides a factory for [PromisePipe].
 *
 * @exportedAs angular2/pipes
 */
export let PromisePipeFactory = class {
    supports(promise) { return isPromise(promise); }
    create(cdRef) { return new PromisePipe(cdRef); }
};
PromisePipeFactory = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], PromisePipeFactory);
//# sourceMappingURL=promise_pipe.js.map