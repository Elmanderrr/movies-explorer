/* */ 
'use strict';/**
 * An abstract class that all control directive extend.
 *
 * It binds a {@link Control} object to a DOM element.
 *
 * @exportedAs angular2/forms
 */
var NgControl = (function () {
    function NgControl() {
        this.name = null;
        this.valueAccessor = null;
    }
    Object.defineProperty(NgControl.prototype, "validator", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControl.prototype, "path", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControl.prototype, "control", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    NgControl.prototype.viewToModelUpdate = function (newValue) { };
    return NgControl;
})();
exports.NgControl = NgControl;
exports.__esModule = true;
//# sourceMappingURL=ng_control.js.map