import { Renderer, ElementRef } from 'angular2/angular2';
import { NgControl } from './ng_control';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * The accessor for writing a value and listening to changes on a checkbox input element.
 *
 *  # Example
 *  ```
 *  <input type="checkbox" [ng-control]="rememberLogin">
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class CheckboxControlValueAccessor implements ControlValueAccessor {
    private cd;
    private renderer;
    private elementRef;
    checked: boolean;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(cd: NgControl, renderer: Renderer, elementRef: ElementRef);
    writeValue(value: any): void;
    ngClassUntouched: boolean;
    ngClassTouched: boolean;
    ngClassPristine: boolean;
    ngClassDirty: boolean;
    ngClassValid: boolean;
    ngClassInvalid: boolean;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
