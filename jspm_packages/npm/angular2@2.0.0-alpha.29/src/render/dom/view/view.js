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
var collection_1 = require("../../../facade/collection");
var lang_1 = require("../../../facade/lang");
var api_1 = require("../../api");
var util_1 = require("../util");
function resolveInternalDomView(viewRef) {
  return viewRef._view;
}
exports.resolveInternalDomView = resolveInternalDomView;
var DomViewRef = (function(_super) {
  __extends(DomViewRef, _super);
  function DomViewRef(_view) {
    _super.call(this);
    this._view = _view;
  }
  return DomViewRef;
})(api_1.RenderViewRef);
exports.DomViewRef = DomViewRef;
var DomView = (function() {
  function DomView(proto, rootNodes, boundTextNodes, boundElements) {
    this.proto = proto;
    this.rootNodes = rootNodes;
    this.boundTextNodes = boundTextNodes;
    this.boundElements = boundElements;
    this.hostLightDom = null;
    this.shadowRoot = null;
    this.hydrated = false;
    this.eventDispatcher = null;
    this.eventHandlerRemovers = [];
  }
  DomView.prototype.getDirectParentElement = function(boundElementIndex) {
    var binder = this.proto.elementBinders[boundElementIndex];
    var parent = null;
    if (binder.parentIndex !== -1 && binder.distanceToParent === 1) {
      parent = this.boundElements[binder.parentIndex];
    }
    return parent;
  };
  DomView.prototype.setElementProperty = function(elementIndex, propertyName, value) {
    dom_adapter_1.DOM.setProperty(this.boundElements[elementIndex].element, propertyName, value);
  };
  DomView.prototype.setElementAttribute = function(elementIndex, attributeName, value) {
    var element = this.boundElements[elementIndex].element;
    var dashCasedAttributeName = util_1.camelCaseToDashCase(attributeName);
    if (lang_1.isPresent(value)) {
      dom_adapter_1.DOM.setAttribute(element, dashCasedAttributeName, lang_1.stringify(value));
    } else {
      dom_adapter_1.DOM.removeAttribute(element, dashCasedAttributeName);
    }
  };
  DomView.prototype.setElementClass = function(elementIndex, className, isAdd) {
    var element = this.boundElements[elementIndex].element;
    var dashCasedClassName = util_1.camelCaseToDashCase(className);
    if (isAdd) {
      dom_adapter_1.DOM.addClass(element, dashCasedClassName);
    } else {
      dom_adapter_1.DOM.removeClass(element, dashCasedClassName);
    }
  };
  DomView.prototype.setElementStyle = function(elementIndex, styleName, value) {
    var element = this.boundElements[elementIndex].element;
    var dashCasedStyleName = util_1.camelCaseToDashCase(styleName);
    if (lang_1.isPresent(value)) {
      dom_adapter_1.DOM.setStyle(element, dashCasedStyleName, lang_1.stringify(value));
    } else {
      dom_adapter_1.DOM.removeStyle(element, dashCasedStyleName);
    }
  };
  DomView.prototype.invokeElementMethod = function(elementIndex, methodName, args) {
    var element = this.boundElements[elementIndex].element;
    dom_adapter_1.DOM.invoke(element, methodName, args);
  };
  DomView.prototype.setText = function(textIndex, value) {
    dom_adapter_1.DOM.setText(this.boundTextNodes[textIndex], value);
  };
  DomView.prototype.dispatchEvent = function(elementIndex, eventName, event) {
    var allowDefaultBehavior = true;
    if (lang_1.isPresent(this.eventDispatcher)) {
      var evalLocals = new collection_1.Map();
      evalLocals.set('$event', event);
      allowDefaultBehavior = this.eventDispatcher.dispatchEvent(elementIndex, eventName, evalLocals);
      if (!allowDefaultBehavior) {
        event.preventDefault();
      }
    }
    return allowDefaultBehavior;
  };
  return DomView;
})();
exports.DomView = DomView;
exports.__esModule = true;
