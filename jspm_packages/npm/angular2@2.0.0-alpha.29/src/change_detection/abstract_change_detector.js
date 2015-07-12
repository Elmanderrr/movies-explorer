/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var change_detector_ref_1 = require("./change_detector_ref");
var constants_1 = require("./constants");
var AbstractChangeDetector = (function() {
  function AbstractChangeDetector(id) {
    this.id = id;
    this.lightDomChildren = [];
    this.shadowDomChildren = [];
    this.mode = null;
    this.ref = new change_detector_ref_1.ChangeDetectorRef(this);
  }
  AbstractChangeDetector.prototype.addChild = function(cd) {
    this.lightDomChildren.push(cd);
    cd.parent = this;
  };
  AbstractChangeDetector.prototype.removeChild = function(cd) {
    collection_1.ListWrapper.remove(this.lightDomChildren, cd);
  };
  AbstractChangeDetector.prototype.addShadowDomChild = function(cd) {
    this.shadowDomChildren.push(cd);
    cd.parent = this;
  };
  AbstractChangeDetector.prototype.removeShadowDomChild = function(cd) {
    collection_1.ListWrapper.remove(this.shadowDomChildren, cd);
  };
  AbstractChangeDetector.prototype.remove = function() {
    this.parent.removeChild(this);
  };
  AbstractChangeDetector.prototype.detectChanges = function() {
    this._detectChanges(false);
  };
  AbstractChangeDetector.prototype.checkNoChanges = function() {
    this._detectChanges(true);
  };
  AbstractChangeDetector.prototype._detectChanges = function(throwOnChange) {
    if (this.mode === constants_1.DETACHED || this.mode === constants_1.CHECKED)
      return ;
    this.detectChangesInRecords(throwOnChange);
    this._detectChangesInLightDomChildren(throwOnChange);
    if (throwOnChange === false)
      this.callOnAllChangesDone();
    this._detectChangesInShadowDomChildren(throwOnChange);
    if (this.mode === constants_1.CHECK_ONCE)
      this.mode = constants_1.CHECKED;
  };
  AbstractChangeDetector.prototype.detectChangesInRecords = function(throwOnChange) {};
  AbstractChangeDetector.prototype.hydrate = function(context, locals, directives) {};
  AbstractChangeDetector.prototype.dehydrate = function() {};
  AbstractChangeDetector.prototype.callOnAllChangesDone = function() {};
  AbstractChangeDetector.prototype._detectChangesInLightDomChildren = function(throwOnChange) {
    var c = this.lightDomChildren;
    for (var i = 0; i < c.length; ++i) {
      c[i]._detectChanges(throwOnChange);
    }
  };
  AbstractChangeDetector.prototype._detectChangesInShadowDomChildren = function(throwOnChange) {
    var c = this.shadowDomChildren;
    for (var i = 0; i < c.length; ++i) {
      c[i]._detectChanges(throwOnChange);
    }
  };
  AbstractChangeDetector.prototype.markAsCheckOnce = function() {
    this.mode = constants_1.CHECK_ONCE;
  };
  AbstractChangeDetector.prototype.markPathToRootAsCheckOnce = function() {
    var c = this;
    while (lang_1.isPresent(c) && c.mode != constants_1.DETACHED) {
      if (c.mode === constants_1.CHECKED)
        c.mode = constants_1.CHECK_ONCE;
      c = c.parent;
    }
  };
  return AbstractChangeDetector;
})();
exports.AbstractChangeDetector = AbstractChangeDetector;
exports.__esModule = true;
