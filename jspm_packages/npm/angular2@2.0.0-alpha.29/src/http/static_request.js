/* */ 
'use strict';
var headers_1 = require("./headers");
var lang_1 = require("../facade/lang");
var Request = (function() {
  function Request(requestOptions) {
    this.url = requestOptions.url;
    this._body = requestOptions.body;
    this.method = requestOptions.method;
    this.mode = requestOptions.mode;
    this.credentials = requestOptions.credentials;
    this.headers = new headers_1.Headers(requestOptions.headers);
    this.cache = requestOptions.cache;
  }
  Request.prototype.text = function() {
    return lang_1.isPresent(this._body) ? this._body.toString() : '';
  };
  return Request;
})();
exports.Request = Request;
exports.__esModule = true;
