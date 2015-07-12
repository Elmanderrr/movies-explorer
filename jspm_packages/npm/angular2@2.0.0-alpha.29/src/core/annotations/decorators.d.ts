import { ComponentAnnotation, DirectiveAnnotation, ComponentArgs, DirectiveArgs } from './annotations';
import { ViewAnnotation, ViewArgs } from './view';
import { TypeDecorator } from '../../util/decorators';
export interface DirectiveTypeDecorator extends TypeDecorator {
}
export interface ComponentTypeDecorator extends TypeDecorator {
    View(obj: ViewArgs): ViewTypeDecorator;
}
export interface ViewTypeDecorator extends TypeDecorator {
    View(obj: ViewArgs): ViewTypeDecorator;
}
export interface Directive {
    (obj: DirectiveArgs): DirectiveTypeDecorator;
    new (obj: DirectiveAnnotation): DirectiveAnnotation;
}
export interface Component {
    (obj: ComponentArgs): ComponentTypeDecorator;
    new (obj: ComponentAnnotation): ComponentAnnotation;
}
export interface View {
    (obj: ViewArgs): ViewTypeDecorator;
    new (obj: ViewArgs): ViewAnnotation;
}
export declare var Component: Component;
export declare var Directive: Directive;
export declare var View: any;
export declare var Attribute: any;
export declare var Query: any;
export declare var __esModule: boolean;
