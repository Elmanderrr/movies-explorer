import { QueryList, Renderer, ElementRef } from 'angular2/angular2';
import { NgControl } from './ng_control';
import { ControlValueAccessor } from './control_value_accessor';
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
export declare class NgSelectOption {
}
/**
 * The accessor for writing a value and listening to changes on a select element.
 *
 * @exportedAs angular2/forms
 */
export declare class SelectControlValueAccessor implements ControlValueAccessor {
    private cd;
    private renderer;
    private elementRef;
    value: string;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(cd: NgControl, renderer: Renderer, elementRef: ElementRef, query: QueryList<NgSelectOption>);
    writeValue(value: any): void;
    ngClassUntouched: boolean;
    ngClassTouched: boolean;
    ngClassPristine: boolean;
    ngClassDirty: boolean;
    ngClassValid: boolean;
    ngClassInvalid: boolean;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    private _updateValueWhenListOfOptionsChanges(query);
}
export declare var __esModule: boolean;
