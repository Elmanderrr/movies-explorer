import * as viewModule from '../view/view';
import { LightDom } from './light_dom';
export declare class ShadowDomStrategy {
    hasNativeContentElement(): boolean;
    prepareShadowRoot(el: any): any;
    constructLightDom(lightDomView: viewModule.DomView, el: any): LightDom;
    processStyleElement(hostComponentId: string, templateUrl: string, styleElement: any): void;
    processElement(hostComponentId: string, elementComponentId: string, element: any): void;
}
export declare var __esModule: boolean;
