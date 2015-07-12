/* */ 
(function(process) {
  'use strict';
  var lang_1 = require("../../../facade/lang");
  var dom_adapter_1 = require("../../../dom/dom_adapter");
  var ShadowDomCompileStep = (function() {
    function ShadowDomCompileStep(_shadowDomStrategy, _view) {
      this._shadowDomStrategy = _shadowDomStrategy;
      this._view = _view;
    }
    ShadowDomCompileStep.prototype.process = function(parent, current, control) {
      var tagName = dom_adapter_1.DOM.tagName(current.element).toUpperCase();
      if (tagName == 'STYLE') {
        this._processStyleElement(current, control);
      } else if (tagName == 'CONTENT') {
        this._processContentElement(current);
      } else {
        var componentId = current.isBound() ? current.inheritedElementBinder.componentId : null;
        this._shadowDomStrategy.processElement(this._view.componentId, componentId, current.element);
      }
    };
    ShadowDomCompileStep.prototype._processStyleElement = function(current, control) {
      this._shadowDomStrategy.processStyleElement(this._view.componentId, this._view.templateAbsUrl, current.element);
      control.ignoreCurrentElement();
    };
    ShadowDomCompileStep.prototype._processContentElement = function(current) {
      if (this._shadowDomStrategy.hasNativeContentElement()) {
        return ;
      }
      var attrs = current.attrs();
      var selector = attrs.get('select');
      selector = lang_1.isPresent(selector) ? selector : '';
      var contentStart = dom_adapter_1.DOM.createScriptTag('type', 'ng/contentStart');
      if (lang_1.assertionsEnabled()) {
        dom_adapter_1.DOM.setAttribute(contentStart, 'select', selector);
      }
      var contentEnd = dom_adapter_1.DOM.createScriptTag('type', 'ng/contentEnd');
      dom_adapter_1.DOM.insertBefore(current.element, contentStart);
      dom_adapter_1.DOM.insertBefore(current.element, contentEnd);
      dom_adapter_1.DOM.remove(current.element);
      current.element = contentStart;
      current.bindElement().setContentTagSelector(selector);
    };
    return ShadowDomCompileStep;
  })();
  exports.ShadowDomCompileStep = ShadowDomCompileStep;
  exports.__esModule = true;
})(require("process"));
