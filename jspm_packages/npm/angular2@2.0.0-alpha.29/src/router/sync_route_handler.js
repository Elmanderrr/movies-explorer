/* */ 
'use strict';
var async_1 = require("../facade/async");
var SyncRouteHandler = (function() {
  function SyncRouteHandler(componentType) {
    this.componentType = componentType;
    this._resolvedComponent = null;
    this._resolvedComponent = async_1.PromiseWrapper.resolve(componentType);
  }
  SyncRouteHandler.prototype.resolveComponentType = function() {
    return this._resolvedComponent;
  };
  return SyncRouteHandler;
})();
exports.SyncRouteHandler = SyncRouteHandler;
exports.__esModule = true;
