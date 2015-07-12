/* */ 
"format cjs";
import { isPresent } from 'angular2/src/facade/lang';
import { Map, StringMapWrapper } from 'angular2/src/facade/collection';
export class Reflector {
    constructor(reflectionCapabilities) {
        this._typeInfo = new Map();
        this._getters = new Map();
        this._setters = new Map();
        this._methods = new Map();
        this.reflectionCapabilities = reflectionCapabilities;
    }
    registerType(type, typeInfo) {
        this._typeInfo.set(type, typeInfo);
    }
    registerGetters(getters) {
        _mergeMaps(this._getters, getters);
    }
    registerSetters(setters) {
        _mergeMaps(this._setters, setters);
    }
    registerMethods(methods) {
        _mergeMaps(this._methods, methods);
    }
    factory(type) {
        if (this._containsTypeInfo(type)) {
            return this._getTypeInfoField(type, "factory", null);
        }
        else {
            return this.reflectionCapabilities.factory(type);
        }
    }
    parameters(typeOrFunc) {
        if (this._typeInfo.has(typeOrFunc)) {
            return this._getTypeInfoField(typeOrFunc, "parameters", []);
        }
        else {
            return this.reflectionCapabilities.parameters(typeOrFunc);
        }
    }
    annotations(typeOrFunc) {
        if (this._typeInfo.has(typeOrFunc)) {
            return this._getTypeInfoField(typeOrFunc, "annotations", []);
        }
        else {
            return this.reflectionCapabilities.annotations(typeOrFunc);
        }
    }
    interfaces(type) {
        if (this._typeInfo.has(type)) {
            return this._getTypeInfoField(type, "interfaces", []);
        }
        else {
            return this.reflectionCapabilities.interfaces(type);
        }
    }
    getter(name) {
        if (this._getters.has(name)) {
            return this._getters.get(name);
        }
        else {
            return this.reflectionCapabilities.getter(name);
        }
    }
    setter(name) {
        if (this._setters.has(name)) {
            return this._setters.get(name);
        }
        else {
            return this.reflectionCapabilities.setter(name);
        }
    }
    method(name) {
        if (this._methods.has(name)) {
            return this._methods.get(name);
        }
        else {
            return this.reflectionCapabilities.method(name);
        }
    }
    _getTypeInfoField(typeOrFunc, key, defaultValue) {
        var res = this._typeInfo.get(typeOrFunc)[key];
        return isPresent(res) ? res : defaultValue;
    }
    _containsTypeInfo(typeOrFunc) { return this._typeInfo.has(typeOrFunc); }
}
function _mergeMaps(target, config) {
    StringMapWrapper.forEach(config, (v, k) => target.set(k, v));
}
//# sourceMappingURL=reflector.js.map