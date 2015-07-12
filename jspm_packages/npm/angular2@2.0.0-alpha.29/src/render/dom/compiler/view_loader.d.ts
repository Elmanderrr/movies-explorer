import { XHR } from 'angular2/src/render/xhr';
import { ViewDefinition } from '../../api';
import { StyleInliner } from './style_inliner';
import { StyleUrlResolver } from './style_url_resolver';
/**
 * Strategy to load component views.
 * TODO: Make public API once we are more confident in this approach.
 */
export declare class ViewLoader {
    private _xhr;
    private _styleInliner;
    private _styleUrlResolver;
    _cache: Map<string, Promise<string>>;
    constructor(_xhr: XHR, _styleInliner: StyleInliner, _styleUrlResolver: StyleUrlResolver);
    load(view: ViewDefinition): Promise<any>;
    private _loadText(url);
    private _loadHtml(view);
    /**
     * Inlines a style element.
     *
     * @param styleEl The style element
     * @param baseUrl The base url
     * @returns {Promise<any>} null when no @import rule exist in the css or a Promise
     * @private
     */
    private _resolveAndInlineElement(styleEl, baseUrl);
    private _resolveAndInlineCssText(cssText, baseUrl);
}
export declare var __esModule: boolean;
