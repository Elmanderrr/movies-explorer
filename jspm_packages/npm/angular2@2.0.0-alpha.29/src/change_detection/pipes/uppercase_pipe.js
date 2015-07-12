/* */ 
'use strict';
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
var UpperCasePipe = (function() {
  function UpperCasePipe() {
    this._latestValue = null;
  }
  UpperCasePipe.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  UpperCasePipe.prototype.onDestroy = function() {
    this._latestValue = null;
  };
  UpperCasePipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    if (this._latestValue !== value) {
      this._latestValue = value;
      return lang_1.StringWrapper.toUpperCase(value);
    } else {
      return this._latestValue;
    }
  };
  return UpperCasePipe;
})();
exports.UpperCasePipe = UpperCasePipe;
var UpperCaseFactory = (function() {
  function UpperCaseFactory() {}
  UpperCaseFactory.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  UpperCaseFactory.prototype.create = function(cdRef) {
    return new UpperCasePipe();
  };
  UpperCaseFactory = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], UpperCaseFactory);
  return UpperCaseFactory;
})();
exports.UpperCaseFactory = UpperCaseFactory;
exports.__esModule = true;
