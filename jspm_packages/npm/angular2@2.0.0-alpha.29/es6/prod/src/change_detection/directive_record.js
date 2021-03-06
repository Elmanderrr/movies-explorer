/* */ 
"format cjs";
import { ON_PUSH } from './constants';
import { StringWrapper, normalizeBool } from 'angular2/src/facade/lang';
export class DirectiveIndex {
    constructor(elementIndex, directiveIndex) {
        this.elementIndex = elementIndex;
        this.directiveIndex = directiveIndex;
    }
    get name() { return `${this.elementIndex}_${this.directiveIndex}`; }
}
export class DirectiveRecord {
    constructor({ directiveIndex, callOnAllChangesDone, callOnChange, callOnCheck, callOnInit, changeDetection } = {}) {
        this.directiveIndex = directiveIndex;
        this.callOnAllChangesDone = normalizeBool(callOnAllChangesDone);
        this.callOnChange = normalizeBool(callOnChange);
        this.callOnCheck = normalizeBool(callOnCheck);
        this.callOnInit = normalizeBool(callOnInit);
        this.changeDetection = changeDetection;
    }
    isOnPushChangeDetection() { return StringWrapper.equals(this.changeDetection, ON_PUSH); }
}
//# sourceMappingURL=directive_record.js.map