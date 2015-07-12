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
var di_1 = require("../../../../di");
var dom_adapter_1 = require("../../../dom/dom_adapter");
var shadow_dom_strategy_1 = require("./shadow_dom_strategy");
var NativeShadowDomStrategy = (function(_super) {
  __extends(NativeShadowDomStrategy, _super);
  function NativeShadowDomStrategy() {
    _super.apply(this, arguments);
  }
  NativeShadowDomStrategy.prototype.prepareShadowRoot = function(el) {
    return dom_adapter_1.DOM.createShadowRoot(el);
  };
  NativeShadowDomStrategy = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], NativeShadowDomStrategy);
  return NativeShadowDomStrategy;
})(shadow_dom_strategy_1.ShadowDomStrategy);
exports.NativeShadowDomStrategy = NativeShadowDomStrategy;
exports.__esModule = true;
