import { ChangeDetectorRef } from './change_detector_ref';
import { ChangeDetector } from './interfaces';
import { Locals } from './parser/locals';
export declare class AbstractChangeDetector implements ChangeDetector {
    id: string;
    lightDomChildren: List<any>;
    shadowDomChildren: List<any>;
    parent: ChangeDetector;
    mode: string;
    ref: ChangeDetectorRef;
    constructor(id: string);
    addChild(cd: ChangeDetector): void;
    removeChild(cd: ChangeDetector): void;
    addShadowDomChild(cd: ChangeDetector): void;
    removeShadowDomChild(cd: ChangeDetector): void;
    remove(): void;
    detectChanges(): void;
    checkNoChanges(): void;
    _detectChanges(throwOnChange: boolean): void;
    detectChangesInRecords(throwOnChange: boolean): void;
    hydrate(context: any, locals: Locals, directives: any): void;
    dehydrate(): void;
    callOnAllChangesDone(): void;
    _detectChangesInLightDomChildren(throwOnChange: boolean): void;
    _detectChangesInShadowDomChildren(throwOnChange: boolean): void;
    markAsCheckOnce(): void;
    markPathToRootAsCheckOnce(): void;
}
