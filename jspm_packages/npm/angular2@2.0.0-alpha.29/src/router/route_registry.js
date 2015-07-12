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
var route_recognizer_1 = require("./route_recognizer");
var instruction_1 = require("./instruction");
var collection_1 = require("../facade/collection");
var async_1 = require("../facade/async");
var lang_1 = require("../facade/lang");
var route_config_impl_1 = require("./route_config_impl");
var reflection_1 = require("../reflection/reflection");
var di_1 = require("../../di");
var RouteRegistry = (function() {
  function RouteRegistry(_rootHostComponent) {
    this._rootHostComponent = _rootHostComponent;
    this._rules = new collection_1.Map();
  }
  RouteRegistry.prototype.config = function(parentComponent, config) {
    assertValidConfig(config);
    var recognizer = this._rules.get(parentComponent);
    if (lang_1.isBlank(recognizer)) {
      recognizer = new route_recognizer_1.RouteRecognizer();
      this._rules.set(parentComponent, recognizer);
    }
    if (collection_1.StringMapWrapper.contains(config, 'redirectTo')) {
      recognizer.addRedirect(config['path'], config['redirectTo']);
      return ;
    }
    config = collection_1.StringMapWrapper.merge(config, {'component': normalizeComponentDeclaration(config['component'])});
    var component = config['component'];
    var terminal = recognizer.addConfig(config['path'], config, config['as']);
    if (component['type'] == 'constructor') {
      if (terminal) {
        assertTerminalComponent(component['constructor'], config['path']);
      } else {
        this.configFromComponent(component['constructor']);
      }
    }
  };
  RouteRegistry.prototype.configFromComponent = function(component) {
    var _this = this;
    if (!lang_1.isType(component)) {
      return ;
    }
    if (this._rules.has(component)) {
      return ;
    }
    var annotations = reflection_1.reflector.annotations(component);
    if (lang_1.isPresent(annotations)) {
      for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation instanceof route_config_impl_1.RouteConfig) {
          collection_1.ListWrapper.forEach(annotation.configs, function(config) {
            return _this.config(component, config);
          });
        }
      }
    }
  };
  RouteRegistry.prototype.recognize = function(url, parentComponent) {
    var _this = this;
    var componentRecognizer = this._rules.get(parentComponent);
    if (lang_1.isBlank(componentRecognizer)) {
      return async_1.PromiseWrapper.resolve(null);
    }
    var possibleMatches = componentRecognizer.recognize(url);
    var matchPromises = collection_1.ListWrapper.map(possibleMatches, function(candidate) {
      return _this._completeRouteMatch(candidate);
    });
    return async_1.PromiseWrapper.all(matchPromises).then(function(solutions) {
      var fullSolutions = collection_1.ListWrapper.filter(solutions, function(solution) {
        return lang_1.isPresent(solution);
      });
      if (fullSolutions.length > 0) {
        return mostSpecific(fullSolutions);
      }
      return null;
    });
  };
  RouteRegistry.prototype._completeRouteMatch = function(partialMatch) {
    var _this = this;
    var recognizer = partialMatch.recognizer;
    var handler = recognizer.handler;
    return handler.resolveComponentType().then(function(componentType) {
      _this.configFromComponent(componentType);
      if (partialMatch.unmatchedUrl.length == 0) {
        return new instruction_1.Instruction(componentType, partialMatch.matchedUrl, recognizer);
      }
      return _this.recognize(partialMatch.unmatchedUrl, componentType).then(function(childInstruction) {
        if (lang_1.isBlank(childInstruction)) {
          return null;
        } else {
          return new instruction_1.Instruction(componentType, partialMatch.matchedUrl, recognizer, childInstruction);
        }
      });
    });
  };
  RouteRegistry.prototype.generate = function(linkParams, parentComponent) {
    var normalizedLinkParams = splitAndFlattenLinkParams(linkParams);
    var url = '/';
    var componentCursor = parentComponent;
    if (normalizedLinkParams[0] == '') {
      componentCursor = this._rootHostComponent;
    } else if (normalizedLinkParams[0] != '.') {
      throw new lang_1.BaseException("Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" must start with \"/\" or \"./\"");
    }
    if (normalizedLinkParams[normalizedLinkParams.length - 1] == '') {
      collection_1.ListWrapper.removeLast(normalizedLinkParams);
    }
    if (normalizedLinkParams.length < 2) {
      var msg = "Link \"" + collection_1.ListWrapper.toJSON(linkParams) + "\" must include a route name.";
      throw new lang_1.BaseException(msg);
    }
    for (var i = 1; i < normalizedLinkParams.length; i += 1) {
      var segment = normalizedLinkParams[i];
      if (!lang_1.isString(segment)) {
        throw new lang_1.BaseException("Unexpected segment \"" + segment + "\" in link DSL. Expected a string.");
      }
      var params = null;
      if (i + 1 < normalizedLinkParams.length) {
        var nextSegment = normalizedLinkParams[i + 1];
        if (lang_1.isStringMap(nextSegment)) {
          params = nextSegment;
          i += 1;
        }
      }
      var componentRecognizer = this._rules.get(componentCursor);
      if (lang_1.isBlank(componentRecognizer)) {
        throw new lang_1.BaseException("Could not find route config for \"" + segment + "\".");
      }
      var response = componentRecognizer.generate(segment, params);
      url += response['url'];
      componentCursor = response['nextComponent'];
    }
    return url;
  };
  RouteRegistry = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [Object])], RouteRegistry);
  return RouteRegistry;
})();
exports.RouteRegistry = RouteRegistry;
var ALLOWED_TARGETS = ['component', 'redirectTo'];
function assertValidConfig(config) {
  if (!collection_1.StringMapWrapper.contains(config, 'path')) {
    throw new lang_1.BaseException("Route config should contain a \"path\" property");
  }
  var targets = 0;
  collection_1.ListWrapper.forEach(ALLOWED_TARGETS, function(target) {
    if (collection_1.StringMapWrapper.contains(config, target)) {
      targets += 1;
    }
  });
  if (targets != 1) {
    throw new lang_1.BaseException("Route config should contain exactly one 'component', or 'redirectTo' property");
  }
}
var VALID_COMPONENT_TYPES = ['constructor', 'loader'];
function normalizeComponentDeclaration(config) {
  if (lang_1.isType(config)) {
    return {
      'constructor': config,
      'type': 'constructor'
    };
  } else if (lang_1.isStringMap(config)) {
    if (lang_1.isBlank(config['type'])) {
      throw new lang_1.BaseException("Component declaration when provided as a map should include a 'type' property");
    }
    var componentType = config['type'];
    if (!collection_1.ListWrapper.contains(VALID_COMPONENT_TYPES, componentType)) {
      throw new lang_1.BaseException("Invalid component type '" + componentType + "'");
    }
    return config;
  } else {
    throw new lang_1.BaseException("Component declaration should be either a Map or a Type");
  }
}
function mostSpecific(instructions) {
  var mostSpecificSolution = instructions[0];
  for (var solutionIndex = 1; solutionIndex < instructions.length; solutionIndex++) {
    var solution = instructions[solutionIndex];
    if (solution.specificity > mostSpecificSolution.specificity) {
      mostSpecificSolution = solution;
    }
  }
  return mostSpecificSolution;
}
function assertTerminalComponent(component, path) {
  if (!lang_1.isType(component)) {
    return ;
  }
  var annotations = reflection_1.reflector.annotations(component);
  if (lang_1.isPresent(annotations)) {
    for (var i = 0; i < annotations.length; i++) {
      var annotation = annotations[i];
      if (annotation instanceof route_config_impl_1.RouteConfig) {
        throw new lang_1.BaseException("Child routes are not allowed for \"" + path + "\". Use \"...\" on the parent's route path.");
      }
    }
  }
}
var SLASH = new RegExp('/');
function splitAndFlattenLinkParams(linkParams) {
  return collection_1.ListWrapper.reduce(linkParams, function(accumulation, item) {
    if (lang_1.isString(item)) {
      return collection_1.ListWrapper.concat(accumulation, lang_1.StringWrapper.split(item, SLASH));
    }
    accumulation.push(item);
    return accumulation;
  }, []);
}
exports.__esModule = true;
