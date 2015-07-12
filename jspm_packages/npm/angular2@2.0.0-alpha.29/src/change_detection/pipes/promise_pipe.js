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
var lang_1 = require("../../facade/lang");
var pipe_1 = require("./pipe");
var PromisePipe = (function() {
  function PromisePipe(_ref) {
    this._ref = _ref;
    this._latestValue = null;
    this._latestReturnedValue = null;
  }
  PromisePipe.prototype.supports = function(promise) {
    return lang_1.isPromise(promise);
  };
  PromisePipe.prototype.onDestroy = function() {
    if (lang_1.isPresent(this._sourcePromise)) {
      this._latestValue = null;
      this._latestReturnedValue = null;
      this._sourcePromise = null;
    }
  };
  PromisePipe.prototype.transform = function(promise, args) {
    var _this = this;
    if (args === void 0) {
      args = null;
    }
    if (lang_1.isBlank(this._sourcePromise)) {
      this._sourcePromise = promise;
      promise.then(function(val) {
        if (_this._sourcePromise === promise) {
          _this._updateLatestValue(val);
        }
      });
      return null;
    }
    if (promise !== this._sourcePromise) {
      this._sourcePromise = null;
      return this.transform(promise);
    }
    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    } else {
      this._latestReturnedValue = this._latestValue;
      return pipe_1.WrappedValue.wrap(this._latestValue);
    }
  };
  PromisePipe.prototype._updateLatestValue = function(value) {
    this._latestValue = value;
    this._ref.requestCheck();
  };
  return PromisePipe;
})();
exports.PromisePipe = PromisePipe;
var PromisePipeFactory = (function() {
  function PromisePipeFactory() {}
  PromisePipeFactory.prototype.supports = function(promise) {
    return lang_1.isPromise(promise);
  };
  PromisePipeFactory.prototype.create = function(cdRef) {
    return new PromisePipe(cdRef);
  };
  PromisePipeFactory = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], PromisePipeFactory);
  return PromisePipeFactory;
})();
exports.PromisePipeFactory = PromisePipeFactory;
exports.__esModule = true;
