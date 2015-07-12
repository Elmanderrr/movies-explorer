import {Type, isPresent, stringify, BaseException} from 'angular2/src/facade/lang';
import {
  List,
  ListWrapper,
  Map,
  MapWrapper,
  StringMap,
  StringMapWrapper
} from 'angular2/src/facade/collection';
import {SetterFn, GetterFn, MethodFn} from './types';
import {PlatformReflectionCapabilities} from './platform_reflection_capabilities';
export {SetterFn, GetterFn, MethodFn} from './types';
export {PlatformReflectionCapabilities} from './platform_reflection_capabilities';

export class Reflector {
  _typeInfo: Map<Type, any>;
  _getters: Map<string, GetterFn>;
  _setters: Map<string, SetterFn>;
  _methods: Map<string, MethodFn>;
  reflectionCapabilities: PlatformReflectionCapabilities;

  constructor(reflectionCapabilities: PlatformReflectionCapabilities) {
    this._typeInfo = new Map();
    this._getters = new Map();
    this._setters = new Map();
    this._methods = new Map();
    this.reflectionCapabilities = reflectionCapabilities;
  }

  registerType(type: Type, typeInfo: StringMap<string, any>): void {
    this._typeInfo.set(type, typeInfo);
  }

  registerGetters(getters: StringMap<string, GetterFn>): void {
    _mergeMaps(this._getters, getters);
  }

  registerSetters(setters: StringMap<string, SetterFn>): void {
    _mergeMaps(this._setters, setters);
  }

  registerMethods(methods: StringMap<string, MethodFn>): void {
    _mergeMaps(this._methods, methods);
  }

  factory(type: Type): Function {
    if (this._containsTypeInfo(type)) {
      return this._getTypeInfoField(type, "factory", null);
    } else {
      return this.reflectionCapabilities.factory(type);
    }
  }

  parameters(typeOrFunc): List<any> {
    if (this._typeInfo.has(typeOrFunc)) {
      return this._getTypeInfoField(typeOrFunc, "parameters", []);
    } else {
      return this.reflectionCapabilities.parameters(typeOrFunc);
    }
  }

  annotations(typeOrFunc): List<any> {
    if (this._typeInfo.has(typeOrFunc)) {
      return this._getTypeInfoField(typeOrFunc, "annotations", []);
    } else {
      return this.reflectionCapabilities.annotations(typeOrFunc);
    }
  }

  interfaces(type): List<any> {
    if (this._typeInfo.has(type)) {
      return this._getTypeInfoField(type, "interfaces", []);
    } else {
      return this.reflectionCapabilities.interfaces(type);
    }
  }

  getter(name: string): GetterFn {
    if (this._getters.has(name)) {
      return this._getters.get(name);
    } else {
      return this.reflectionCapabilities.getter(name);
    }
  }

  setter(name: string): SetterFn {
    if (this._setters.has(name)) {
      return this._setters.get(name);
    } else {
      return this.reflectionCapabilities.setter(name);
    }
  }

  method(name: string): MethodFn {
    if (this._methods.has(name)) {
      return this._methods.get(name);
    } else {
      return this.reflectionCapabilities.method(name);
    }
  }

  _getTypeInfoField(typeOrFunc, key, defaultValue) {
    var res = this._typeInfo.get(typeOrFunc)[key];
    return isPresent(res) ? res : defaultValue;
  }

  _containsTypeInfo(typeOrFunc) { return this._typeInfo.has(typeOrFunc); }
}

function _mergeMaps(target: Map<any, any>, config: StringMap<string, Function>): void {
  StringMapWrapper.forEach(config, (v, k) => target.set(k, v));
}
