/* */ 
'use strict';
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var annotations_1 = require("../../annotations");
var core_1 = require("../../core");
var pipe_registry_1 = require("../change_detection/pipes/pipe_registry");
var lang_1 = require("../facade/lang");
var api_1 = require("../render/api");
var NgStyle = (function() {
  function NgStyle(_pipeRegistry, _ngEl, _renderer) {
    this._pipeRegistry = _pipeRegistry;
    this._ngEl = _ngEl;
    this._renderer = _renderer;
  }
  Object.defineProperty(NgStyle.prototype, "rawStyle", {
    set: function(v) {
      this._rawStyle = v;
      this._pipe = this._pipeRegistry.get('keyValDiff', this._rawStyle);
    },
    enumerable: true,
    configurable: true
  });
  NgStyle.prototype.onCheck = function() {
    var diff = this._pipe.transform(this._rawStyle, null);
    if (lang_1.isPresent(diff) && lang_1.isPresent(diff.wrapped)) {
      this._applyChanges(diff.wrapped);
    }
  };
  NgStyle.prototype._applyChanges = function(diff) {
    var _this = this;
    diff.forEachAddedItem(function(record) {
      _this._setStyle(record.key, record.currentValue);
    });
    diff.forEachChangedItem(function(record) {
      _this._setStyle(record.key, record.currentValue);
    });
    diff.forEachRemovedItem(function(record) {
      _this._setStyle(record.key, null);
    });
  };
  NgStyle.prototype._setStyle = function(name, val) {
    this._renderer.setElementStyle(this._ngEl, name, val);
  };
  NgStyle = __decorate([annotations_1.Directive({
    selector: '[ng-style]',
    lifecycle: [annotations_1.onCheck],
    properties: ['rawStyle: ng-style']
  }), __metadata('design:paramtypes', [pipe_registry_1.PipeRegistry, core_1.ElementRef, api_1.Renderer])], NgStyle);
  return NgStyle;
})();
exports.NgStyle = NgStyle;
exports.__esModule = true;
