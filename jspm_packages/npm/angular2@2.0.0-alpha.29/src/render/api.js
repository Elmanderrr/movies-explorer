/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var EventBinding = (function() {
  function EventBinding(fullName, source) {
    this.fullName = fullName;
    this.source = source;
  }
  return EventBinding;
})();
exports.EventBinding = EventBinding;
(function(PropertyBindingType) {
  PropertyBindingType[PropertyBindingType["PROPERTY"] = 0] = "PROPERTY";
  PropertyBindingType[PropertyBindingType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
  PropertyBindingType[PropertyBindingType["CLASS"] = 2] = "CLASS";
  PropertyBindingType[PropertyBindingType["STYLE"] = 3] = "STYLE";
})(exports.PropertyBindingType || (exports.PropertyBindingType = {}));
var PropertyBindingType = exports.PropertyBindingType;
var ElementPropertyBinding = (function() {
  function ElementPropertyBinding(type, astWithSource, property, unit) {
    if (unit === void 0) {
      unit = null;
    }
    this.type = type;
    this.astWithSource = astWithSource;
    this.property = property;
    this.unit = unit;
  }
  return ElementPropertyBinding;
})();
exports.ElementPropertyBinding = ElementPropertyBinding;
var ElementBinder = (function() {
  function ElementBinder(_a) {
    var _b = _a === void 0 ? {} : _a,
        index = _b.index,
        parentIndex = _b.parentIndex,
        distanceToParent = _b.distanceToParent,
        directives = _b.directives,
        nestedProtoView = _b.nestedProtoView,
        propertyBindings = _b.propertyBindings,
        variableBindings = _b.variableBindings,
        eventBindings = _b.eventBindings,
        textBindings = _b.textBindings,
        readAttributes = _b.readAttributes;
    this.index = index;
    this.parentIndex = parentIndex;
    this.distanceToParent = distanceToParent;
    this.directives = directives;
    this.nestedProtoView = nestedProtoView;
    this.propertyBindings = propertyBindings;
    this.variableBindings = variableBindings;
    this.eventBindings = eventBindings;
    this.textBindings = textBindings;
    this.readAttributes = readAttributes;
  }
  return ElementBinder;
})();
exports.ElementBinder = ElementBinder;
var DirectiveBinder = (function() {
  function DirectiveBinder(_a) {
    var directiveIndex = _a.directiveIndex,
        propertyBindings = _a.propertyBindings,
        eventBindings = _a.eventBindings,
        hostPropertyBindings = _a.hostPropertyBindings;
    this.directiveIndex = directiveIndex;
    this.propertyBindings = propertyBindings;
    this.eventBindings = eventBindings;
    this.hostPropertyBindings = hostPropertyBindings;
  }
  return DirectiveBinder;
})();
exports.DirectiveBinder = DirectiveBinder;
(function(ViewType) {
  ViewType[ViewType["HOST"] = 0] = "HOST";
  ViewType[ViewType["COMPONENT"] = 1] = "COMPONENT";
  ViewType[ViewType["EMBEDDED"] = 2] = "EMBEDDED";
})(exports.ViewType || (exports.ViewType = {}));
var ViewType = exports.ViewType;
var ProtoViewDto = (function() {
  function ProtoViewDto(_a) {
    var render = _a.render,
        elementBinders = _a.elementBinders,
        variableBindings = _a.variableBindings,
        type = _a.type;
    this.render = render;
    this.elementBinders = elementBinders;
    this.variableBindings = variableBindings;
    this.type = type;
  }
  return ProtoViewDto;
})();
exports.ProtoViewDto = ProtoViewDto;
var hostRegExp = lang_1.RegExpWrapper.create('^(?:(?:\\[([^\\]]+)\\])|(?:\\(([^\\)]+)\\))|(?:@(.+)))$');
var DirectiveMetadata = (function() {
  function DirectiveMetadata(_a) {
    var id = _a.id,
        selector = _a.selector,
        compileChildren = _a.compileChildren,
        events = _a.events,
        hostListeners = _a.hostListeners,
        hostProperties = _a.hostProperties,
        hostAttributes = _a.hostAttributes,
        hostActions = _a.hostActions,
        properties = _a.properties,
        readAttributes = _a.readAttributes,
        type = _a.type,
        callOnDestroy = _a.callOnDestroy,
        callOnChange = _a.callOnChange,
        callOnCheck = _a.callOnCheck,
        callOnInit = _a.callOnInit,
        callOnAllChangesDone = _a.callOnAllChangesDone,
        changeDetection = _a.changeDetection,
        exportAs = _a.exportAs;
    this.id = id;
    this.selector = selector;
    this.compileChildren = lang_1.isPresent(compileChildren) ? compileChildren : true;
    this.events = events;
    this.hostListeners = hostListeners;
    this.hostAttributes = hostAttributes;
    this.hostProperties = hostProperties;
    this.hostActions = hostActions;
    this.properties = properties;
    this.readAttributes = readAttributes;
    this.type = type;
    this.callOnDestroy = callOnDestroy;
    this.callOnChange = callOnChange;
    this.callOnCheck = callOnCheck;
    this.callOnInit = callOnInit;
    this.callOnAllChangesDone = callOnAllChangesDone;
    this.changeDetection = changeDetection;
    this.exportAs = exportAs;
  }
  Object.defineProperty(DirectiveMetadata, "DIRECTIVE_TYPE", {
    get: function() {
      return 0;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DirectiveMetadata, "COMPONENT_TYPE", {
    get: function() {
      return 1;
    },
    enumerable: true,
    configurable: true
  });
  DirectiveMetadata.create = function(_a) {
    var id = _a.id,
        selector = _a.selector,
        compileChildren = _a.compileChildren,
        events = _a.events,
        host = _a.host,
        properties = _a.properties,
        readAttributes = _a.readAttributes,
        type = _a.type,
        callOnDestroy = _a.callOnDestroy,
        callOnChange = _a.callOnChange,
        callOnCheck = _a.callOnCheck,
        callOnInit = _a.callOnInit,
        callOnAllChangesDone = _a.callOnAllChangesDone,
        changeDetection = _a.changeDetection,
        exportAs = _a.exportAs;
    var hostListeners = new collection_1.Map();
    var hostProperties = new collection_1.Map();
    var hostAttributes = new collection_1.Map();
    var hostActions = new collection_1.Map();
    if (lang_1.isPresent(host)) {
      collection_1.MapWrapper.forEach(host, function(value, key) {
        var matches = lang_1.RegExpWrapper.firstMatch(hostRegExp, key);
        if (lang_1.isBlank(matches)) {
          hostAttributes.set(key, value);
        } else if (lang_1.isPresent(matches[1])) {
          hostProperties.set(matches[1], value);
        } else if (lang_1.isPresent(matches[2])) {
          hostListeners.set(matches[2], value);
        } else if (lang_1.isPresent(matches[3])) {
          hostActions.set(matches[3], value);
        }
      });
    }
    return new DirectiveMetadata({
      id: id,
      selector: selector,
      compileChildren: compileChildren,
      events: events,
      hostListeners: hostListeners,
      hostProperties: hostProperties,
      hostAttributes: hostAttributes,
      hostActions: hostActions,
      properties: properties,
      readAttributes: readAttributes,
      type: type,
      callOnDestroy: callOnDestroy,
      callOnChange: callOnChange,
      callOnCheck: callOnCheck,
      callOnInit: callOnInit,
      callOnAllChangesDone: callOnAllChangesDone,
      changeDetection: changeDetection,
      exportAs: exportAs
    });
  };
  return DirectiveMetadata;
})();
exports.DirectiveMetadata = DirectiveMetadata;
var RenderProtoViewRef = (function() {
  function RenderProtoViewRef() {}
  return RenderProtoViewRef;
})();
exports.RenderProtoViewRef = RenderProtoViewRef;
var RenderViewRef = (function() {
  function RenderViewRef() {}
  return RenderViewRef;
})();
exports.RenderViewRef = RenderViewRef;
var ViewDefinition = (function() {
  function ViewDefinition(_a) {
    var componentId = _a.componentId,
        templateAbsUrl = _a.templateAbsUrl,
        template = _a.template,
        styleAbsUrls = _a.styleAbsUrls,
        styles = _a.styles,
        directives = _a.directives;
    this.componentId = componentId;
    this.templateAbsUrl = templateAbsUrl;
    this.template = template;
    this.styleAbsUrls = styleAbsUrls;
    this.styles = styles;
    this.directives = directives;
  }
  return ViewDefinition;
})();
exports.ViewDefinition = ViewDefinition;
var RenderCompiler = (function() {
  function RenderCompiler() {}
  RenderCompiler.prototype.compileHost = function(directiveMetadata) {
    return null;
  };
  RenderCompiler.prototype.compile = function(view) {
    return null;
  };
  return RenderCompiler;
})();
exports.RenderCompiler = RenderCompiler;
var Renderer = (function() {
  function Renderer() {}
  Renderer.prototype.createRootHostView = function(hostProtoViewRef, hostElementSelector) {
    return null;
  };
  Renderer.prototype.createView = function(protoViewRef) {
    return null;
  };
  Renderer.prototype.destroyView = function(viewRef) {};
  Renderer.prototype.attachComponentView = function(location, componentViewRef) {};
  Renderer.prototype.detachComponentView = function(location, componentViewRef) {};
  Renderer.prototype.attachViewInContainer = function(location, atIndex, viewRef) {};
  Renderer.prototype.detachViewInContainer = function(location, atIndex, viewRef) {};
  Renderer.prototype.hydrateView = function(viewRef) {};
  Renderer.prototype.dehydrateView = function(viewRef) {};
  Renderer.prototype.getNativeElementSync = function(location) {
    return null;
  };
  Renderer.prototype.setElementProperty = function(location, propertyName, propertyValue) {};
  Renderer.prototype.setElementAttribute = function(location, attributeName, attributeValue) {};
  Renderer.prototype.setElementClass = function(location, className, isAdd) {};
  Renderer.prototype.setElementStyle = function(location, styleName, styleValue) {};
  Renderer.prototype.invokeElementMethod = function(location, methodName, args) {};
  Renderer.prototype.setText = function(viewRef, textNodeIndex, text) {};
  Renderer.prototype.setEventDispatcher = function(viewRef, dispatcher) {};
  return Renderer;
})();
exports.Renderer = Renderer;
exports.__esModule = true;
