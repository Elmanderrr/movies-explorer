import { EventEmitter } from 'angular2/src/facade/async';
import { QueryList } from 'angular2/angular2';
import { NgControl } from './ng_control';
import { Control } from '../model';
import { NgValidator } from './validators';
/**
 * Binds an existing control to a DOM element.
 *
 * # Example
 *
 * In this example, we bind the control to an input element. When the value of the input element
 * changes, the value of
 * the control will reflect that change. Likewise, if the value of the control changes, the input
 * element reflects that
 * change.
 *
 *  ```
 * @Component({selector: "login-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: "<input type='text' [ng-form-control]='loginControl'>"
 *      })
 * class LoginComp {
 *  loginControl:Control;
 *
 *  constructor() {
 *    this.loginControl = new Control('');
 *  }
 * }
 *
 *  ```
 *
 * We can also use ng-model to bind a domain model to the form.
 *
 *  ```
 * @Component({selector: "login-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: "<input type='text' [ng-form-control]='loginControl' [(ng-model)]='login'>"
 *      })
 * class LoginComp {
 *  loginControl:Control;
 *  login:string;
 *
 *  constructor() {
 *    this.loginControl = new Control('');
 *  }
 * }
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class NgFormControl extends NgControl {
    form: Control;
    update: EventEmitter;
    _added: boolean;
    model: any;
    ngValidators: QueryList<NgValidator>;
    constructor(ngValidators: QueryList<NgValidator>);
    onChange(c: any): void;
    path: List<string>;
    control: Control;
    validator: Function;
    viewToModelUpdate(newValue: any): void;
}
