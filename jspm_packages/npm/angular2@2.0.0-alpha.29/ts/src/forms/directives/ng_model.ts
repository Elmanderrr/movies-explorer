import {CONST_EXPR} from 'angular2/src/facade/lang';
import {EventEmitter, ObservableWrapper} from 'angular2/src/facade/async';
import {StringMapWrapper} from 'angular2/src/facade/collection';

import {Directive, onChange, QueryList, Query} from 'angular2/angular2';
import {forwardRef, Ancestor, Binding} from 'angular2/di';

import {NgControl} from './ng_control';
import {Control} from '../model';
import {NgValidator} from './validators';
import {setUpControl, composeNgValidator} from './shared';

const formControlBinding = CONST_EXPR(new Binding(NgControl, {toAlias: forwardRef(() => NgModel)}));

/**
 * Binds a domain model to the form.
 *
 * # Example
 *  ```
 * @Component({selector: "search-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: `
              <input type='text' [(ng-model)]="searchQuery">
 *      `})
 * class SearchComp {
 *  searchQuery: string;
 * }
 *  ```
 *
 * @exportedAs angular2/forms
 */
@Directive({
  selector: '[ng-model]:not([ng-control]):not([ng-form-control])',
  hostInjector: [formControlBinding],
  properties: ['model: ngModel'],
  events: ['update: ngModel'],
  lifecycle: [onChange],
  exportAs: 'form'
})
export class NgModel extends NgControl {
  _control = new Control("");
  _added = false;
  update = new EventEmitter();
  model: any;
  ngValidators: QueryList<NgValidator>;

  // Scope the query once https://github.com/angular/angular/issues/2603 is fixed
  constructor(@Query(NgValidator) ngValidators: QueryList<NgValidator>) {
    super();
    this.ngValidators = ngValidators;
  }

  onChange(c) {
    if (!this._added) {
      setUpControl(this._control, this);
      this._control.updateValidity();
      this._added = true;
    }

    if (StringMapWrapper.contains(c, "model")) {
      this._control.updateValue(this.model);
    }
  }

  get control() { return this._control; }

  get path(): List<string> { return []; }

  get validator(): Function { return composeNgValidator(this.ngValidators); }

  viewToModelUpdate(newValue: any): void { ObservableWrapper.callNext(this.update, newValue); }
}
