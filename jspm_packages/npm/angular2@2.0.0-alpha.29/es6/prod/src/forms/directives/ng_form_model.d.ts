import { EventEmitter } from 'angular2/src/facade/async';
import { NgControl } from './ng_control';
import { NgControlGroup } from './ng_control_group';
import { ControlContainer } from './control_container';
import { Form } from './form_interface';
import { Control, ControlGroup } from '../model';
/**
 * Binds an existing control group to a DOM element.
 *
 * # Example
 *
 * In this example, we bind the control group to the form element, and we bind the login and
 * password controls to the
 * login and password elements.
 *
 *  ```
 * @Component({selector: "login-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: "<form [ng-form-model]='loginForm'>" +
 *              "Login <input type='text' ng-control='login'>" +
 *              "Password <input type='password' ng-control='password'>" +
 *              "<button (click)="onLogin()">Login</button>" +
 *              "</form>"
 *      })
 * class LoginComp {
 *  loginForm:ControlGroup;
 *
 *  constructor() {
 *    this.loginForm = new ControlGroup({
 *      login: new Control(""),
 *      password: new Control("")
 *    });
 *  }
 *
 *  onLogin() {
 *    // this.loginForm.value
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
 *      template: "<form [ng-form-model]='loginForm'>" +
 *              "Login <input type='text' ng-control='login' [(ng-model)]='login'>" +
 *              "Password <input type='password' ng-control='password' [(ng-model)]='password'>" +
 *              "<button (click)="onLogin()">Login</button>" +
 *              "</form>"
 *      })
 * class LoginComp {
 *  credentials:{login:string, password:string}
 *  loginForm:ControlGroup;
 *
 *  constructor() {
 *    this.loginForm = new ControlGroup({
 *      login: new Control(""),
 *      password: new Control("")
 *    });
 *  }
 *
 *  onLogin() {
 *    // this.credentials.login === 'some login'
 *    // this.credentials.password === 'some password'
 *  }
 * }
 *  ```
 *
 * @exportedAs angular2/forms
 */
export declare class NgFormModel extends ControlContainer implements Form {
    form: ControlGroup;
    directives: List<NgControl>;
    ngSubmit: EventEmitter;
    onChange(_: any): void;
    formDirective: Form;
    path: List<string>;
    addControl(dir: NgControl): void;
    getControl(dir: NgControl): Control;
    removeControl(dir: NgControl): void;
    addControlGroup(dir: NgControlGroup): void;
    removeControlGroup(dir: NgControlGroup): void;
    updateModel(dir: NgControl, value: any): void;
    onSubmit(): boolean;
    _updateDomValue(): void;
}
