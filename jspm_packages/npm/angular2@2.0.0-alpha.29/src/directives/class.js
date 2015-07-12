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
var api_1 = require("../render/api");
var iterable_changes_1 = require("../change_detection/pipes/iterable_changes");
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var CSSClass = (function() {
  function CSSClass(_pipeRegistry, _ngEl, _renderer) {
    this._pipeRegistry = _pipeRegistry;
    this._ngEl = _ngEl;
    this._renderer = _renderer;
  }
  Object.defineProperty(CSSClass.prototype, "rawClass", {
    set: function(v) {
      this._cleanupClasses(this._rawClass);
      if (lang_1.isString(v)) {
        v = v.split(' ');
      }
      this._rawClass = v;
      this._pipe = this._pipeRegistry.get(collection_1.isListLikeIterable(v) ? 'iterableDiff' : 'keyValDiff', v);
    },
    enumerable: true,
    configurable: true
  });
  CSSClass.prototype.onCheck = function() {
    var diff = this._pipe.transform(this._rawClass, null);
    if (lang_1.isPresent(diff) && lang_1.isPresent(diff.wrapped)) {
      if (diff.wrapped instanceof iterable_changes_1.IterableChanges) {
        this._applyArrayChanges(diff.wrapped);
      } else {
        this._applyObjectChanges(diff.wrapped);
      }
    }
  };
  CSSClass.prototype._cleanupClasses = function(rawClassVal) {
    var _this = this;
    if (lang_1.isPresent(rawClassVal)) {
      if (collection_1.isListLikeIterable(rawClassVal)) {
        collection_1.ListWrapper.forEach(rawClassVal, function(className) {
          _this._toggleClass(className, false);
        });
      } else {
        collection_1.StringMapWrapper.forEach(rawClassVal, function(expVal, className) {
          if (expVal)
            _this._toggleClass(className, false);
        });
      }
    }
  };
  CSSClass.prototype._applyObjectChanges = function(diff) {
    var _this = this;
    diff.forEachAddedItem(function(record) {
      _this._toggleClass(record.key, record.currentValue);
    });
    diff.forEachChangedItem(function(record) {
      _this._toggleClass(record.key, record.currentValue);
    });
    diff.forEachRemovedItem(function(record) {
      if (record.previousValue) {
        _this._toggleClass(record.key, false);
      }
    });
  };
  CSSClass.prototype._applyArrayChanges = function(diff) {
    var _this = this;
    diff.forEachAddedItem(function(record) {
      _this._toggleClass(record.item, true);
    });
    diff.forEachRemovedItem(function(record) {
      _this._toggleClass(record.item, false);
    });
  };
  CSSClass.prototype._toggleClass = function(className, enabled) {
    this._renderer.setElementClass(this._ngEl, className, enabled);
  };
  CSSClass = __decorate([annotations_1.Directive({
    selector: '[class]',
    lifecycle: [annotations_1.onCheck],
    properties: ['rawClass: class']
  }), __metadata('design:paramtypes', [pipe_registry_1.PipeRegistry, core_1.ElementRef, api_1.Renderer])], CSSClass);
  return CSSClass;
})();
exports.CSSClass = CSSClass;
exports.__esModule = true;
