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
export declare class Inject {
    token: any;
    constructor(token: any);
    toString(): string;
}
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
export declare class Optional {
    toString(): string;
}
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
export declare class DependencyAnnotation {
    token: any;
}
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
export declare class Injectable {
    visibility: Visibility;
    constructor(visibility?: Visibility);
}
/**
 * Specifies how injector should resolve a dependency.
 *
 * See {@link Self}, {@link Parent}, {@link Ancestor}, {@link Unbounded}.
 *
 * @exportedAs angular2/di_annotations
 */
export declare class Visibility {
    depth: number;
    crossBoundaries: boolean;
    _includeSelf: boolean;
    constructor(depth: number, crossBoundaries: boolean, _includeSelf: boolean);
    includeSelf: boolean;
    toString(): string;
}
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
export declare class Self extends Visibility {
    constructor();
    toString(): string;
}
export declare const self: Self;
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
export declare class Parent extends Visibility {
    constructor({self}?: {
        self?: boolean;
    });
    toString(): string;
}
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
export declare class Ancestor extends Visibility {
    constructor({self}?: {
        self?: boolean;
    });
    toString(): string;
}
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
export declare class Unbounded extends Visibility {
    constructor({self}?: {
        self?: boolean;
    });
    toString(): string;
}
export declare const unbounded: Unbounded;
