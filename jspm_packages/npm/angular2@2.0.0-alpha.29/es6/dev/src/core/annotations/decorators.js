/* */ 
"format cjs";
import { ComponentAnnotation, DirectiveAnnotation } from './annotations';
import { ViewAnnotation } from './view';
import { AttributeAnnotation, QueryAnnotation } from './di';
import { makeDecorator, makeParamDecorator } from '../../util/decorators';
/* from annotations */
export var Component = makeDecorator(ComponentAnnotation, (fn) => fn.View = View);
export var Directive = makeDecorator(DirectiveAnnotation);
/* from view */
export var View = makeDecorator(ViewAnnotation, (fn) => fn.View = View);
/* from di */
export var Attribute = makeParamDecorator(AttributeAnnotation);
export var Query = makeParamDecorator(QueryAnnotation);
//# sourceMappingURL=decorators.js.map