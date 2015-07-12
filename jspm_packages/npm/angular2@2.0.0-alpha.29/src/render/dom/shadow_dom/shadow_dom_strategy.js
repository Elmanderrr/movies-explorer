/* */ 
'use strict';var ShadowDomStrategy = (function () {
    function ShadowDomStrategy() {
    }
    // Whether the strategy understands the native <content> tag
    ShadowDomStrategy.prototype.hasNativeContentElement = function () { return true; };
    // Prepares and returns the (emulated) shadow root for the given element.
    ShadowDomStrategy.prototype.prepareShadowRoot = function (el) { return null; };
    ShadowDomStrategy.prototype.constructLightDom = function (lightDomView, el) { return null; };
    // An optional step that can modify the template style elements.
    ShadowDomStrategy.prototype.processStyleElement = function (hostComponentId, templateUrl, styleElement) { };
    // An optional step that can modify the template elements (style elements exlcuded).
    ShadowDomStrategy.prototype.processElement = function (hostComponentId, elementComponentId, element) { };
    return ShadowDomStrategy;
})();
exports.ShadowDomStrategy = ShadowDomStrategy;
exports.__esModule = true;
//# sourceMappingURL=shadow_dom_strategy.js.map