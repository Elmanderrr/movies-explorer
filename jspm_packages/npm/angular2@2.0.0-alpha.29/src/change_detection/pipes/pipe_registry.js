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
var collection_1 = require("../../facade/collection");
var lang_1 = require("../../facade/lang");
var decorators_1 = require("../../di/decorators");
var PipeRegistry = (function() {
  function PipeRegistry(config) {
    this.config = config;
  }
  PipeRegistry.prototype.get = function(type, obj, cdRef, existingPipe) {
    if (lang_1.isPresent(existingPipe) && existingPipe.supports(obj))
      return existingPipe;
    if (lang_1.isPresent(existingPipe))
      existingPipe.onDestroy();
    var factories = this._getListOfFactories(type, obj);
    var factory = this._getMatchingFactory(factories, type, obj);
    return factory.create(cdRef);
  };
  PipeRegistry.prototype._getListOfFactories = function(type, obj) {
    var listOfFactories = this.config[type];
    if (lang_1.isBlank(listOfFactories)) {
      throw new lang_1.BaseException("Cannot find '" + type + "' pipe supporting object '" + obj + "'");
    }
    return listOfFactories;
  };
  PipeRegistry.prototype._getMatchingFactory = function(listOfFactories, type, obj) {
    var matchingFactory = collection_1.ListWrapper.find(listOfFactories, function(pipeFactory) {
      return pipeFactory.supports(obj);
    });
    if (lang_1.isBlank(matchingFactory)) {
      throw new lang_1.BaseException("Cannot find '" + type + "' pipe supporting object '" + obj + "'");
    }
    return matchingFactory;
  };
  PipeRegistry = __decorate([decorators_1.Injectable(), lang_1.CONST(), __metadata('design:paramtypes', [Object])], PipeRegistry);
  return PipeRegistry;
})();
exports.PipeRegistry = PipeRegistry;
exports.__esModule = true;
