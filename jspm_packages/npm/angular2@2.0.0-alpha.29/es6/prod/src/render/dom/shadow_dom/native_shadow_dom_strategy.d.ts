import { ShadowDomStrategy } from './shadow_dom_strategy';
/**
 * This strategies uses the native Shadow DOM support.
 *
 * The templates for the component are inserted in a Shadow Root created on the component element.
 * Hence they are strictly isolated.
 */
export declare class NativeShadowDomStrategy extends ShadowDomStrategy {
    prepareShadowRoot(el: any): Node;
}
