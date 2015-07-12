/* */ 
'use strict';
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var RouteParams = (function() {
  function RouteParams(params) {
    this.params = params;
  }
  RouteParams.prototype.get = function(param) {
    return lang_1.normalizeBlank(collection_1.StringMapWrapper.get(this.params, param));
  };
  return RouteParams;
})();
exports.RouteParams = RouteParams;
var Instruction = (function() {
  function Instruction(component, capturedUrl, _recognizer, child) {
    if (child === void 0) {
      child = null;
    }
    this.component = component;
    this.capturedUrl = capturedUrl;
    this._recognizer = _recognizer;
    this.child = child;
    this.reuse = false;
    this.accumulatedUrl = capturedUrl;
    this.specificity = _recognizer.specificity;
    if (lang_1.isPresent(child)) {
      this.child = child;
      this.specificity += child.specificity;
      var childUrl = child.accumulatedUrl;
      if (lang_1.isPresent(childUrl)) {
        this.accumulatedUrl += childUrl;
      }
    }
  }
  Instruction.prototype.params = function() {
    if (lang_1.isBlank(this._params)) {
      this._params = this._recognizer.parseParams(this.capturedUrl);
    }
    return this._params;
  };
  Instruction.prototype.hasChild = function() {
    return lang_1.isPresent(this.child);
  };
  Instruction.prototype.reuseComponentsFrom = function(oldInstruction) {
    var nextInstruction = this;
    while (nextInstruction.reuse = shouldReuseComponent(nextInstruction, oldInstruction) && lang_1.isPresent(oldInstruction = oldInstruction.child) && lang_1.isPresent(nextInstruction = nextInstruction.child))
      ;
  };
  return Instruction;
})();
exports.Instruction = Instruction;
function shouldReuseComponent(instr1, instr2) {
  return instr1.component == instr2.component && collection_1.StringMapWrapper.equals(instr1.params(), instr2.params());
}
exports.__esModule = true;
