import { EventEmitter } from 'angular2/src/facade/async';
import { LocationStrategy } from 'angular2/src/router/location_strategy';
export declare class MockLocationStrategy extends LocationStrategy {
    internalBaseHref: string;
    internalPath: string;
    internalTitle: string;
    urlChanges: List<string>;
    _subject: EventEmitter;
    constructor();
    simulatePopState(url: any): void;
    path(): string;
    simulateUrlPop(pathname: string): void;
    pushState(ctx: any, title: string, url: string): void;
    onPopState(fn: any): void;
    getBaseHref(): string;
}
export declare var __esModule: boolean;
