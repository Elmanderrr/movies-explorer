/// <reference path="../../../../../../../angular2/typings/hammerjs/hammerjs.d.ts" />
import { HammerGesturesPluginCommon } from './hammer_common';
export declare class HammerGesturesPlugin extends HammerGesturesPluginCommon {
    constructor();
    supports(eventName: string): boolean;
    addEventListener(element: any, eventName: string, handler: Function, shouldSupportBubble: boolean): void;
}
