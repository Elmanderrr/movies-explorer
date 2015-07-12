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
var di_1 = require("../../di");
var lang_1 = require("../facade/lang");
var dom_adapter_1 = require("../dom/dom_adapter");
var AppRootUrl = (function() {
  function AppRootUrl() {}
  Object.defineProperty(AppRootUrl.prototype, "value", {
    get: function() {
      if (lang_1.isBlank(this._value)) {
        var a = dom_adapter_1.DOM.createElement('a');
        dom_adapter_1.DOM.resolveAndSetHref(a, './', null);
        this._value = dom_adapter_1.DOM.getHref(a);
      }
      return this._value;
    },
    enumerable: true,
    configurable: true
  });
  AppRootUrl = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], AppRootUrl);
  return AppRootUrl;
})();
exports.AppRootUrl = AppRootUrl;
exports.__esModule = true;
