/// <reference path="../../../../../angular2/typings/es6-promise/es6-promise.d.ts" />
import { ResolvedBinding, Binding } from './binding';
import { Type } from 'angular2/src/facade/lang';
export declare const undefinedValue: Object;
export declare const PUBLIC: number;
export declare const PRIVATE: number;
export declare const PUBLIC_AND_PRIVATE: number;
export interface ProtoInjectorStrategy {
    getBindingAtIndex(index: number): ResolvedBinding;
    createInjectorStrategy(inj: Injector): InjectorStrategy;
}
export declare class ProtoInjectorInlineStrategy implements ProtoInjectorStrategy {
    binding0: ResolvedBinding;
    binding1: ResolvedBinding;
    binding2: ResolvedBinding;
    binding3: ResolvedBinding;
    binding4: ResolvedBinding;
    binding5: ResolvedBinding;
    binding6: ResolvedBinding;
    binding7: ResolvedBinding;
    binding8: ResolvedBinding;
    binding9: ResolvedBinding;
    keyId0: number;
    keyId1: number;
    keyId2: number;
    keyId3: number;
    keyId4: number;
    keyId5: number;
    keyId6: number;
    keyId7: number;
    keyId8: number;
    keyId9: number;
    visibility0: number;
    visibility1: number;
    visibility2: number;
    visibility3: number;
    visibility4: number;
    visibility5: number;
    visibility6: number;
    visibility7: number;
    visibility8: number;
    visibility9: number;
    constructor(protoEI: ProtoInjector, bwv: BindingWithVisibility[]);
    getBindingAtIndex(index: number): any;
    createInjectorStrategy(injector: Injector): InjectorStrategy;
}
export declare class ProtoInjectorDynamicStrategy implements ProtoInjectorStrategy {
    bindings: ResolvedBinding[];
    keyIds: number[];
    visibilities: number[];
    constructor(protoInj: ProtoInjector, bwv: BindingWithVisibility[]);
    getBindingAtIndex(index: number): any;
    createInjectorStrategy(ei: Injector): InjectorStrategy;
}
export declare class ProtoInjector {
    distanceToParent: number;
    _strategy: ProtoInjectorStrategy;
    constructor(bwv: BindingWithVisibility[], distanceToParent: number);
    getBindingAtIndex(index: number): any;
}
export interface InjectorStrategy {
    getObjByKeyId(keyId: number, visibility: number): any;
    getObjAtIndex(index: number): any;
    getMaxNumberOfObjects(): number;
    attach(parent: Injector, isBoundary: boolean): void;
    hydrate(): void;
    dehydrate(): void;
}
export declare class InjectorInlineStrategy implements InjectorStrategy {
    injector: Injector;
    protoStrategy: ProtoInjectorInlineStrategy;
    obj0: any;
    obj1: any;
    obj2: any;
    obj3: any;
    obj4: any;
    obj5: any;
    obj6: any;
    obj7: any;
    obj8: any;
    obj9: any;
    constructor(injector: Injector, protoStrategy: ProtoInjectorInlineStrategy);
    hydrate(): void;
    attach(parent: Injector, isBoundary: boolean): void;
    dehydrate(): void;
    getObjByKeyId(keyId: number, visibility: number): any;
    getObjAtIndex(index: number): any;
    getMaxNumberOfObjects(): number;
}
export declare class InjectorDynamicStrategy implements InjectorStrategy {
    protoStrategy: ProtoInjectorDynamicStrategy;
    injector: Injector;
    objs: any[];
    constructor(protoStrategy: ProtoInjectorDynamicStrategy, injector: Injector);
    hydrate(): void;
    attach(parent: Injector, isBoundary: boolean): void;
    dehydrate(): void;
    getObjByKeyId(keyId: number, visibility: number): any;
    getObjAtIndex(index: number): any;
    getMaxNumberOfObjects(): number;
}
export declare class BindingWithVisibility {
    binding: ResolvedBinding;
    visibility: number;
    constructor(binding: ResolvedBinding, visibility: number);
    getKeyId(): number;
}
/**
 * A dependency injection container used for resolving dependencies.
 *
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 * In typical use, application code asks for the dependencies in the constructor and they are
 * resolved by the `Injector`.
 *
 * ## Example:
 *
 * Suppose that we want to inject an `Engine` into class `Car`, we would define it like this:
 *
 * ```javascript
 * class Engine {
 * }
 *
 * class Car {
 *   constructor(@Inject(Engine) engine) {
 *   }
 * }
 *
 * ```
 *
 * Next we need to write the code that creates and instantiates the `Injector`. We then ask for the
 * `root` object, `Car`, so that the `Injector` can recursively build all of that object's
 *dependencies.
 *
 * ```javascript
 * main() {
 *   var injector = Injector.resolveAndCreate([Car, Engine]);
 *
 *   // Get a reference to the `root` object, which will recursively instantiate the tree.
 *   var car = injector.get(Car);
 * }
 * ```
 * Notice that we don't use the `new` operator because we explicitly want to have the `Injector`
 * resolve all of the object's dependencies automatically.
 *
 * @exportedAs angular2/di
 */
export declare class Injector {
    _proto: ProtoInjector;
    _parent: Injector;
    /**
     * Turns a list of binding definitions into an internal resolved list of resolved bindings.
     *
     * A resolution is a process of flattening multiple nested lists and converting individual
     * bindings into a list of {@link ResolvedBinding}s. The resolution can be cached by `resolve`
     * for the {@link Injector} for performance-sensitive code.
     *
     * @param `bindings` can be a list of `Type`, {@link Binding}, {@link ResolvedBinding}, or a
     * recursive list of more bindings.
     *
     * The returned list is sparse, indexed by `id` for the {@link Key}. It is generally not useful to
     *application code
     * other than for passing it to {@link Injector} functions that require resolved binding lists,
     *such as
     * `fromResolvedBindings` and `createChildFromResolved`.
     */
    static resolve(bindings: List<Type | Binding | List<any>>): List<ResolvedBinding>;
    /**
     * Resolves bindings and creates an injector based on those bindings. This function is slower than
     * the corresponding `fromResolvedBindings` because it needs to resolve bindings first. See
     *`resolve`
     * for the {@link Injector}.
     *
     * Prefer `fromResolvedBindings` in performance-critical code that creates lots of injectors.
     *
     * @param `bindings` can be a list of `Type`, {@link Binding}, {@link ResolvedBinding}, or a
     *recursive list of more
     * bindings.
     */
    static resolveAndCreate(bindings: List<Type | Binding | List<any>>): Injector;
    /**
     * Creates an injector from previously resolved bindings. This bypasses resolution and flattening.
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * @param `bindings` A sparse list of {@link ResolvedBinding}s. See `resolve` for the
     * {@link Injector}.
     */
    static fromResolvedBindings(bindings: List<ResolvedBinding>): Injector;
    _strategy: InjectorStrategy;
    _isBoundary: boolean;
    _constructionCounter: number;
    ei: any;
    constructor(_proto: ProtoInjector, _parent?: Injector);
    /**
     * Retrieves an instance from the injector.
     *
     * @param `token`: usually the `Type` of an object. (Same as the token used while setting up a
     *binding).
     * @returns an instance represented by the token. Throws if not found.
     */
    get(token: any): any;
    /**
     * Retrieves an instance from the injector.
     *
     * @param `token`: usually a `Type`. (Same as the token used while setting up a binding).
     * @returns an instance represented by the token. Returns `null` if not found.
     */
    getOptional(token: any): any;
    /**
     * Retrieves an instance from the injector.
     *
     * @param `index`: index of an instance.
     * @returns an instance represented by the index. Throws if not found.
     */
    getAt(index: number): any;
    /**
     * Direct parent of this injector.
     */
    parent: Injector;
    /**
     * Internal. Do not use.
     *
     * We return `any` not to export the InjectorStrategy type.
     */
    internalStrategy: any;
    /**
    * Creates a child injector and loads a new set of bindings into it.
    *
    * A resolution is a process of flattening multiple nested lists and converting individual
    * bindings into a list of {@link ResolvedBinding}s. The resolution can be cached by `resolve`
    * for the {@link Injector} for performance-sensitive code.
    *
    * @param `bindings` can be a list of `Type`, {@link Binding}, {@link ResolvedBinding}, or a
    * recursive list of more bindings.
    *
    */
    resolveAndCreateChild(bindings: List<Type | Binding | List<any>>): Injector;
    /**
     * Creates a child injector and loads a new set of {@link ResolvedBinding}s into it.
     *
     * @param `bindings`: A sparse list of {@link ResolvedBinding}s.
     * See `resolve` for the {@link Injector}.
     * @returns a new child {@link Injector}.
     */
    createChildFromResolved(bindings: List<ResolvedBinding>): Injector;
    _new(binding: ResolvedBinding, visibility: number): any;
    private _getByDependency(dep, bindingVisibility);
    private _getByKey(key, depVisibility, optional, bindingVisibility);
}
export declare function resolveBindings(bindings: List<Type | Binding | List<any>>): List<ResolvedBinding>;
