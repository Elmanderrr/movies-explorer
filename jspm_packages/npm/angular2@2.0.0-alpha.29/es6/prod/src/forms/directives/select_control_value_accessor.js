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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive, Query, QueryList, Renderer, ElementRef } from 'angular2/angular2';
import { NgControl } from './ng_control';
import { isPresent } from 'angular2/src/facade/lang';
import { setProperty } from './shared';
/**
 * Marks <option> as dynamic, so Angular can be notified when options change.
 *
 * #Example:
 * ```
 * <select ng-control="city">
 *   <option *ng-for="#c of cities" [value]="c"></option>
 * </select>
 * ``
 * @exportedAs angular2/forms
 */
export let NgSelectOption = class {
};
NgSelectOption = __decorate([
    Directive({ selector: 'option' }), 
    __metadata('design:paramtypes', [])
], NgSelectOption);
/**
 * The accessor for writing a value and listening to changes on a select element.
 *
 * @exportedAs angular2/forms
 */
export let SelectControlValueAccessor = class {
    constructor(cd, renderer, elementRef, query) {
        this.cd = cd;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.value = '';
        this.onChange = (_) => { };
        this.onTouched = () => { };
        cd.valueAccessor = this;
        this._updateValueWhenListOfOptionsChanges(query);
    }
    writeValue(value) {
        // both this.value and setProperty are required at the moment
        // remove when a proper imperative API is provided
        this.value = value;
        setProperty(this.renderer, this.elementRef, "value", value);
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
    _updateValueWhenListOfOptionsChanges(query) {
        query.onChange(() => this.writeValue(this.value));
    }
};
SelectControlValueAccessor = __decorate([
    Directive({
        selector: 'select[ng-control],select[ng-form-control],select[ng-model]',
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
    __param(3, Query(NgSelectOption, { descendants: true })), 
    __metadata('design:paramtypes', [NgControl, Renderer, ElementRef, QueryList])
], SelectControlValueAccessor);
//# sourceMappingURL=select_control_value_accessor.js.map