/* */ 
"format cjs";
import { isPresent } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { ChangeDetectorRef } from './change_detector_ref';
import { CHECK_ONCE, CHECKED, DETACHED } from './constants';
export class AbstractChangeDetector {
    constructor(id) {
        this.id = id;
        this.lightDomChildren = [];
        this.shadowDomChildren = [];
        this.mode = null;
        this.ref = new ChangeDetectorRef(this);
    }
    addChild(cd) {
        this.lightDomChildren.push(cd);
        cd.parent = this;
    }
    removeChild(cd) { ListWrapper.remove(this.lightDomChildren, cd); }
    addShadowDomChild(cd) {
        this.shadowDomChildren.push(cd);
        cd.parent = this;
    }
    removeShadowDomChild(cd) { ListWrapper.remove(this.shadowDomChildren, cd); }
    remove() { this.parent.removeChild(this); }
    detectChanges() { this._detectChanges(false); }
    checkNoChanges() { this._detectChanges(true); }
    _detectChanges(throwOnChange) {
        if (this.mode === DETACHED || this.mode === CHECKED)
            return;
        this.detectChangesInRecords(throwOnChange);
        this._detectChangesInLightDomChildren(throwOnChange);
        if (throwOnChange === false)
            this.callOnAllChangesDone();
        this._detectChangesInShadowDomChildren(throwOnChange);
        if (this.mode === CHECK_ONCE)
            this.mode = CHECKED;
    }
    detectChangesInRecords(throwOnChange) { }
    hydrate(context, locals, directives) { }
    dehydrate() { }
    callOnAllChangesDone() { }
    _detectChangesInLightDomChildren(throwOnChange) {
        var c = this.lightDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i]._detectChanges(throwOnChange);
        }
    }
    _detectChangesInShadowDomChildren(throwOnChange) {
        var c = this.shadowDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i]._detectChanges(throwOnChange);
        }
    }
    markAsCheckOnce() { this.mode = CHECK_ONCE; }
    markPathToRootAsCheckOnce() {
        var c = this;
        while (isPresent(c) && c.mode != DETACHED) {
            if (c.mode === CHECKED)
                c.mode = CHECK_ONCE;
            c = c.parent;
        }
    }
}
//# sourceMappingURL=abstract_change_detector.js.map