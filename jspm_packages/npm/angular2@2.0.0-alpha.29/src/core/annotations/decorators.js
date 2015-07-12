/* */ 
'use strict';
var annotations_1 = require("./annotations");
var view_1 = require("./view");
var di_1 = require("./di");
var decorators_1 = require("../../util/decorators");
exports.Component = decorators_1.makeDecorator(annotations_1.ComponentAnnotation, function(fn) {
  return fn.View = exports.View;
});
exports.Directive = decorators_1.makeDecorator(annotations_1.DirectiveAnnotation);
exports.View = decorators_1.makeDecorator(view_1.ViewAnnotation, function(fn) {
  return fn.View = exports.View;
});
exports.Attribute = decorators_1.makeParamDecorator(di_1.AttributeAnnotation);
exports.Query = decorators_1.makeParamDecorator(di_1.QueryAnnotation);
exports.__esModule = true;
