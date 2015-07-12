/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ListWrapper } from 'angular2/src/facade/collection';
import { isBlank, isPresent, BaseException, CONST } from 'angular2/src/facade/lang';
import { Injectable } from 'angular2/src/di/decorators';
export let PipeRegistry = class {
    constructor(config) {
        this.config = config;
    }
    get(type, obj, cdRef, existingPipe) {
        if (isPresent(existingPipe) && existingPipe.supports(obj))
            return existingPipe;
        if (isPresent(existingPipe))
            existingPipe.onDestroy();
        var factories = this._getListOfFactories(type, obj);
        var factory = this._getMatchingFactory(factories, type, obj);
        return factory.create(cdRef);
    }
    _getListOfFactories(type, obj) {
        var listOfFactories = this.config[type];
        if (isBlank(listOfFactories)) {
            throw new BaseException(`Cannot find '${type}' pipe supporting object '${obj}'`);
        }
        return listOfFactories;
    }
    _getMatchingFactory(listOfFactories, type, obj) {
        var matchingFactory = ListWrapper.find(listOfFactories, pipeFactory => pipeFactory.supports(obj));
        if (isBlank(matchingFactory)) {
            throw new BaseException(`Cannot find '${type}' pipe supporting object '${obj}'`);
        }
        return matchingFactory;
    }
};
PipeRegistry = __decorate([
    Injectable(),
    CONST(), 
    __metadata('design:paramtypes', [Object])
], PipeRegistry);
//# sourceMappingURL=pipe_registry.js.map