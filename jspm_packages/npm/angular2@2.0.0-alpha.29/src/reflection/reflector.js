/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var Reflector = (function() {
  function Reflector(reflectionCapabilities) {
    this._typeInfo = new collection_1.Map();
    this._getters = new collection_1.Map();
    this._setters = new collection_1.Map();
    this._methods = new collection_1.Map();
    this.reflectionCapabilities = reflectionCapabilities;
  }
  Reflector.prototype.registerType = function(type, typeInfo) {
    this._typeInfo.set(type, typeInfo);
  };
  Reflector.prototype.registerGetters = function(getters) {
    _mergeMaps(this._getters, getters);
  };
  Reflector.prototype.registerSetters = function(setters) {
    _mergeMaps(this._setters, setters);
  };
  Reflector.prototype.registerMethods = function(methods) {
    _mergeMaps(this._methods, methods);
  };
  Reflector.prototype.factory = function(type) {
    if (this._containsTypeInfo(type)) {
      return this._getTypeInfoField(type, "factory", null);
    } else {
      return this.reflectionCapabilities.factory(type);
    }
  };
  Reflector.prototype.parameters = function(typeOrFunc) {
    if (this._typeInfo.has(typeOrFunc)) {
      return this._getTypeInfoField(typeOrFunc, "parameters", []);
    } else {
      return this.reflectionCapabilities.parameters(typeOrFunc);
    }
  };
  Reflector.prototype.annotations = function(typeOrFunc) {
    if (this._typeInfo.has(typeOrFunc)) {
      return this._getTypeInfoField(typeOrFunc, "annotations", []);
    } else {
      return this.reflectionCapabilities.annotations(typeOrFunc);
    }
  };
  Reflector.prototype.interfaces = function(type) {
    if (this._typeInfo.has(type)) {
      return this._getTypeInfoField(type, "interfaces", []);
    } else {
      return this.reflectionCapabilities.interfaces(type);
    }
  };
  Reflector.prototype.getter = function(name) {
    if (this._getters.has(name)) {
      return this._getters.get(name);
    } else {
      return this.reflectionCapabilities.getter(name);
    }
  };
  Reflector.prototype.setter = function(name) {
    if (this._setters.has(name)) {
      return this._setters.get(name);
    } else {
      return this.reflectionCapabilities.setter(name);
    }
  };
  Reflector.prototype.method = function(name) {
    if (this._methods.has(name)) {
      return this._methods.get(name);
    } else {
      return this.reflectionCapabilities.method(name);
    }
  };
  Reflector.prototype._getTypeInfoField = function(typeOrFunc, key, defaultValue) {
    var res = this._typeInfo.get(typeOrFunc)[key];
    return lang_1.isPresent(res) ? res : defaultValue;
  };
  Reflector.prototype._containsTypeInfo = function(typeOrFunc) {
    return this._typeInfo.has(typeOrFunc);
  };
  return Reflector;
})();
exports.Reflector = Reflector;
function _mergeMaps(target, config) {
  collection_1.StringMapWrapper.forEach(config, function(v, k) {
    return target.set(k, v);
  });
}
exports.__esModule = true;
