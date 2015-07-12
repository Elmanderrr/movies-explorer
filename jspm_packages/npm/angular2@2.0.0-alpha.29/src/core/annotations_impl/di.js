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
var annotations_impl_1 = require("../../di/annotations_impl");
var di_1 = require("../../../di");
var Attribute = (function(_super) {
  __extends(Attribute, _super);
  function Attribute(attributeName) {
    _super.call(this);
    this.attributeName = attributeName;
  }
  Object.defineProperty(Attribute.prototype, "token", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  Attribute.prototype.toString = function() {
    return "@Attribute(" + lang_1.stringify(this.attributeName) + ")";
  };
  Attribute = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String])], Attribute);
  return Attribute;
})(annotations_impl_1.DependencyAnnotation);
exports.Attribute = Attribute;
var Query = (function(_super) {
  __extends(Query, _super);
  function Query(_selector, _a) {
    var _b = (_a === void 0 ? {} : _a).descendants,
        descendants = _b === void 0 ? false : _b;
    _super.call(this);
    this._selector = _selector;
    this.descendants = descendants;
  }
  Object.defineProperty(Query.prototype, "selector", {
    get: function() {
      return di_1.resolveForwardRef(this._selector);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Query.prototype, "isVarBindingQuery", {
    get: function() {
      return lang_1.isString(this.selector);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Query.prototype, "varBindings", {
    get: function() {
      return lang_1.StringWrapper.split(this.selector, new RegExp(","));
    },
    enumerable: true,
    configurable: true
  });
  Query.prototype.toString = function() {
    return "@Query(" + lang_1.stringify(this.selector) + ")";
  };
  Query = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object, Object])], Query);
  return Query;
})(annotations_impl_1.DependencyAnnotation);
exports.Query = Query;
exports.__esModule = true;
