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
var WrappedValue = (function() {
  function WrappedValue(wrapped) {
    this.wrapped = wrapped;
  }
  WrappedValue.wrap = function(value) {
    var w = _wrappedValues[_wrappedIndex++ % 5];
    w.wrapped = value;
    return w;
  };
  return WrappedValue;
})();
exports.WrappedValue = WrappedValue;
var _wrappedValues = [new WrappedValue(null), new WrappedValue(null), new WrappedValue(null), new WrappedValue(null), new WrappedValue(null)];
var _wrappedIndex = 0;
var BasePipe = (function() {
  function BasePipe() {}
  BasePipe.prototype.supports = function(obj) {
    return true;
  };
  BasePipe.prototype.onDestroy = function() {};
  BasePipe.prototype.transform = function(value, args) {
    return _abstract();
  };
  BasePipe = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], BasePipe);
  return BasePipe;
})();
exports.BasePipe = BasePipe;
function _abstract() {
  throw new lang_1.BaseException('This method is abstract');
}
exports.__esModule = true;
