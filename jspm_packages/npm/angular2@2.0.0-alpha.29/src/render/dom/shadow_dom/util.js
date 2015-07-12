/* */ 
'use strict';
var lang_1 = require("../../../facade/lang");
var collection_1 = require("../../../facade/collection");
var dom_adapter_1 = require("../../../dom/dom_adapter");
var shadow_css_1 = require("./shadow_css");
var _componentUIDs = new collection_1.Map();
var _nextComponentUID = 0;
var _sharedStyleTexts = new collection_1.Map();
var _lastInsertedStyleEl;
function getComponentId(componentStringId) {
  var id = _componentUIDs.get(componentStringId);
  if (lang_1.isBlank(id)) {
    id = _nextComponentUID++;
    _componentUIDs.set(componentStringId, id);
  }
  return id;
}
exports.getComponentId = getComponentId;
function insertSharedStyleText(cssText, styleHost, styleEl) {
  if (!_sharedStyleTexts.has(cssText)) {
    _sharedStyleTexts.set(cssText, true);
    insertStyleElement(styleHost, styleEl);
  }
}
exports.insertSharedStyleText = insertSharedStyleText;
function insertStyleElement(host, styleEl) {
  if (lang_1.isBlank(_lastInsertedStyleEl)) {
    var firstChild = dom_adapter_1.DOM.firstChild(host);
    if (lang_1.isPresent(firstChild)) {
      dom_adapter_1.DOM.insertBefore(firstChild, styleEl);
    } else {
      dom_adapter_1.DOM.appendChild(host, styleEl);
    }
  } else {
    dom_adapter_1.DOM.insertAfter(_lastInsertedStyleEl, styleEl);
  }
  _lastInsertedStyleEl = styleEl;
}
exports.insertStyleElement = insertStyleElement;
function getHostAttribute(id) {
  return "_nghost-" + id;
}
exports.getHostAttribute = getHostAttribute;
function getContentAttribute(id) {
  return "_ngcontent-" + id;
}
exports.getContentAttribute = getContentAttribute;
function shimCssForComponent(cssText, componentId) {
  var id = getComponentId(componentId);
  var shadowCss = new shadow_css_1.ShadowCss();
  return shadowCss.shimCssText(cssText, getContentAttribute(id), getHostAttribute(id));
}
exports.shimCssForComponent = shimCssForComponent;
function resetShadowDomCache() {
  _componentUIDs.clear();
  _nextComponentUID = 0;
  _sharedStyleTexts.clear();
  _lastInsertedStyleEl = null;
}
exports.resetShadowDomCache = resetShadowDomCache;
exports.__esModule = true;
