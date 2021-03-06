import { ControlValueAccessor } from './control_value_accessor';
import { Control } from '../model';
/**
 * An abstract class that all control directive extend.
 *
 * It binds a {@link Control} object to a DOM element.
 *
 * @exportedAs angular2/forms
 */
export declare class NgControl {
    name: string;
    valueAccessor: ControlValueAccessor;
    validator: Function;
    path: List<string>;
    control: Control;
    viewToModelUpdate(newValue: any): void;
}
export declare var __esModule: boolean;
