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
import { CONST, CONST_EXPR, stringify, isBlank } from "angular2/src/facade/lang";
/**
 * A parameter annotation that specifies a dependency.
 *
 * ```
 * class AComponent {
 *   constructor(@Inject(MyService) aService:MyService) {}
 * }
 * ```
 *
 * @exportedAs angular2/di_annotations
 */
export let Inject = class {
    constructor(token) {
        this.token = token;
    }
    toString() { return `@Inject(${stringify(this.token)})`; }
};
Inject = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Inject);
/**
 * A parameter annotation that marks a dependency as optional. {@link Injector} provides `null` if
 * the dependency is not found.
 *
 * ```
 * class AComponent {
 *   constructor(@Optional() aService:MyService) {
 *     this.aService = aService;
 *   }
 * }
 * ```
 *
 * @exportedAs angular2/di_annotations
 */
export let Optional = class {
    toString() { return `@Optional()`; }
};
Optional = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], Optional);
/**
 * `DependencyAnnotation` is used by the framework to extend DI.
 *
 * Only annotations implementing `DependencyAnnotation` are added to the list of dependency
 * properties.
 *
 * For example:
 *
 * ```
 * class Parent extends DependencyAnnotation {}
 * class NotDependencyProperty {}
 *
 * class AComponent {
 *   constructor(@Parent @NotDependencyProperty aService:AService) {}
 * }
 * ```
 *
 * will create the following dependency:
 *
 * ```
 * new Dependency(Key.get(AService), [new Parent()])
 * ```
 *
 * The framework can use `new Parent()` to handle the `aService` dependency
 * in a specific way.
 *
 * @exportedAs angular2/di_annotations
 */
export let DependencyAnnotation = class {
    get token() { return null; }
};
DependencyAnnotation = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], DependencyAnnotation);
/**
 * A marker annotation that marks a class as available to `Injector` for creation. Used by tooling
 * for generating constructor stubs.
 *
 * ```
 * class NeedsService {
 *   constructor(svc:UsefulService) {}
 * }
 *
 * @Injectable
 * class UsefulService {}
 * ```
 * @exportedAs angular2/di_annotations
 */
export let Injectable = class {
    constructor(visibility = unbounded) {
        this.visibility = visibility;
    }
};
Injectable = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Visibility])
], Injectable);
/**
 * Specifies how injector should resolve a dependency.
 *
 * See {@link Self}, {@link Parent}, {@link Ancestor}, {@link Unbounded}.
 *
 * @exportedAs angular2/di_annotations
 */
export let Visibility = class {
    constructor(depth, crossBoundaries, _includeSelf) {
        this.depth = depth;
        this.crossBoundaries = crossBoundaries;
        this._includeSelf = _includeSelf;
    }
    get includeSelf() { return isBlank(this._includeSelf) ? false : this._includeSelf; }
    toString() {
        return `@Visibility(depth: ${this.depth}, crossBoundaries: ${this.crossBoundaries}, includeSelf: ${this.includeSelf}})`;
    }
};
Visibility = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Number, Boolean, Boolean])
], Visibility);
/**
 * Specifies that an injector should retrieve a dependency from itself.
 *
 * ## Example
 *
 * ```
 * class Dependency {
 * }
 *
 * class NeedsDependency {
 *   constructor(public @Self() dependency:Dependency) {}
 * }
 *
 * var inj = Injector.resolveAndCreate([Dependency, NeedsDependency]);
 * var nd = inj.get(NeedsDependency);
 * expect(nd.dependency).toBeAnInstanceOf(Dependency);
 * ```
 *
 * @exportedAs angular2/di
 */
export let Self = class extends Visibility {
    constructor() {
        super(0, false, true);
    }
    toString() { return `@Self()`; }
};
Self = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [])
], Self);
export const self = CONST_EXPR(new Self());
/**
 * Specifies that an injector should retrieve a dependency from the direct parent.
 *
 * ## Example
 *
 * ```
 * class Dependency {
 * }
 *
 * class NeedsDependency {
 *   constructor(public @Parent() dependency:Dependency) {}
 * }
 *
 * var parent = Injector.resolveAndCreate([
 *   bind(Dependency).toClass(ParentDependency)
 * ]);
 * var child = parent.resolveAndCreateChild([NeedsDependency, Depedency]);
 * var nd = child.get(NeedsDependency);
 * expect(nd.dependency).toBeAnInstanceOf(ParentDependency);
 * ```
 *
 * You can make an injector to retrive a dependency either from itself or its direct parent by
 * setting self to true.
 *
 * ```
 * class NeedsDependency {
 *   constructor(public @Parent({self:true}) dependency:Dependency) {}
 * }
 * ```
 *
 * @exportedAs angular2/di
 */
export let Parent = class extends Visibility {
    constructor({ self } = {}) {
        super(1, false, self);
    }
    toString() { return `@Parent(self: ${this.includeSelf}})`; }
};
Parent = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Parent);
/**
 * Specifies that an injector should retrieve a dependency from any ancestor from the same boundary.
 *
 * ## Example
 *
 * ```
 * class Dependency {
 * }
 *
 * class NeedsDependency {
 *   constructor(public @Ancestor() dependency:Dependency) {}
 * }
 *
 * var parent = Injector.resolveAndCreate([
 *   bind(Dependency).toClass(AncestorDependency)
 * ]);
 * var child = parent.resolveAndCreateChild([]);
 * var grandChild = child.resolveAndCreateChild([NeedsDependency, Depedency]);
 * var nd = grandChild.get(NeedsDependency);
 * expect(nd.dependency).toBeAnInstanceOf(AncestorDependency);
 * ```
 *
 * You can make an injector to retrive a dependency either from itself or its ancestor by setting
 * self to true.
 *
 * ```
 * class NeedsDependency {
 *   constructor(public @Ancestor({self:true}) dependency:Dependency) {}
 * }
 * ```
 *
 * @exportedAs angular2/di
 */
export let Ancestor = class extends Visibility {
    constructor({ self } = {}) {
        super(999999, false, self);
    }
    toString() { return `@Ancestor(self: ${this.includeSelf}})`; }
};
Ancestor = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Ancestor);
/**
 * Specifies that an injector should retrieve a dependency from any ancestor, crossing boundaries.
 *
 * ## Example
 *
 * ```
 * class Dependency {
 * }
 *
 * class NeedsDependency {
 *   constructor(public @Ancestor() dependency:Dependency) {}
 * }
 *
 * var parent = Injector.resolveAndCreate([
 *   bind(Dependency).toClass(AncestorDependency)
 * ]);
 * var child = parent.resolveAndCreateChild([]);
 * var grandChild = child.resolveAndCreateChild([NeedsDependency, Depedency]);
 * var nd = grandChild.get(NeedsDependency);
 * expect(nd.dependency).toBeAnInstanceOf(AncestorDependency);
 * ```
 *
 * You can make an injector to retrive a dependency either from itself or its ancestor by setting
 * self to true.
 *
 * ```
 * class NeedsDependency {
 *   constructor(public @Ancestor({self:true}) dependency:Dependency) {}
 * }
 * ```
 *
 * @exportedAs angular2/di
 */
export let Unbounded = class extends Visibility {
    constructor({ self } = {}) {
        super(999999, true, self);
    }
    toString() { return `@Unbounded(self: ${this.includeSelf}})`; }
};
Unbounded = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Unbounded);
export const unbounded = CONST_EXPR(new Unbounded({ self: true }));
//# sourceMappingURL=annotations_impl.js.map