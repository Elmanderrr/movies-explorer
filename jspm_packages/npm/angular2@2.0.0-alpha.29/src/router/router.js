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
var async_1 = require("../facade/async");
var lang_1 = require("../facade/lang");
var _resolveToTrue = async_1.PromiseWrapper.resolve(true);
var _resolveToFalse = async_1.PromiseWrapper.resolve(false);
var Router = (function() {
  function Router(_registry, _pipeline, parent, hostComponent) {
    this._registry = _registry;
    this._pipeline = _pipeline;
    this.parent = parent;
    this.hostComponent = hostComponent;
    this.navigating = false;
    this.previousUrl = null;
    this._currentInstruction = null;
    this._currentNavigation = _resolveToTrue;
    this._outlet = null;
    this._subject = new async_1.EventEmitter();
  }
  Router.prototype.childRouter = function(hostComponent) {
    return new ChildRouter(this, hostComponent);
  };
  Router.prototype.registerOutlet = function(outlet) {
    this._outlet = outlet;
    if (lang_1.isPresent(this._currentInstruction)) {
      return outlet.activate(this._currentInstruction);
    }
    return _resolveToTrue;
  };
  Router.prototype.config = function(config) {
    var _this = this;
    if (lang_1.isArray(config)) {
      config.forEach(function(configObject) {
        _this._registry.config(_this.hostComponent, configObject);
      });
    } else {
      this._registry.config(this.hostComponent, config);
    }
    return this.renavigate();
  };
  Router.prototype.navigate = function(url) {
    var _this = this;
    if (this.navigating) {
      return this._currentNavigation;
    }
    this.lastNavigationAttempt = url;
    return this._currentNavigation = this.recognize(url).then(function(matchedInstruction) {
      if (lang_1.isBlank(matchedInstruction)) {
        return _resolveToFalse;
      }
      if (lang_1.isPresent(_this._currentInstruction)) {
        matchedInstruction.reuseComponentsFrom(_this._currentInstruction);
      }
      _this._startNavigating();
      var result = _this.commit(matchedInstruction).then(function(_) {
        _this._finishNavigating();
        async_1.ObservableWrapper.callNext(_this._subject, matchedInstruction.accumulatedUrl);
      });
      return async_1.PromiseWrapper.catchError(result, function(err) {
        _this._finishNavigating();
        throw err;
      });
    });
  };
  Router.prototype._startNavigating = function() {
    this.navigating = true;
  };
  Router.prototype._finishNavigating = function() {
    this.navigating = false;
  };
  Router.prototype.subscribe = function(onNext) {
    async_1.ObservableWrapper.subscribe(this._subject, onNext);
  };
  Router.prototype.commit = function(instruction) {
    this._currentInstruction = instruction;
    if (lang_1.isPresent(this._outlet)) {
      return this._outlet.activate(instruction);
    }
    return _resolveToTrue;
  };
  Router.prototype.deactivate = function() {
    if (lang_1.isPresent(this._outlet)) {
      return this._outlet.deactivate();
    }
    return _resolveToTrue;
  };
  Router.prototype.recognize = function(url) {
    return this._registry.recognize(url, this.hostComponent);
  };
  Router.prototype.renavigate = function() {
    var destination = lang_1.isBlank(this.previousUrl) ? this.lastNavigationAttempt : this.previousUrl;
    if (lang_1.isBlank(destination)) {
      return this._currentNavigation;
    }
    return this.navigate(destination);
  };
  Router.prototype.generate = function(linkParams) {
    return this._registry.generate(linkParams, this.hostComponent);
  };
  return Router;
})();
exports.Router = Router;
var RootRouter = (function(_super) {
  __extends(RootRouter, _super);
  function RootRouter(registry, pipeline, location, hostComponent) {
    var _this = this;
    _super.call(this, registry, pipeline, null, hostComponent);
    this._location = location;
    this._location.subscribe(function(change) {
      return _this.navigate(change['url']);
    });
    this._registry.configFromComponent(hostComponent);
    this.navigate(location.path());
  }
  RootRouter.prototype.commit = function(instruction) {
    var _this = this;
    return _super.prototype.commit.call(this, instruction).then(function(_) {
      _this._location.go(instruction.accumulatedUrl);
    });
  };
  return RootRouter;
})(Router);
exports.RootRouter = RootRouter;
var ChildRouter = (function(_super) {
  __extends(ChildRouter, _super);
  function ChildRouter(parent, hostComponent) {
    _super.call(this, parent._registry, parent._pipeline, parent, hostComponent);
    this.parent = parent;
  }
  return ChildRouter;
})(Router);
exports.__esModule = true;
