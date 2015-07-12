/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var lang_1 = require("../../facade/lang");
var collection_1 = require("../../facade/collection");
var async_1 = require("../../facade/async");
var angular2_1 = require("../../../angular2");
var di_1 = require("../../../di");
var control_container_1 = require("./control_container");
var shared_1 = require("./shared");
var formDirectiveBinding = lang_1.CONST_EXPR(new di_1.Binding(control_container_1.ControlContainer, {toAlias: di_1.forwardRef(function() {
    return NgFormModel;
  })}));
var NgFormModel = (function(_super) {
  __extends(NgFormModel, _super);
  function NgFormModel() {
    _super.apply(this, arguments);
    this.form = null;
    this.directives = [];
    this.ngSubmit = new async_1.EventEmitter();
  }
  NgFormModel.prototype.onChange = function(_) {
    this._updateDomValue();
  };
  Object.defineProperty(NgFormModel.prototype, "formDirective", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NgFormModel.prototype, "path", {
    get: function() {
      return [];
    },
    enumerable: true,
    configurable: true
  });
  NgFormModel.prototype.addControl = function(dir) {
    var c = this.form.find(dir.path);
    shared_1.setUpControl(c, dir);
    c.updateValidity();
    this.directives.push(dir);
  };
  NgFormModel.prototype.getControl = function(dir) {
    return this.form.find(dir.path);
  };
  NgFormModel.prototype.removeControl = function(dir) {
    collection_1.ListWrapper.remove(this.directives, dir);
  };
  NgFormModel.prototype.addControlGroup = function(dir) {};
  NgFormModel.prototype.removeControlGroup = function(dir) {};
  NgFormModel.prototype.updateModel = function(dir, value) {
    var c = this.form.find(dir.path);
    c.updateValue(value);
  };
  NgFormModel.prototype.onSubmit = function() {
    async_1.ObservableWrapper.callNext(this.ngSubmit, null);
    return false;
  };
  NgFormModel.prototype._updateDomValue = function() {
    var _this = this;
    collection_1.ListWrapper.forEach(this.directives, function(dir) {
      var c = _this.form.find(dir.path);
      dir.valueAccessor.writeValue(c.value);
    });
  };
  NgFormModel = __decorate([angular2_1.Directive({
    selector: '[ng-form-model]',
    hostInjector: [formDirectiveBinding],
    properties: ['form: ng-form-model'],
    lifecycle: [angular2_1.onChange],
    host: {'(submit)': 'onSubmit()'},
    events: ['ngSubmit'],
    exportAs: 'form'
  }), __metadata('design:paramtypes', [])], NgFormModel);
  return NgFormModel;
})(control_container_1.ControlContainer);
exports.NgFormModel = NgFormModel;
exports.__esModule = true;
