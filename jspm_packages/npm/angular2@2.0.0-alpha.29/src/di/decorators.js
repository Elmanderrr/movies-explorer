/* */ 
'use strict';
var annotations_1 = require("./annotations");
var decorators_1 = require("../util/decorators");
exports.Inject = decorators_1.makeParamDecorator(annotations_1.InjectAnnotation);
exports.Optional = decorators_1.makeParamDecorator(annotations_1.OptionalAnnotation);
exports.Injectable = decorators_1.makeDecorator(annotations_1.InjectableAnnotation);
exports.Visibility = decorators_1.makeParamDecorator(annotations_1.VisibilityAnnotation);
exports.Self = decorators_1.makeParamDecorator(annotations_1.SelfAnnotation);
exports.Parent = decorators_1.makeParamDecorator(annotations_1.ParentAnnotation);
exports.Ancestor = decorators_1.makeParamDecorator(annotations_1.AncestorAnnotation);
exports.Unbounded = decorators_1.makeParamDecorator(annotations_1.UnboundedAnnotation);
exports.__esModule = true;
