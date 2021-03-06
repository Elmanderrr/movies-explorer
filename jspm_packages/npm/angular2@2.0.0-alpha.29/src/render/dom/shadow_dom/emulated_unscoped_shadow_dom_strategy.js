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
var dom_adapter_1 = require("../../../dom/dom_adapter");
var light_dom_1 = require("./light_dom");
var shadow_dom_strategy_1 = require("./shadow_dom_strategy");
var util_1 = require("./util");
var EmulatedUnscopedShadowDomStrategy = (function(_super) {
  __extends(EmulatedUnscopedShadowDomStrategy, _super);
  function EmulatedUnscopedShadowDomStrategy(styleHost) {
    _super.call(this);
    this.styleHost = styleHost;
  }
  EmulatedUnscopedShadowDomStrategy.prototype.hasNativeContentElement = function() {
    return false;
  };
  EmulatedUnscopedShadowDomStrategy.prototype.prepareShadowRoot = function(el) {
    return el;
  };
  EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom = function(lightDomView, el) {
    return new light_dom_1.LightDom(lightDomView, el);
  };
  EmulatedUnscopedShadowDomStrategy.prototype.processStyleElement = function(hostComponentId, templateUrl, styleEl) {
    var cssText = dom_adapter_1.DOM.getText(styleEl);
    util_1.insertSharedStyleText(cssText, this.styleHost, styleEl);
  };
  return EmulatedUnscopedShadowDomStrategy;
})(shadow_dom_strategy_1.ShadowDomStrategy);
exports.EmulatedUnscopedShadowDomStrategy = EmulatedUnscopedShadowDomStrategy;
exports.__esModule = true;
