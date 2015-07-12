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
var LowerCasePipe = (function() {
  function LowerCasePipe() {
    this._latestValue = null;
  }
  LowerCasePipe.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  LowerCasePipe.prototype.onDestroy = function() {
    this._latestValue = null;
  };
  LowerCasePipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    if (this._latestValue !== value) {
      this._latestValue = value;
      return lang_1.StringWrapper.toLowerCase(value);
    } else {
      return this._latestValue;
    }
  };
  return LowerCasePipe;
})();
exports.LowerCasePipe = LowerCasePipe;
var LowerCaseFactory = (function() {
  function LowerCaseFactory() {}
  LowerCaseFactory.prototype.supports = function(str) {
    return lang_1.isString(str);
  };
  LowerCaseFactory.prototype.create = function(cdRef) {
    return new LowerCasePipe();
  };
  LowerCaseFactory = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], LowerCaseFactory);
  return LowerCaseFactory;
})();
exports.LowerCaseFactory = LowerCaseFactory;
exports.__esModule = true;
