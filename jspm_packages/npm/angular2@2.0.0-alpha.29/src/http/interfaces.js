/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var ConnectionBackend = (function() {
  function ConnectionBackend() {}
  ConnectionBackend.prototype.createConnection = function(request) {
    throw new lang_1.BaseException('Abstract!');
  };
  return ConnectionBackend;
})();
exports.ConnectionBackend = ConnectionBackend;
var Connection = (function() {
  function Connection() {}
  Connection.prototype.dispose = function() {
    throw new lang_1.BaseException('Abstract!');
  };
  return Connection;
})();
exports.Connection = Connection;
exports.__esModule = true;
