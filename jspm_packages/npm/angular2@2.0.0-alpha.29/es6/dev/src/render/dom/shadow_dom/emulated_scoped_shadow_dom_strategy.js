/* */ 
"format cjs";
import { isPresent } from 'angular2/src/facade/lang';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { EmulatedUnscopedShadowDomStrategy } from './emulated_unscoped_shadow_dom_strategy';
import { getContentAttribute, getHostAttribute, getComponentId, shimCssForComponent, insertStyleElement } from './util';
/**
 * This strategy emulates the Shadow DOM for the templates, styles **included**:
 * - components templates are added as children of their component element,
 * - both the template and the styles are modified so that styles are scoped to the component
 *   they belong to,
 * - styles are moved from the templates to the styleHost (i.e. the document head).
 *
 * Notes:
 * - styles are scoped to their component and will apply only to it,
 * - a common subset of shadow DOM selectors are supported,
 * - see `ShadowCss` for more information and limitations.
 */
export class EmulatedScopedShadowDomStrategy extends EmulatedUnscopedShadowDomStrategy {
    constructor(styleHost) {
        super(styleHost);
    }
    processStyleElement(hostComponentId, templateUrl, styleEl) {
        let cssText = DOM.getText(styleEl);
        cssText = shimCssForComponent(cssText, hostComponentId);
        DOM.setText(styleEl, cssText);
        this._moveToStyleHost(styleEl);
    }
    _moveToStyleHost(styleEl) {
        DOM.remove(styleEl);
        insertStyleElement(this.styleHost, styleEl);
    }
    processElement(hostComponentId, elementComponentId, element) {
        // Shim the element as a child of the compiled component
        if (isPresent(hostComponentId)) {
            var contentAttribute = getContentAttribute(getComponentId(hostComponentId));
            DOM.setAttribute(element, contentAttribute, '');
        }
        // If the current element is also a component, shim it as a host
        if (isPresent(elementComponentId)) {
            var hostAttribute = getHostAttribute(getComponentId(elementComponentId));
            DOM.setAttribute(element, hostAttribute, '');
        }
    }
}
//# sourceMappingURL=emulated_scoped_shadow_dom_strategy.js.map