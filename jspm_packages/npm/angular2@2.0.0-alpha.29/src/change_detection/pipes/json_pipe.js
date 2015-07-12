/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
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
var JsonPipe = (function(_super) {
  __extends(JsonPipe, _super);
  function JsonPipe() {
    _super.apply(this, arguments);
  }
  JsonPipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    return lang_1.Json.stringify(value);
  };
  JsonPipe.prototype.create = function(cdRef) {
    return this;
  };
  JsonPipe = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], JsonPipe);
  return JsonPipe;
})(pipe_1.BasePipe);
exports.JsonPipe = JsonPipe;
exports.__esModule = true;
