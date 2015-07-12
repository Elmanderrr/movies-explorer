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
var lang_1 = require("../facade/lang");
var Inject = (function() {
  function Inject(token) {
    this.token = token;
  }
  Inject.prototype.toString = function() {
    return "@Inject(" + lang_1.stringify(this.token) + ")";
  };
  Inject = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Inject);
  return Inject;
})();
exports.Inject = Inject;
var Optional = (function() {
  function Optional() {}
  Optional.prototype.toString = function() {
    return "@Optional()";
  };
  Optional = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], Optional);
  return Optional;
})();
exports.Optional = Optional;
var DependencyAnnotation = (function() {
  function DependencyAnnotation() {}
  Object.defineProperty(DependencyAnnotation.prototype, "token", {
    get: function() {
      return null;
    },
    enumerable: true,
    configurable: true
  });
  DependencyAnnotation = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], DependencyAnnotation);
  return DependencyAnnotation;
})();
exports.DependencyAnnotation = DependencyAnnotation;
var Injectable = (function() {
  function Injectable(visibility) {
    if (visibility === void 0) {
      visibility = exports.unbounded;
    }
    this.visibility = visibility;
  }
  Injectable = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Visibility])], Injectable);
  return Injectable;
})();
exports.Injectable = Injectable;
var Visibility = (function() {
  function Visibility(depth, crossBoundaries, _includeSelf) {
    this.depth = depth;
    this.crossBoundaries = crossBoundaries;
    this._includeSelf = _includeSelf;
  }
  Object.defineProperty(Visibility.prototype, "includeSelf", {
    get: function() {
      return lang_1.isBlank(this._includeSelf) ? false : this._includeSelf;
    },
    enumerable: true,
    configurable: true
  });
  Visibility.prototype.toString = function() {
    return "@Visibility(depth: " + this.depth + ", crossBoundaries: " + this.crossBoundaries + ", includeSelf: " + this.includeSelf + "})";
  };
  Visibility = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Number, Boolean, Boolean])], Visibility);
  return Visibility;
})();
exports.Visibility = Visibility;
var Self = (function(_super) {
  __extends(Self, _super);
  function Self() {
    _super.call(this, 0, false, true);
  }
  Self.prototype.toString = function() {
    return "@Self()";
  };
  Self = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [])], Self);
  return Self;
})(Visibility);
exports.Self = Self;
exports.self = lang_1.CONST_EXPR(new Self());
var Parent = (function(_super) {
  __extends(Parent, _super);
  function Parent(_a) {
    var self = (_a === void 0 ? {} : _a).self;
    _super.call(this, 1, false, self);
  }
  Parent.prototype.toString = function() {
    return "@Parent(self: " + this.includeSelf + "})";
  };
  Parent = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Parent);
  return Parent;
})(Visibility);
exports.Parent = Parent;
var Ancestor = (function(_super) {
  __extends(Ancestor, _super);
  function Ancestor(_a) {
    var self = (_a === void 0 ? {} : _a).self;
    _super.call(this, 999999, false, self);
  }
  Ancestor.prototype.toString = function() {
    return "@Ancestor(self: " + this.includeSelf + "})";
  };
  Ancestor = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Ancestor);
  return Ancestor;
})(Visibility);
exports.Ancestor = Ancestor;
var Unbounded = (function(_super) {
  __extends(Unbounded, _super);
  function Unbounded(_a) {
    var self = (_a === void 0 ? {} : _a).self;
    _super.call(this, 999999, true, self);
  }
  Unbounded.prototype.toString = function() {
    return "@Unbounded(self: " + this.includeSelf + "})";
  };
  Unbounded = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], Unbounded);
  return Unbounded;
})(Visibility);
exports.Unbounded = Unbounded;
exports.unbounded = lang_1.CONST_EXPR(new Unbounded({self: true}));
exports.__esModule = true;
