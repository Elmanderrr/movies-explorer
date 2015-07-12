/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var DIRECTIVE = "directive";
var DIRECTIVE_LIFECYCLE = "directiveLifecycle";
var ELEMENT_PROPERTY = "elementProperty";
var ELEMENT_ATTRIBUTE = "elementAttribute";
var ELEMENT_CLASS = "elementClass";
var ELEMENT_STYLE = "elementStyle";
var TEXT_NODE = "textNode";
var BindingRecord = (function() {
  function BindingRecord(mode, implicitReceiver, ast, elementIndex, propertyName, propertyUnit, setter, lifecycleEvent, directiveRecord) {
    this.mode = mode;
    this.implicitReceiver = implicitReceiver;
    this.ast = ast;
    this.elementIndex = elementIndex;
    this.propertyName = propertyName;
    this.propertyUnit = propertyUnit;
    this.setter = setter;
    this.lifecycleEvent = lifecycleEvent;
    this.directiveRecord = directiveRecord;
  }
  BindingRecord.prototype.callOnChange = function() {
    return lang_1.isPresent(this.directiveRecord) && this.directiveRecord.callOnChange;
  };
  BindingRecord.prototype.isOnPushChangeDetection = function() {
    return lang_1.isPresent(this.directiveRecord) && this.directiveRecord.isOnPushChangeDetection();
  };
  BindingRecord.prototype.isDirective = function() {
    return this.mode === DIRECTIVE;
  };
  BindingRecord.prototype.isDirectiveLifecycle = function() {
    return this.mode === DIRECTIVE_LIFECYCLE;
  };
  BindingRecord.prototype.isElementProperty = function() {
    return this.mode === ELEMENT_PROPERTY;
  };
  BindingRecord.prototype.isElementAttribute = function() {
    return this.mode === ELEMENT_ATTRIBUTE;
  };
  BindingRecord.prototype.isElementClass = function() {
    return this.mode === ELEMENT_CLASS;
  };
  BindingRecord.prototype.isElementStyle = function() {
    return this.mode === ELEMENT_STYLE;
  };
  BindingRecord.prototype.isTextNode = function() {
    return this.mode === TEXT_NODE;
  };
  BindingRecord.createForDirective = function(ast, propertyName, setter, directiveRecord) {
    return new BindingRecord(DIRECTIVE, 0, ast, 0, propertyName, null, setter, null, directiveRecord);
  };
  BindingRecord.createDirectiveOnCheck = function(directiveRecord) {
    return new BindingRecord(DIRECTIVE_LIFECYCLE, 0, null, 0, null, null, null, "onCheck", directiveRecord);
  };
  BindingRecord.createDirectiveOnInit = function(directiveRecord) {
    return new BindingRecord(DIRECTIVE_LIFECYCLE, 0, null, 0, null, null, null, "onInit", directiveRecord);
  };
  BindingRecord.createDirectiveOnChange = function(directiveRecord) {
    return new BindingRecord(DIRECTIVE_LIFECYCLE, 0, null, 0, null, null, null, "onChange", directiveRecord);
  };
  BindingRecord.createForElementProperty = function(ast, elementIndex, propertyName) {
    return new BindingRecord(ELEMENT_PROPERTY, 0, ast, elementIndex, propertyName, null, null, null, null);
  };
  BindingRecord.createForElementAttribute = function(ast, elementIndex, attributeName) {
    return new BindingRecord(ELEMENT_ATTRIBUTE, 0, ast, elementIndex, attributeName, null, null, null, null);
  };
  BindingRecord.createForElementClass = function(ast, elementIndex, className) {
    return new BindingRecord(ELEMENT_CLASS, 0, ast, elementIndex, className, null, null, null, null);
  };
  BindingRecord.createForElementStyle = function(ast, elementIndex, styleName, unit) {
    return new BindingRecord(ELEMENT_STYLE, 0, ast, elementIndex, styleName, unit, null, null, null);
  };
  BindingRecord.createForHostProperty = function(directiveIndex, ast, propertyName) {
    return new BindingRecord(ELEMENT_PROPERTY, directiveIndex, ast, directiveIndex.elementIndex, propertyName, null, null, null, null);
  };
  BindingRecord.createForHostAttribute = function(directiveIndex, ast, attributeName) {
    return new BindingRecord(ELEMENT_ATTRIBUTE, directiveIndex, ast, directiveIndex.elementIndex, attributeName, null, null, null, null);
  };
  BindingRecord.createForHostClass = function(directiveIndex, ast, className) {
    return new BindingRecord(ELEMENT_CLASS, directiveIndex, ast, directiveIndex.elementIndex, className, null, null, null, null);
  };
  BindingRecord.createForHostStyle = function(directiveIndex, ast, styleName, unit) {
    return new BindingRecord(ELEMENT_STYLE, directiveIndex, ast, directiveIndex.elementIndex, styleName, unit, null, null, null);
  };
  BindingRecord.createForTextNode = function(ast, elementIndex) {
    return new BindingRecord(TEXT_NODE, 0, ast, elementIndex, null, null, null, null, null);
  };
  return BindingRecord;
})();
exports.BindingRecord = BindingRecord;
exports.__esModule = true;
