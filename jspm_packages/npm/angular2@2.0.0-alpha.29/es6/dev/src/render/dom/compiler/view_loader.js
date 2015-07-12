/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/di';
import { isBlank, isPresent, BaseException, isPromise } from 'angular2/src/facade/lang';
import { Map, ListWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { XHR } from 'angular2/src/render/xhr';
import { StyleInliner } from './style_inliner';
import { StyleUrlResolver } from './style_url_resolver';
/**
 * Strategy to load component views.
 * TODO: Make public API once we are more confident in this approach.
 */
export let ViewLoader = class {
    constructor(_xhr, _styleInliner, _styleUrlResolver) {
        this._xhr = _xhr;
        this._styleInliner = _styleInliner;
        this._styleUrlResolver = _styleUrlResolver;
        this._cache = new Map();
    }
    load(view) {
        let tplElAndStyles = [this._loadHtml(view)];
        if (isPresent(view.styles)) {
            view.styles.forEach((cssText) => {
                let textOrPromise = this._resolveAndInlineCssText(cssText, view.templateAbsUrl);
                tplElAndStyles.push(textOrPromise);
            });
        }
        if (isPresent(view.styleAbsUrls)) {
            view.styleAbsUrls.forEach(url => {
                let promise = this._loadText(url).then(cssText => this._resolveAndInlineCssText(cssText, view.templateAbsUrl));
                tplElAndStyles.push(promise);
            });
        }
        // Inline the styles from the @View annotation and return a template element
        return PromiseWrapper.all(tplElAndStyles)
            .then((res) => {
            let tplEl = res[0];
            let cssTexts = ListWrapper.slice(res, 1);
            _insertCssTexts(DOM.content(tplEl), cssTexts);
            return tplEl;
        });
    }
    _loadText(url) {
        var response = this._cache.get(url);
        if (isBlank(response)) {
            // TODO(vicb): change error when TS gets fixed
            // https://github.com/angular/angular/issues/2280
            // throw new BaseException(`Failed to fetch url "${url}"`);
            response = PromiseWrapper.catchError(this._xhr.get(url), _ => PromiseWrapper.reject(new BaseException(`Failed to fetch url "${url}"`), null));
            this._cache.set(url, response);
        }
        return response;
    }
    // Load the html and inline any style tags
    _loadHtml(view) {
        let html;
        // Load the HTML
        if (isPresent(view.template)) {
            html = PromiseWrapper.resolve(view.template);
        }
        else if (isPresent(view.templateAbsUrl)) {
            html = this._loadText(view.templateAbsUrl);
        }
        else {
            throw new BaseException('View should have either the templateUrl or template property set');
        }
        // Inline the style tags from the html
        return html.then(html => {
            var tplEl = DOM.createTemplate(html);
            let styleEls = DOM.querySelectorAll(DOM.content(tplEl), 'STYLE');
            let promises = [];
            for (let i = 0; i < styleEls.length; i++) {
                let promise = this._resolveAndInlineElement(styleEls[i], view.templateAbsUrl);
                if (isPromise(promise)) {
                    promises.push(promise);
                }
            }
            return promises.length > 0 ? PromiseWrapper.all(promises).then(_ => tplEl) : tplEl;
        });
    }
    /**
     * Inlines a style element.
     *
     * @param styleEl The style element
     * @param baseUrl The base url
     * @returns {Promise<any>} null when no @import rule exist in the css or a Promise
     * @private
     */
    _resolveAndInlineElement(styleEl, baseUrl) {
        let textOrPromise = this._resolveAndInlineCssText(DOM.getText(styleEl), baseUrl);
        if (isPromise(textOrPromise)) {
            return textOrPromise.then(css => { DOM.setText(styleEl, css); });
        }
        else {
            DOM.setText(styleEl, textOrPromise);
            return null;
        }
    }
    _resolveAndInlineCssText(cssText, baseUrl) {
        cssText = this._styleUrlResolver.resolveUrls(cssText, baseUrl);
        return this._styleInliner.inlineImports(cssText, baseUrl);
    }
};
ViewLoader = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [XHR, StyleInliner, StyleUrlResolver])
], ViewLoader);
function _insertCssTexts(element, cssTexts) {
    if (cssTexts.length == 0)
        return;
    let insertBefore = DOM.firstChild(element);
    for (let i = cssTexts.length - 1; i >= 0; i--) {
        let styleEl = DOM.createStyleElement(cssTexts[i]);
        if (isPresent(insertBefore)) {
            DOM.insertBefore(insertBefore, styleEl);
        }
        else {
            DOM.appendChild(element, styleEl);
        }
        insertBefore = styleEl;
    }
}
//# sourceMappingURL=view_loader.js.map