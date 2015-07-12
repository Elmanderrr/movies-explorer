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
var di_1 = require("../../../di");
var dom_adapter_1 = require("../../dom/dom_adapter");
var collection_1 = require("../../facade/collection");
var lang_1 = require("../../facade/lang");
var getTestabilityModule = require("./get_testability");
var Testability = (function() {
  function Testability() {
    this._pendingCount = 0;
    this._callbacks = [];
  }
  Testability.prototype.increaseCount = function(delta) {
    if (delta === void 0) {
      delta = 1;
    }
    this._pendingCount += delta;
    if (this._pendingCount < 0) {
      throw new lang_1.BaseException('pending async requests below zero');
    } else if (this._pendingCount == 0) {
      this._runCallbacks();
    }
    return this._pendingCount;
  };
  Testability.prototype._runCallbacks = function() {
    while (this._callbacks.length !== 0) {
      collection_1.ListWrapper.removeLast(this._callbacks)();
    }
  };
  Testability.prototype.whenStable = function(callback) {
    this._callbacks.push(callback);
    if (this._pendingCount === 0) {
      this._runCallbacks();
    }
  };
  Testability.prototype.getPendingCount = function() {
    return this._pendingCount;
  };
  Testability.prototype.findBindings = function(using, binding, exactMatch) {
    return [];
  };
  Testability = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], Testability);
  return Testability;
})();
exports.Testability = Testability;
var TestabilityRegistry = (function() {
  function TestabilityRegistry() {
    this._applications = new collection_1.Map();
    getTestabilityModule.GetTestability.addToWindow(this);
  }
  TestabilityRegistry.prototype.registerApplication = function(token, testability) {
    this._applications.set(token, testability);
  };
  TestabilityRegistry.prototype.findTestabilityInTree = function(elem) {
    if (elem == null) {
      return null;
    }
    if (this._applications.has(elem)) {
      return this._applications.get(elem);
    }
    if (dom_adapter_1.DOM.isShadowRoot(elem)) {
      return this.findTestabilityInTree(dom_adapter_1.DOM.getHost(elem));
    }
    return this.findTestabilityInTree(dom_adapter_1.DOM.parentElement(elem));
  };
  TestabilityRegistry = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], TestabilityRegistry);
  return TestabilityRegistry;
})();
exports.TestabilityRegistry = TestabilityRegistry;
exports.__esModule = true;
