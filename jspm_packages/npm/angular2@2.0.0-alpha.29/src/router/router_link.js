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
var decorators_1 = require("../core/annotations/decorators");
var router_1 = require("./router");
var location_1 = require("./location");
var RouterLink = (function() {
  function RouterLink(_router, _location) {
    this._router = _router;
    this._location = _location;
  }
  Object.defineProperty(RouterLink.prototype, "routeParams", {
    set: function(changes) {
      this._routeParams = changes;
      this._navigationHref = this._router.generate(this._routeParams);
      this.visibleHref = this._location.normalizeAbsolutely(this._navigationHref);
    },
    enumerable: true,
    configurable: true
  });
  RouterLink.prototype.onClick = function() {
    this._router.navigate(this._navigationHref);
    return false;
  };
  RouterLink = __decorate([decorators_1.Directive({
    selector: '[router-link]',
    properties: ['routeParams: routerLink'],
    host: {
      '(^click)': 'onClick()',
      '[attr.href]': 'visibleHref'
    }
  }), __metadata('design:paramtypes', [router_1.Router, location_1.Location])], RouterLink);
  return RouterLink;
})();
exports.RouterLink = RouterLink;
exports.__esModule = true;
