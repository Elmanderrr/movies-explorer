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
import { isString, StringWrapper, CONST } from 'angular2/src/facade/lang';
/**
 * Implements lowercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text lowercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp"
 * })
 * @View({
 *   template: "Username: {{ user | lowercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 *
 * @exportedAs angular2/pipes
 */
export class LowerCasePipe {
    constructor() {
        this._latestValue = null;
    }
    supports(str) { return isString(str); }
    onDestroy() { this._latestValue = null; }
    transform(value, args = null) {
        if (this._latestValue !== value) {
            this._latestValue = value;
            return StringWrapper.toLowerCase(value);
        }
        else {
            return this._latestValue;
        }
    }
}
/**
 * @exportedAs angular2/pipes
 */
export let LowerCaseFactory = class {
    supports(str) { return isString(str); }
    create(cdRef) { return new LowerCasePipe(); }
};
LowerCaseFactory = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], LowerCaseFactory);
//# sourceMappingURL=lowercase_pipe.js.map