/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var path_recognizer_1 = require("./path_recognizer");
var async_route_handler_1 = require("./async_route_handler");
var sync_route_handler_1 = require("./sync_route_handler");
var RouteRecognizer = (function() {
  function RouteRecognizer() {
    this.names = new collection_1.Map();
    this.redirects = new collection_1.Map();
    this.matchers = new collection_1.Map();
  }
  RouteRecognizer.prototype.addRedirect = function(path, target) {
    if (path == '/') {
      path = '';
    }
    this.redirects.set(path, target);
  };
  RouteRecognizer.prototype.addConfig = function(path, handlerObj, alias) {
    if (alias === void 0) {
      alias = null;
    }
    var handler = configObjToHandler(handlerObj['component']);
    var recognizer = new path_recognizer_1.PathRecognizer(path, handler);
    collection_1.MapWrapper.forEach(this.matchers, function(matcher, _) {
      if (recognizer.regex.toString() == matcher.regex.toString()) {
        throw new lang_1.BaseException("Configuration '" + path + "' conflicts with existing route '" + matcher.path + "'");
      }
    });
    this.matchers.set(recognizer.regex, recognizer);
    if (lang_1.isPresent(alias)) {
      this.names.set(alias, recognizer);
    }
    return recognizer.terminal;
  };
  RouteRecognizer.prototype.recognize = function(url) {
    var solutions = [];
    if (url.length > 0 && url[url.length - 1] == '/') {
      url = url.substring(0, url.length - 1);
    }
    collection_1.MapWrapper.forEach(this.redirects, function(target, path) {
      if (path == '/' || path == '') {
        if (path == url) {
          url = target;
        }
      } else if (url.startsWith(path)) {
        url = target + url.substring(path.length);
      }
    });
    collection_1.MapWrapper.forEach(this.matchers, function(pathRecognizer, regex) {
      var match;
      if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(regex, url))) {
        var matchedUrl = '/';
        var unmatchedUrl = '';
        if (url != '/') {
          matchedUrl = match[0];
          unmatchedUrl = url.substring(match[0].length);
        }
        solutions.push(new RouteMatch(pathRecognizer, matchedUrl, unmatchedUrl));
      }
    });
    return solutions;
  };
  RouteRecognizer.prototype.hasRoute = function(name) {
    return this.names.has(name);
  };
  RouteRecognizer.prototype.generate = function(name, params) {
    var pathRecognizer = this.names.get(name);
    if (lang_1.isBlank(pathRecognizer)) {
      return null;
    }
    var url = pathRecognizer.generate(params);
    return {
      url: url,
      'nextComponent': pathRecognizer.handler.componentType
    };
  };
  return RouteRecognizer;
})();
exports.RouteRecognizer = RouteRecognizer;
var RouteMatch = (function() {
  function RouteMatch(recognizer, matchedUrl, unmatchedUrl) {
    this.recognizer = recognizer;
    this.matchedUrl = matchedUrl;
    this.unmatchedUrl = unmatchedUrl;
  }
  RouteMatch.prototype.params = function() {
    return this.recognizer.parseParams(this.matchedUrl);
  };
  return RouteMatch;
})();
exports.RouteMatch = RouteMatch;
function configObjToHandler(config) {
  if (lang_1.isType(config)) {
    return new sync_route_handler_1.SyncRouteHandler(config);
  } else if (lang_1.isStringMap(config)) {
    if (lang_1.isBlank(config['type'])) {
      throw new lang_1.BaseException("Component declaration when provided as a map should include a 'type' property");
    }
    var componentType = config['type'];
    if (componentType == 'constructor') {
      return new sync_route_handler_1.SyncRouteHandler(config['constructor']);
    } else if (componentType == 'loader') {
      return new async_route_handler_1.AsyncRouteHandler(config['loader']);
    } else {
      throw new lang_1.BaseException("oops");
    }
  }
  throw new lang_1.BaseException("Unexpected component \"" + config + "\".");
}
exports.__esModule = true;
