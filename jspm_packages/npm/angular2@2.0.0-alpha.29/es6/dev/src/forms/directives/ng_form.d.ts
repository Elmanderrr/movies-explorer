import { EventEmitter } from 'angular2/src/facade/async';
import { NgControl } from './ng_control';
import { Form } from './form_interface';
import { NgControlGroup } from './ng_control_group';
import { ControlContainer } from './control_container';
import { AbstractControl, ControlGroup, Control } from '../model';
/**
 * Creates and binds a form object to a DOM element.
 *
 * # Example
 *
 *  ```
 * @Component({selector: "signup-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: `
 *              <form #f="form" (submit)='onSignUp(f.value)'>
 *                <div ng-control-group='credentials' #credentials="form">
 *                  Login <input type='text' ng-control='login'>
 *                  Password <input type='password' ng-control='password'>
 *                </div>
 *                <div *ng-if="!credentials.valid">Credentials are invalid</div>
 *
 *                <div ng-control-group='personal'>
 *                  Name <input type='text' ng-control='name'>
 *                </div>
 *                <button type='submit'>Sign Up!</button>
 *              </form>
 *      `})
 * class SignupComp {
 *  onSignUp(value) {
 *    // value === {personal: {name: 'some name'},
 *    //  credentials: {login: 'some login', password: 'some password'}}
 *  }
 * }
 *
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class NgForm extends ControlContainer implements Form {
    form: ControlGroup;
    ngSubmit: EventEmitter;
    constructor();
    formDirective: Form;
    path: List<string>;
    controls: StringMap<string, AbstractControl>;
    value: any;
    errors: any;
    addControl(dir: NgControl): void;
    getControl(dir: NgControl): Control;
    removeControl(dir: NgControl): void;
    addControlGroup(dir: NgControlGroup): void;
    removeControlGroup(dir: NgControlGroup): void;
    updateModel(dir: NgControl, value: any): void;
    onSubmit(): boolean;
    _findContainer(path: List<string>): ControlGroup;
    _later(fn: any): void;
}
