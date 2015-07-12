/* */ 
"format cjs";
/**
 * An abstract class that all control directive extend.
 *
 * It binds a {@link Control} object to a DOM element.
 *
 * @exportedAs angular2/forms
 */
export class NgControl {
    constructor() {
        this.name = null;
        this.valueAccessor = null;
    }
    get validator() { return null; }
    get path() { return null; }
    get control() { return null; }
    viewToModelUpdate(newValue) { }
}
//# sourceMappingURL=ng_control.js.map