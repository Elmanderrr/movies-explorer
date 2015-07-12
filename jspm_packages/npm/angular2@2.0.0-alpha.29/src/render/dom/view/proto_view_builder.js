/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var lang_1 = require("../../../facade/lang");
var collection_1 = require("../../../facade/collection");
var dom_adapter_1 = require("../../../dom/dom_adapter");
var change_detection_1 = require("../../../../change_detection");
var proto_view_1 = require("./proto_view");
var element_binder_1 = require("./element_binder");
var api = require("../../api");
var util_1 = require("../util");
var ProtoViewBuilder = (function() {
  function ProtoViewBuilder(rootElement, type) {
    this.rootElement = rootElement;
    this.type = type;
    this.variableBindings = new Map();
    this.elements = [];
  }
  ProtoViewBuilder.prototype.bindElement = function(element, description) {
    if (description === void 0) {
      description = null;
    }
    var builder = new ElementBinderBuilder(this.elements.length, element, description);
    this.elements.push(builder);
    dom_adapter_1.DOM.addClass(element, util_1.NG_BINDING_CLASS);
    return builder;
  };
  ProtoViewBuilder.prototype.bindVariable = function(name, value) {
    this.variableBindings.set(value, name);
  };
  ProtoViewBuilder.prototype.build = function() {
    var _this = this;
    var renderElementBinders = [];
    var apiElementBinders = [];
    var transitiveContentTagCount = 0;
    var boundTextNodeCount = 0;
    collection_1.ListWrapper.forEach(this.elements, function(ebb) {
      var directiveTemplatePropertyNames = new collection_1.Set();
      var apiDirectiveBinders = collection_1.ListWrapper.map(ebb.directives, function(dbb) {
        ebb.eventBuilder.merge(dbb.eventBuilder);
        collection_1.ListWrapper.forEach(dbb.templatePropertyNames, function(name) {
          return directiveTemplatePropertyNames.add(name);
        });
        return new api.DirectiveBinder({
          directiveIndex: dbb.directiveIndex,
          propertyBindings: dbb.propertyBindings,
          eventBindings: dbb.eventBindings,
          hostPropertyBindings: buildElementPropertyBindings(ebb.element, lang_1.isPresent(ebb.componentId), dbb.hostPropertyBindings, directiveTemplatePropertyNames)
        });
      });
      var nestedProtoView = lang_1.isPresent(ebb.nestedProtoView) ? ebb.nestedProtoView.build() : null;
      var nestedRenderProtoView = lang_1.isPresent(nestedProtoView) ? proto_view_1.resolveInternalDomProtoView(nestedProtoView.render) : null;
      if (lang_1.isPresent(nestedRenderProtoView)) {
        transitiveContentTagCount += nestedRenderProtoView.transitiveContentTagCount;
      }
      if (lang_1.isPresent(ebb.contentTagSelector)) {
        transitiveContentTagCount++;
      }
      var parentIndex = lang_1.isPresent(ebb.parent) ? ebb.parent.index : -1;
      apiElementBinders.push(new api.ElementBinder({
        index: ebb.index,
        parentIndex: parentIndex,
        distanceToParent: ebb.distanceToParent,
        directives: apiDirectiveBinders,
        nestedProtoView: nestedProtoView,
        propertyBindings: buildElementPropertyBindings(ebb.element, lang_1.isPresent(ebb.componentId), ebb.propertyBindings, directiveTemplatePropertyNames),
        variableBindings: ebb.variableBindings,
        eventBindings: ebb.eventBindings,
        textBindings: ebb.textBindings,
        readAttributes: ebb.readAttributes
      }));
      var childNodeInfo = _this._analyzeChildNodes(ebb.element, ebb.textBindingNodes);
      boundTextNodeCount += ebb.textBindingNodes.length;
      renderElementBinders.push(new element_binder_1.ElementBinder({
        textNodeIndices: childNodeInfo.boundTextNodeIndices,
        contentTagSelector: ebb.contentTagSelector,
        parentIndex: parentIndex,
        distanceToParent: ebb.distanceToParent,
        nestedProtoView: lang_1.isPresent(nestedProtoView) ? proto_view_1.resolveInternalDomProtoView(nestedProtoView.render) : null,
        componentId: ebb.componentId,
        eventLocals: new change_detection_1.LiteralArray(ebb.eventBuilder.buildEventLocals()),
        localEvents: ebb.eventBuilder.buildLocalEvents(),
        globalEvents: ebb.eventBuilder.buildGlobalEvents(),
        elementIsEmpty: childNodeInfo.elementIsEmpty
      }));
    });
    return new api.ProtoViewDto({
      render: new proto_view_1.DomProtoViewRef(new proto_view_1.DomProtoView({
        element: this.rootElement,
        elementBinders: renderElementBinders,
        transitiveContentTagCount: transitiveContentTagCount,
        boundTextNodeCount: boundTextNodeCount
      })),
      type: this.type,
      elementBinders: apiElementBinders,
      variableBindings: this.variableBindings
    });
  };
  ProtoViewBuilder.prototype._analyzeChildNodes = function(parentElement, boundTextNodes) {
    var childNodes = dom_adapter_1.DOM.childNodes(dom_adapter_1.DOM.templateAwareRoot(parentElement));
    var boundTextNodeIndices = [];
    var indexInBoundTextNodes = 0;
    var elementIsEmpty = true;
    for (var i = 0; i < childNodes.length; i++) {
      var node = childNodes[i];
      if (indexInBoundTextNodes < boundTextNodes.length && node === boundTextNodes[indexInBoundTextNodes]) {
        boundTextNodeIndices.push(i);
        indexInBoundTextNodes++;
        elementIsEmpty = false;
      } else if ((dom_adapter_1.DOM.isTextNode(node) && dom_adapter_1.DOM.getText(node).trim().length > 0) || (dom_adapter_1.DOM.isElementNode(node))) {
        elementIsEmpty = false;
      }
    }
    return new _ChildNodesInfo(boundTextNodeIndices, elementIsEmpty);
  };
  return ProtoViewBuilder;
})();
exports.ProtoViewBuilder = ProtoViewBuilder;
var _ChildNodesInfo = (function() {
  function _ChildNodesInfo(boundTextNodeIndices, elementIsEmpty) {
    this.boundTextNodeIndices = boundTextNodeIndices;
    this.elementIsEmpty = elementIsEmpty;
  }
  return _ChildNodesInfo;
})();
var ElementBinderBuilder = (function() {
  function ElementBinderBuilder(index, element, description) {
    this.index = index;
    this.element = element;
    this.parent = null;
    this.distanceToParent = 0;
    this.directives = [];
    this.nestedProtoView = null;
    this.propertyBindings = new Map();
    this.variableBindings = new Map();
    this.propertyBindingsToDirectives = new collection_1.Set();
    this.eventBindings = [];
    this.eventBuilder = new EventBuilder();
    this.textBindingNodes = [];
    this.textBindings = [];
    this.contentTagSelector = null;
    this.readAttributes = new Map();
    this.componentId = null;
  }
  ElementBinderBuilder.prototype.setParent = function(parent, distanceToParent) {
    this.parent = parent;
    if (lang_1.isPresent(parent)) {
      this.distanceToParent = distanceToParent;
    }
    return this;
  };
  ElementBinderBuilder.prototype.readAttribute = function(attrName) {
    if (lang_1.isBlank(this.readAttributes.get(attrName))) {
      this.readAttributes.set(attrName, dom_adapter_1.DOM.getAttribute(this.element, attrName));
    }
  };
  ElementBinderBuilder.prototype.bindDirective = function(directiveIndex) {
    var directive = new DirectiveBuilder(directiveIndex);
    this.directives.push(directive);
    return directive;
  };
  ElementBinderBuilder.prototype.bindNestedProtoView = function(rootElement) {
    if (lang_1.isPresent(this.nestedProtoView)) {
      throw new lang_1.BaseException('Only one nested view per element is allowed');
    }
    this.nestedProtoView = new ProtoViewBuilder(rootElement, api.ViewType.EMBEDDED);
    return this.nestedProtoView;
  };
  ElementBinderBuilder.prototype.bindProperty = function(name, expression) {
    this.propertyBindings.set(name, expression);
  };
  ElementBinderBuilder.prototype.bindPropertyToDirective = function(name) {
    this.propertyBindingsToDirectives.add(name);
  };
  ElementBinderBuilder.prototype.bindVariable = function(name, value) {
    if (lang_1.isPresent(this.nestedProtoView)) {
      this.nestedProtoView.bindVariable(name, value);
    } else {
      this.variableBindings.set(value, name);
    }
  };
  ElementBinderBuilder.prototype.bindEvent = function(name, expression, target) {
    if (target === void 0) {
      target = null;
    }
    this.eventBindings.push(this.eventBuilder.add(name, expression, target));
  };
  ElementBinderBuilder.prototype.bindText = function(textNode, expression) {
    this.textBindingNodes.push(textNode);
    this.textBindings.push(expression);
  };
  ElementBinderBuilder.prototype.setContentTagSelector = function(value) {
    this.contentTagSelector = value;
  };
  ElementBinderBuilder.prototype.setComponentId = function(componentId) {
    this.componentId = componentId;
  };
  return ElementBinderBuilder;
})();
exports.ElementBinderBuilder = ElementBinderBuilder;
var DirectiveBuilder = (function() {
  function DirectiveBuilder(directiveIndex) {
    this.directiveIndex = directiveIndex;
    this.propertyBindings = new Map();
    this.templatePropertyNames = [];
    this.hostPropertyBindings = new Map();
    this.eventBindings = [];
    this.eventBuilder = new EventBuilder();
  }
  DirectiveBuilder.prototype.bindProperty = function(name, expression, elProp) {
    this.propertyBindings.set(name, expression);
    if (lang_1.isPresent(elProp)) {
      this.templatePropertyNames.push(elProp);
    }
  };
  DirectiveBuilder.prototype.bindHostProperty = function(name, expression) {
    this.hostPropertyBindings.set(name, expression);
  };
  DirectiveBuilder.prototype.bindEvent = function(name, expression, target) {
    if (target === void 0) {
      target = null;
    }
    this.eventBindings.push(this.eventBuilder.add(name, expression, target));
  };
  return DirectiveBuilder;
})();
exports.DirectiveBuilder = DirectiveBuilder;
var EventBuilder = (function(_super) {
  __extends(EventBuilder, _super);
  function EventBuilder() {
    _super.call(this);
    this.locals = [];
    this.localEvents = [];
    this.globalEvents = [];
    this._implicitReceiver = new change_detection_1.ImplicitReceiver();
  }
  EventBuilder.prototype.add = function(name, source, target) {
    var adjustedAst = source.ast;
    var fullName = lang_1.isPresent(target) ? target + util_1.EVENT_TARGET_SEPARATOR + name : name;
    var result = new api.EventBinding(fullName, new change_detection_1.ASTWithSource(adjustedAst, source.source, source.location));
    var event = new element_binder_1.Event(name, target, fullName);
    if (lang_1.isBlank(target)) {
      this.localEvents.push(event);
    } else {
      this.globalEvents.push(event);
    }
    return result;
  };
  EventBuilder.prototype.visitAccessMember = function(ast) {
    var isEventAccess = false;
    var current = ast;
    while (!isEventAccess && (current instanceof change_detection_1.AccessMember)) {
      var am = current;
      if (am.name == '$event') {
        isEventAccess = true;
      }
      current = am.receiver;
    }
    if (isEventAccess) {
      this.locals.push(ast);
      var index = this.locals.length - 1;
      return new change_detection_1.AccessMember(this._implicitReceiver, "" + index, function(arr) {
        return arr[index];
      }, null);
    } else {
      return ast;
    }
  };
  EventBuilder.prototype.buildEventLocals = function() {
    return this.locals;
  };
  EventBuilder.prototype.buildLocalEvents = function() {
    return this.localEvents;
  };
  EventBuilder.prototype.buildGlobalEvents = function() {
    return this.globalEvents;
  };
  EventBuilder.prototype.merge = function(eventBuilder) {
    this._merge(this.localEvents, eventBuilder.localEvents);
    this._merge(this.globalEvents, eventBuilder.globalEvents);
    collection_1.ListWrapper.concat(this.locals, eventBuilder.locals);
  };
  EventBuilder.prototype._merge = function(host, tobeAdded) {
    var names = [];
    for (var i = 0; i < host.length; i++) {
      names.push(host[i].fullName);
    }
    for (var j = 0; j < tobeAdded.length; j++) {
      if (!collection_1.ListWrapper.contains(names, tobeAdded[j].fullName)) {
        host.push(tobeAdded[j]);
      }
    }
  };
  return EventBuilder;
})(change_detection_1.AstTransformer);
exports.EventBuilder = EventBuilder;
var PROPERTY_PARTS_SEPARATOR = new RegExp('\\.');
var ATTRIBUTE_PREFIX = 'attr';
var CLASS_PREFIX = 'class';
var STYLE_PREFIX = 'style';
function buildElementPropertyBindings(protoElement, isNgComponent, bindingsInTemplate, directiveTempaltePropertyNames) {
  var propertyBindings = [];
  collection_1.MapWrapper.forEach(bindingsInTemplate, function(ast, propertyNameInTemplate) {
    var propertyBinding = createElementPropertyBinding(ast, propertyNameInTemplate);
    if (isValidElementPropertyBinding(protoElement, isNgComponent, propertyBinding)) {
      propertyBindings.push(propertyBinding);
    } else if (!collection_1.SetWrapper.has(directiveTempaltePropertyNames, propertyNameInTemplate)) {
      throw new lang_1.BaseException("Can't bind to '" + propertyNameInTemplate + "' since it isn't a know property of the '" + dom_adapter_1.DOM.tagName(protoElement).toLowerCase() + "' element and there are no matching directives with a corresponding property");
    }
  });
  return propertyBindings;
}
function isValidElementPropertyBinding(protoElement, isNgComponent, binding) {
  if (binding.type === api.PropertyBindingType.PROPERTY) {
    var tagName = dom_adapter_1.DOM.tagName(protoElement);
    var possibleCustomElement = tagName.indexOf('-') !== -1;
    if (possibleCustomElement && !isNgComponent) {
      return true;
    } else {
      return dom_adapter_1.DOM.hasProperty(protoElement, binding.property);
    }
  }
  return true;
}
function createElementPropertyBinding(ast, propertyNameInTemplate) {
  var parts = lang_1.StringWrapper.split(propertyNameInTemplate, PROPERTY_PARTS_SEPARATOR);
  if (parts.length === 1) {
    var propName = parts[0];
    var mappedPropName = collection_1.StringMapWrapper.get(dom_adapter_1.DOM.attrToPropMap, propName);
    propName = lang_1.isPresent(mappedPropName) ? mappedPropName : propName;
    return new api.ElementPropertyBinding(api.PropertyBindingType.PROPERTY, ast, propName);
  } else if (parts[0] == ATTRIBUTE_PREFIX) {
    return new api.ElementPropertyBinding(api.PropertyBindingType.ATTRIBUTE, ast, parts[1]);
  } else if (parts[0] == CLASS_PREFIX) {
    return new api.ElementPropertyBinding(api.PropertyBindingType.CLASS, ast, parts[1]);
  } else if (parts[0] == STYLE_PREFIX) {
    var unit = parts.length > 2 ? parts[2] : null;
    return new api.ElementPropertyBinding(api.PropertyBindingType.STYLE, ast, parts[1], unit);
  } else {
    throw new lang_1.BaseException("Invalid property name " + propertyNameInTemplate);
  }
}
exports.__esModule = true;
