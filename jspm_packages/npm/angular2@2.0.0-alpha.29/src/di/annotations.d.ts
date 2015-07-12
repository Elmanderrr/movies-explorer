/**
 * This indirection is needed to free up Component, etc symbols in the public API
 * to be used by the decorator versions of these annotations.
 */
export { Inject as InjectAnnotation, Optional as OptionalAnnotation, Injectable as InjectableAnnotation, Visibility as VisibilityAnnotation, Self as SelfAnnotation, Parent as ParentAnnotation, Ancestor as AncestorAnnotation, Unbounded as UnboundedAnnotation, DependencyAnnotation } from './annotations_impl';
export declare var __esModule: boolean;
