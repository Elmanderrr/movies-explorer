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
var static_request_1 = require("../static_request");
var enums_1 = require("../enums");
var interfaces_1 = require("../interfaces");
var async_1 = require("../../facade/async");
var lang_1 = require("../../facade/lang");
var lang_2 = require("../../facade/lang");
var MockConnection = (function() {
  function MockConnection(req) {
    this.response = new async_1.EventEmitter();
    this.readyState = enums_1.ReadyStates.OPEN;
    this.request = req;
  }
  MockConnection.prototype.dispose = function() {
    if (this.readyState !== enums_1.ReadyStates.DONE) {
      this.readyState = enums_1.ReadyStates.CANCELLED;
    }
  };
  MockConnection.prototype.mockRespond = function(res) {
    if (this.readyState === enums_1.ReadyStates.DONE || this.readyState === enums_1.ReadyStates.CANCELLED) {
      throw new lang_2.BaseException('Connection has already been resolved');
    }
    this.readyState = enums_1.ReadyStates.DONE;
    async_1.ObservableWrapper.callNext(this.response, res);
    async_1.ObservableWrapper.callReturn(this.response);
  };
  MockConnection.prototype.mockDownload = function(res) {};
  MockConnection.prototype.mockError = function(err) {
    this.readyState = enums_1.ReadyStates.DONE;
    async_1.ObservableWrapper.callThrow(this.response, err);
    async_1.ObservableWrapper.callReturn(this.response);
  };
  MockConnection = __decorate([lang_2.IMPLEMENTS(interfaces_1.Connection), __metadata('design:paramtypes', [static_request_1.Request])], MockConnection);
  return MockConnection;
})();
exports.MockConnection = MockConnection;
var MockBackend = (function() {
  function MockBackend() {
    var _this = this;
    this.connectionsArray = [];
    this.connections = new async_1.EventEmitter();
    async_1.ObservableWrapper.subscribe(this.connections, function(connection) {
      return _this.connectionsArray.push(connection);
    });
    this.pendingConnections = new async_1.EventEmitter();
  }
  MockBackend.prototype.verifyNoPendingRequests = function() {
    var pending = 0;
    async_1.ObservableWrapper.subscribe(this.pendingConnections, function(c) {
      return pending++;
    });
    if (pending > 0)
      throw new lang_2.BaseException(pending + " pending connections to be resolved");
  };
  MockBackend.prototype.resolveAllConnections = function() {
    async_1.ObservableWrapper.subscribe(this.connections, function(c) {
      return c.readyState = 4;
    });
  };
  MockBackend.prototype.createConnection = function(req) {
    if (!lang_1.isPresent(req) || !(req instanceof static_request_1.Request)) {
      throw new lang_2.BaseException("createConnection requires an instance of Request, got " + req);
    }
    var connection = new MockConnection(req);
    async_1.ObservableWrapper.callNext(this.connections, connection);
    return connection;
  };
  MockBackend = __decorate([di_1.Injectable(), lang_2.IMPLEMENTS(interfaces_1.ConnectionBackend), __metadata('design:paramtypes', [])], MockBackend);
  return MockBackend;
})();
exports.MockBackend = MockBackend;
exports.__esModule = true;
