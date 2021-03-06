import { SpyObject } from 'angular2/test_lib';
import { EventEmitter } from 'angular2/src/facade/async';
export declare class SpyLocation extends SpyObject {
    urlChanges: List<string>;
    _path: string;
    _subject: EventEmitter;
    _baseHref: string;
    constructor();
    setInitialPath(url: string): void;
    setBaseHref(url: string): void;
    path(): string;
    simulateUrlPop(pathname: string): void;
    normalizeAbsolutely(url: any): string;
    go(url: string): void;
    forward(): void;
    back(): void;
    subscribe(onNext: any, onThrow?: any, onReturn?: any): void;
    noSuchMethod(m: any): void;
}
