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
import { Directive, Renderer, ElementRef } from 'angular2/angular2';
import { NgControl } from './ng_control';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { setProperty } from './shared';
/**
 * The default accessor for writing a value and listening to changes that is used by the
 * {@link NgModel}, {@link NgFormControl}, and {@link NgControlName} directives.
 *
 *  # Example
 *  ```
 *  <input type="text" [(ng-model)]="searchQuery">
 *  ```
 *
 * @exportedAs angular2/forms
 */
export let DefaultValueAccessor = class {
    constructor(cd, renderer, elementRef) {
        this.cd = cd;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.value = null;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        cd.valueAccessor = this;
    }
    writeValue(value) {
        // both this.value and setProperty are required at the moment
        // remove when a proper imperative API is provided
        this.value = isBlank(value) ? '' : value;
        setProperty(this.renderer, this.elementRef, 'value', this.value);
    }
    get ngClassUntouched() {
        return isPresent(this.cd.control) ? this.cd.control.untouched : false;
    }
    get ngClassTouched() {
        return isPresent(this.cd.control) ? this.cd.control.touched : false;
    }
    get ngClassPristine() {
        return isPresent(this.cd.control) ? this.cd.control.pristine : false;
    }
    get ngClassDirty() { return isPresent(this.cd.control) ? this.cd.control.dirty : false; }
    get ngClassValid() { return isPresent(this.cd.control) ? this.cd.control.valid : false; }
    get ngClassInvalid() {
        return isPresent(this.cd.control) ? !this.cd.control.valid : false;
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
};
DefaultValueAccessor = __decorate([
    Directive({
        selector: 'input:not([type=checkbox])[ng-control],textarea[ng-control],input:not([type=checkbox])[ng-form-control],textarea[ng-form-control],input:not([type=checkbox])[ng-model],textarea[ng-model]',
        host: {
            '(change)': 'onChange($event.target.value)',
            '(input)': 'onChange($event.target.value)',
            '(blur)': 'onTouched()',
            '[value]': 'value',
            '[class.ng-untouched]': 'ngClassUntouched',
            '[class.ng-touched]': 'ngClassTouched',
            '[class.ng-pristine]': 'ngClassPristine',
            '[class.ng-dirty]': 'ngClassDirty',
            '[class.ng-valid]': 'ngClassValid',
            '[class.ng-invalid]': 'ngClassInvalid'
        }
    }), 
    __metadata('design:paramtypes', [NgControl, Renderer, ElementRef])
], DefaultValueAccessor);
//# sourceMappingURL=default_value_accessor.js.map