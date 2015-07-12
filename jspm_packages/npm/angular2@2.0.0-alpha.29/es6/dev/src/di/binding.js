/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type, isBlank, isPresent, CONST, CONST_EXPR, BaseException, stringify, isArray } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { reflector } from 'angular2/src/reflection/reflection';
import { Key } from './key';
import { Inject, Injectable, Visibility, Optional, unbounded, DependencyAnnotation } from './annotations_impl';
import { NoAnnotationError } from './exceptions';
import { resolveForwardRef } from './forward_ref';
/**
 * @private
 */
export class Dependency {
    constructor(key, optional, visibility, properties) {
        this.key = key;
        this.optional = optional;
        this.visibility = visibility;
        this.properties = properties;
    }
    static fromKey(key) {
        return new Dependency(key, false, _defaulVisiblity(key.token), []);
    }
}
const _EMPTY_LIST = CONST_EXPR([]);
/**
 * Describes how the {@link Injector} should instantiate a given token.
 *
 * See {@link bind}.
 *
 * ## Example
 *
 * ```javascript
 * var injector = Injector.resolveAndCreate([
 *   new Binding(String, { toValue: 'Hello' })
 * ]);
 *
 * expect(injector.get(String)).toEqual('Hello');
 * ```
 *
 * @exportedAs angular2/di
 */
export let Binding = class {
    constructor(token, { toClass, toValue, toAlias, toFactory, deps }) {
        this.token = token;
        this.toClass = toClass;
        this.toValue = toValue;
        this.toAlias = toAlias;
        this.toFactory = toFactory;
        this.dependencies = deps;
    }
    /**
     * Converts the {@link Binding} into {@link ResolvedBinding}.
     *
     * {@link Injector} internally only uses {@link ResolvedBinding}, {@link Binding} contains
     * convenience binding syntax.
     */
    resolve() {
        var factoryFn;
        var resolvedDeps;
        if (isPresent(this.toClass)) {
            var toClass = resolveForwardRef(this.toClass);
            factoryFn = reflector.factory(toClass);
            resolvedDeps = _dependenciesFor(toClass);
        }
        else if (isPresent(this.toAlias)) {
            factoryFn = (aliasInstance) => aliasInstance;
            resolvedDeps = [Dependency.fromKey(Key.get(this.toAlias))];
        }
        else if (isPresent(this.toFactory)) {
            factoryFn = this.toFactory;
            resolvedDeps = _constructDependencies(this.toFactory, this.dependencies);
        }
        else {
            factoryFn = () => this.toValue;
            resolvedDeps = _EMPTY_LIST;
        }
        return new ResolvedBinding(Key.get(this.token), factoryFn, resolvedDeps);
    }
};
Binding = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object, Object])
], Binding);
/**
 * An internal resolved representation of a {@link Binding} used by the {@link Injector}.
 *
 * A {@link Binding} is resolved when it has a factory function. Binding to a class, alias, or
 * value, are just convenience methods, as {@link Injector} only operates on calling factory
 * functions.
 *
 * @exportedAs angular2/di
 */
export class ResolvedBinding {
    constructor(
        /**
         * A key, usually a `Type`.
         */
        key, 
        /**
         * Factory function which can return an instance of an object represented by a key.
         */
        factory, 
        /**
         * Arguments (dependencies) to the `factory` function.
         */
        dependencies) {
        this.key = key;
        this.factory = factory;
        this.dependencies = dependencies;
    }
}
/**
 * Provides an API for imperatively constructing {@link Binding}s.
 *
 * This is only relevant for JavaScript. See {@link BindingBuilder}.
 *
 * ## Example
 *
 * ```javascript
 * bind(MyInterface).toClass(MyClass)
 *
 * ```
 *
 * @exportedAs angular2/di
 */
export function bind(token) {
    return new BindingBuilder(token);
}
/**
 * Helper class for the {@link bind} function.
 *
 * @exportedAs angular2/di
 */
export class BindingBuilder {
    constructor(token) {
        this.token = token;
    }
    /**
     * Binds an interface to an implementation / subclass.
     *
     * ## Example
     *
     * Because `toAlias` and `toClass` are often confused, the example contains both use cases for
     * easy comparison.
     *
     * ```javascript
     *
     * class Vehicle {}
     *
     * class Car extends Vehicle {}
     *
     * var injectorClass = Injector.resolveAndCreate([
     *   Car,
     *   bind(Vehicle).toClass(Car)
     * ]);
     * var injectorAlias = Injector.resolveAndCreate([
     *   Car,
     *   bind(Vehicle).toAlias(Car)
     * ]);
     *
     * expect(injectorClass.get(Vehicle)).not.toBe(injectorClass.get(Car));
     * expect(injectorClass.get(Vehicle) instanceof Car).toBe(true);
     *
     * expect(injectorAlias.get(Vehicle)).toBe(injectorAlias.get(Car));
     * expect(injectorAlias.get(Vehicle) instanceof Car).toBe(true);
     * ```
     */
    toClass(type) { return new Binding(this.token, { toClass: type }); }
    /**
     * Binds a key to a value.
     *
     * ## Example
     *
     * ```javascript
     * var injector = Injector.resolveAndCreate([
     *   bind(String).toValue('Hello')
     * ]);
     *
     * expect(injector.get(String)).toEqual('Hello');
     * ```
     */
    toValue(value) { return new Binding(this.token, { toValue: value }); }
    /**
     * Binds a key to the alias for an existing key.
     *
     * An alias means that we will return the same instance as if the alias token was used. (This is
     * in contrast to `toClass` where a separet instance of `toClass` will be returned.)
     *
     * ## Example
     *
     * Becuse `toAlias` and `toClass` are often confused, the example contains both use cases for easy
     * comparison.
     *
     * ```javascript
     *
     * class Vehicle {}
     *
     * class Car extends Vehicle {}
     *
     * var injectorAlias = Injector.resolveAndCreate([
     *   Car,
     *   bind(Vehicle).toAlias(Car)
     * ]);
     * var injectorClass = Injector.resolveAndCreate([
     *   Car,
     *   bind(Vehicle).toClass(Car)
     * ]);
     *
     * expect(injectorAlias.get(Vehicle)).toBe(injectorAlias.get(Car));
     * expect(injectorAlias.get(Vehicle) instanceof Car).toBe(true);
     *
     * expect(injectorClass.get(Vehicle)).not.toBe(injectorClass.get(Car));
     * expect(injectorClass.get(Vehicle) instanceof Car).toBe(true);
     * ```
     */
    toAlias(aliasToken) {
        if (isBlank(aliasToken)) {
            throw new BaseException(`Can not alias ${stringify(this.token)} to a blank value!`);
        }
        return new Binding(this.token, { toAlias: aliasToken });
    }
    /**
     * Binds a key to a function which computes the value.
     *
     * ## Example
     *
     * ```javascript
     * var injector = Injector.resolveAndCreate([
     *   bind(Number).toFactory(() => { return 1+2; }),
     *   bind(String).toFactory((v) => { return "Value: " + v; }, [Number])
     * ]);
     *
     * expect(injector.get(Number)).toEqual(3);
     * expect(injector.get(String)).toEqual('Value: 3');
     * ```
     */
    toFactory(factoryFunction, dependencies) {
        return new Binding(this.token, { toFactory: factoryFunction, deps: dependencies });
    }
}
function _constructDependencies(factoryFunction, dependencies) {
    if (isBlank(dependencies)) {
        return _dependenciesFor(factoryFunction);
    }
    else {
        var params = ListWrapper.map(dependencies, (t) => [t]);
        return ListWrapper.map(dependencies, (t) => _extractToken(factoryFunction, t, params));
    }
}
function _dependenciesFor(typeOrFunc) {
    var params = reflector.parameters(typeOrFunc);
    if (isBlank(params))
        return [];
    if (ListWrapper.any(params, (p) => isBlank(p))) {
        throw new NoAnnotationError(typeOrFunc, params);
    }
    return ListWrapper.map(params, (p) => _extractToken(typeOrFunc, p, params));
}
function _extractToken(typeOrFunc, annotations /*List<any> | any*/, params) {
    var depProps = [];
    var token = null;
    var optional = false;
    if (!isArray(annotations)) {
        return _createDependency(annotations, optional, _defaulVisiblity(annotations), depProps);
    }
    var visibility = null;
    var defaultVisibility = unbounded;
    for (var i = 0; i < annotations.length; ++i) {
        var paramAnnotation = annotations[i];
        if (paramAnnotation instanceof Type) {
            token = paramAnnotation;
            defaultVisibility = _defaulVisiblity(token);
        }
        else if (paramAnnotation instanceof Inject) {
            token = paramAnnotation.token;
        }
        else if (paramAnnotation instanceof Optional) {
            optional = true;
        }
        else if (paramAnnotation instanceof Visibility) {
            visibility = paramAnnotation;
        }
        else if (paramAnnotation instanceof DependencyAnnotation) {
            if (isPresent(paramAnnotation.token)) {
                token = paramAnnotation.token;
            }
            depProps.push(paramAnnotation);
        }
    }
    if (isBlank(visibility)) {
        visibility = defaultVisibility;
    }
    token = resolveForwardRef(token);
    if (isPresent(token)) {
        return _createDependency(token, optional, visibility, depProps);
    }
    else {
        throw new NoAnnotationError(typeOrFunc, params);
    }
}
function _defaulVisiblity(typeOrFunc) {
    try {
        if (!(typeOrFunc instanceof Type))
            return unbounded;
        var f = ListWrapper.filter(reflector.annotations(typeOrFunc), s => s instanceof Injectable);
        return f.length === 0 ? unbounded : f[0].visibility;
    }
    catch (e) {
        return unbounded;
    }
}
function _createDependency(token, optional, visibility, depProps) {
    return new Dependency(Key.get(token), optional, visibility, depProps);
}
//# sourceMappingURL=binding.js.map