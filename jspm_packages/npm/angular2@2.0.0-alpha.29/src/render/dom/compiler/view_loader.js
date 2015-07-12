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
var di_1 = require("../../../../di");
var lang_1 = require("../../../facade/lang");
var collection_1 = require("../../../facade/collection");
var async_1 = require("../../../facade/async");
var dom_adapter_1 = require("../../../dom/dom_adapter");
var xhr_1 = require("../../xhr");
var style_inliner_1 = require("./style_inliner");
var style_url_resolver_1 = require("./style_url_resolver");
var ViewLoader = (function() {
  function ViewLoader(_xhr, _styleInliner, _styleUrlResolver) {
    this._xhr = _xhr;
    this._styleInliner = _styleInliner;
    this._styleUrlResolver = _styleUrlResolver;
    this._cache = new collection_1.Map();
  }
  ViewLoader.prototype.load = function(view) {
    var _this = this;
    var tplElAndStyles = [this._loadHtml(view)];
    if (lang_1.isPresent(view.styles)) {
      view.styles.forEach(function(cssText) {
        var textOrPromise = _this._resolveAndInlineCssText(cssText, view.templateAbsUrl);
        tplElAndStyles.push(textOrPromise);
      });
    }
    if (lang_1.isPresent(view.styleAbsUrls)) {
      view.styleAbsUrls.forEach(function(url) {
        var promise = _this._loadText(url).then(function(cssText) {
          return _this._resolveAndInlineCssText(cssText, view.templateAbsUrl);
        });
        tplElAndStyles.push(promise);
      });
    }
    return async_1.PromiseWrapper.all(tplElAndStyles).then(function(res) {
      var tplEl = res[0];
      var cssTexts = collection_1.ListWrapper.slice(res, 1);
      _insertCssTexts(dom_adapter_1.DOM.content(tplEl), cssTexts);
      return tplEl;
    });
  };
  ViewLoader.prototype._loadText = function(url) {
    var response = this._cache.get(url);
    if (lang_1.isBlank(response)) {
      response = async_1.PromiseWrapper.catchError(this._xhr.get(url), function(_) {
        return async_1.PromiseWrapper.reject(new lang_1.BaseException("Failed to fetch url \"" + url + "\""), null);
      });
      this._cache.set(url, response);
    }
    return response;
  };
  ViewLoader.prototype._loadHtml = function(view) {
    var _this = this;
    var html;
    if (lang_1.isPresent(view.template)) {
      html = async_1.PromiseWrapper.resolve(view.template);
    } else if (lang_1.isPresent(view.templateAbsUrl)) {
      html = this._loadText(view.templateAbsUrl);
    } else {
      throw new lang_1.BaseException('View should have either the templateUrl or template property set');
    }
    return html.then(function(html) {
      var tplEl = dom_adapter_1.DOM.createTemplate(html);
      var styleEls = dom_adapter_1.DOM.querySelectorAll(dom_adapter_1.DOM.content(tplEl), 'STYLE');
      var promises = [];
      for (var i = 0; i < styleEls.length; i++) {
        var promise = _this._resolveAndInlineElement(styleEls[i], view.templateAbsUrl);
        if (lang_1.isPromise(promise)) {
          promises.push(promise);
        }
      }
      return promises.length > 0 ? async_1.PromiseWrapper.all(promises).then(function(_) {
        return tplEl;
      }) : tplEl;
    });
  };
  ViewLoader.prototype._resolveAndInlineElement = function(styleEl, baseUrl) {
    var textOrPromise = this._resolveAndInlineCssText(dom_adapter_1.DOM.getText(styleEl), baseUrl);
    if (lang_1.isPromise(textOrPromise)) {
      return textOrPromise.then(function(css) {
        dom_adapter_1.DOM.setText(styleEl, css);
      });
    } else {
      dom_adapter_1.DOM.setText(styleEl, textOrPromise);
      return null;
    }
  };
  ViewLoader.prototype._resolveAndInlineCssText = function(cssText, baseUrl) {
    cssText = this._styleUrlResolver.resolveUrls(cssText, baseUrl);
    return this._styleInliner.inlineImports(cssText, baseUrl);
  };
  ViewLoader = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [xhr_1.XHR, style_inliner_1.StyleInliner, style_url_resolver_1.StyleUrlResolver])], ViewLoader);
  return ViewLoader;
})();
exports.ViewLoader = ViewLoader;
function _insertCssTexts(element, cssTexts) {
  if (cssTexts.length == 0)
    return ;
  var insertBefore = dom_adapter_1.DOM.firstChild(element);
  for (var i = cssTexts.length - 1; i >= 0; i--) {
    var styleEl = dom_adapter_1.DOM.createStyleElement(cssTexts[i]);
    if (lang_1.isPresent(insertBefore)) {
      dom_adapter_1.DOM.insertBefore(insertBefore, styleEl);
    } else {
      dom_adapter_1.DOM.appendChild(element, styleEl);
    }
    insertBefore = styleEl;
  }
}
exports.__esModule = true;
