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
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var di_1 = require("../../../di");
var lang_1 = require("../../facade/lang");
var collection_1 = require("../../facade/collection");
var dom_adapter_1 = require("../../dom/dom_adapter");
var content_tag_1 = require("./shadow_dom/content_tag");
var shadow_dom_strategy_1 = require("./shadow_dom/shadow_dom_strategy");
var event_manager_1 = require("./events/event_manager");
var proto_view_1 = require("./view/proto_view");
var view_1 = require("./view/view");
var element_1 = require("./view/element");
var view_container_1 = require("./view/view_container");
var util_1 = require("./util");
var api_1 = require("../api");
exports.DOCUMENT_TOKEN = lang_1.CONST_EXPR(new di_1.OpaqueToken('DocumentToken'));
var DomRenderer = (function(_super) {
  __extends(DomRenderer, _super);
  function DomRenderer(_eventManager, _shadowDomStrategy, document) {
    _super.call(this);
    this._eventManager = _eventManager;
    this._shadowDomStrategy = _shadowDomStrategy;
    this._document = document;
  }
  DomRenderer.prototype.createRootHostView = function(hostProtoViewRef, hostElementSelector) {
    var hostProtoView = proto_view_1.resolveInternalDomProtoView(hostProtoViewRef);
    var element = dom_adapter_1.DOM.querySelector(this._document, hostElementSelector);
    if (lang_1.isBlank(element)) {
      throw new lang_1.BaseException("The selector \"" + hostElementSelector + "\" did not match any elements");
    }
    return new view_1.DomViewRef(this._createView(hostProtoView, element));
  };
  DomRenderer.prototype.createView = function(protoViewRef) {
    var protoView = proto_view_1.resolveInternalDomProtoView(protoViewRef);
    return new view_1.DomViewRef(this._createView(protoView, null));
  };
  DomRenderer.prototype.destroyView = function(view) {};
  DomRenderer.prototype.getNativeElementSync = function(location) {
    return view_1.resolveInternalDomView(location.renderView).boundElements[location.boundElementIndex].element;
  };
  DomRenderer.prototype.attachComponentView = function(location, componentViewRef) {
    var hostView = view_1.resolveInternalDomView(location.renderView);
    var componentView = view_1.resolveInternalDomView(componentViewRef);
    var element = hostView.boundElements[location.boundElementIndex].element;
    var lightDom = hostView.boundElements[location.boundElementIndex].lightDom;
    if (lang_1.isPresent(lightDom)) {
      lightDom.attachShadowDomView(componentView);
    }
    var shadowRoot = this._shadowDomStrategy.prepareShadowRoot(element);
    this._moveViewNodesIntoParent(shadowRoot, componentView);
    componentView.hostLightDom = lightDom;
    componentView.shadowRoot = shadowRoot;
  };
  DomRenderer.prototype.setComponentViewRootNodes = function(componentViewRef, rootNodes) {
    var componentView = view_1.resolveInternalDomView(componentViewRef);
    this._removeViewNodes(componentView);
    componentView.rootNodes = rootNodes;
    this._moveViewNodesIntoParent(componentView.shadowRoot, componentView);
  };
  DomRenderer.prototype.getRootNodes = function(viewRef) {
    return view_1.resolveInternalDomView(viewRef).rootNodes;
  };
  DomRenderer.prototype.detachComponentView = function(location, componentViewRef) {
    var hostView = view_1.resolveInternalDomView(location.renderView);
    var componentView = view_1.resolveInternalDomView(componentViewRef);
    this._removeViewNodes(componentView);
    var lightDom = hostView.boundElements[location.boundElementIndex].lightDom;
    if (lang_1.isPresent(lightDom)) {
      lightDom.detachShadowDomView();
    }
    componentView.hostLightDom = null;
    componentView.shadowRoot = null;
  };
  DomRenderer.prototype.attachViewInContainer = function(location, atIndex, viewRef) {
    var parentView = view_1.resolveInternalDomView(location.renderView);
    var view = view_1.resolveInternalDomView(viewRef);
    var viewContainer = this._getOrCreateViewContainer(parentView, location.boundElementIndex);
    collection_1.ListWrapper.insert(viewContainer.views, atIndex, view);
    view.hostLightDom = parentView.hostLightDom;
    var directParentLightDom = this._directParentLightDom(parentView, location.boundElementIndex);
    if (lang_1.isBlank(directParentLightDom)) {
      var siblingToInsertAfter;
      if (atIndex == 0) {
        siblingToInsertAfter = parentView.boundElements[location.boundElementIndex].element;
      } else {
        siblingToInsertAfter = collection_1.ListWrapper.last(viewContainer.views[atIndex - 1].rootNodes);
      }
      this._moveViewNodesAfterSibling(siblingToInsertAfter, view);
    } else {
      directParentLightDom.redistribute();
    }
    if (lang_1.isPresent(parentView.hostLightDom)) {
      parentView.hostLightDom.redistribute();
    }
  };
  DomRenderer.prototype.detachViewInContainer = function(location, atIndex, viewRef) {
    var parentView = view_1.resolveInternalDomView(location.renderView);
    var view = view_1.resolveInternalDomView(viewRef);
    var viewContainer = parentView.boundElements[location.boundElementIndex].viewContainer;
    var detachedView = viewContainer.views[atIndex];
    collection_1.ListWrapper.removeAt(viewContainer.views, atIndex);
    var directParentLightDom = this._directParentLightDom(parentView, location.boundElementIndex);
    if (lang_1.isBlank(directParentLightDom)) {
      this._removeViewNodes(detachedView);
    } else {
      directParentLightDom.redistribute();
    }
    view.hostLightDom = null;
    if (lang_1.isPresent(parentView.hostLightDom)) {
      parentView.hostLightDom.redistribute();
    }
  };
  DomRenderer.prototype.hydrateView = function(viewRef) {
    var view = view_1.resolveInternalDomView(viewRef);
    if (view.hydrated)
      throw new lang_1.BaseException('The view is already hydrated.');
    view.hydrated = true;
    for (var i = 0; i < view.boundElements.length; ++i) {
      var lightDom = view.boundElements[i].lightDom;
      if (lang_1.isPresent(lightDom)) {
        lightDom.redistribute();
      }
    }
    view.eventHandlerRemovers = [];
    var binders = view.proto.elementBinders;
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      if (lang_1.isPresent(binder.globalEvents)) {
        for (var i = 0; i < binder.globalEvents.length; i++) {
          var globalEvent = binder.globalEvents[i];
          var remover = this._createGlobalEventListener(view, binderIdx, globalEvent.name, globalEvent.target, globalEvent.fullName);
          view.eventHandlerRemovers.push(remover);
        }
      }
    }
    if (lang_1.isPresent(view.hostLightDom)) {
      view.hostLightDom.redistribute();
    }
  };
  DomRenderer.prototype.dehydrateView = function(viewRef) {
    var view = view_1.resolveInternalDomView(viewRef);
    for (var i = 0; i < view.eventHandlerRemovers.length; i++) {
      view.eventHandlerRemovers[i]();
    }
    view.eventHandlerRemovers = null;
    view.hydrated = false;
  };
  DomRenderer.prototype.setElementProperty = function(location, propertyName, propertyValue) {
    var view = view_1.resolveInternalDomView(location.renderView);
    view.setElementProperty(location.boundElementIndex, propertyName, propertyValue);
  };
  DomRenderer.prototype.setElementAttribute = function(location, attributeName, attributeValue) {
    var view = view_1.resolveInternalDomView(location.renderView);
    view.setElementAttribute(location.boundElementIndex, attributeName, attributeValue);
  };
  DomRenderer.prototype.setElementClass = function(location, className, isAdd) {
    var view = view_1.resolveInternalDomView(location.renderView);
    view.setElementClass(location.boundElementIndex, className, isAdd);
  };
  DomRenderer.prototype.setElementStyle = function(location, styleName, styleValue) {
    var view = view_1.resolveInternalDomView(location.renderView);
    view.setElementStyle(location.boundElementIndex, styleName, styleValue);
  };
  DomRenderer.prototype.invokeElementMethod = function(location, methodName, args) {
    var view = view_1.resolveInternalDomView(location.renderView);
    view.invokeElementMethod(location.boundElementIndex, methodName, args);
  };
  DomRenderer.prototype.setText = function(viewRef, textNodeIndex, text) {
    var view = view_1.resolveInternalDomView(viewRef);
    dom_adapter_1.DOM.setText(view.boundTextNodes[textNodeIndex], text);
  };
  DomRenderer.prototype.setEventDispatcher = function(viewRef, dispatcher) {
    var view = view_1.resolveInternalDomView(viewRef);
    view.eventDispatcher = dispatcher;
  };
  DomRenderer.prototype._createView = function(protoView, inplaceElement) {
    var rootElementClone;
    var elementsWithBindingsDynamic;
    var viewRootNodes;
    if (lang_1.isPresent(inplaceElement)) {
      rootElementClone = inplaceElement;
      elementsWithBindingsDynamic = [];
      viewRootNodes = [inplaceElement];
    } else if (protoView.isTemplateElement) {
      rootElementClone = dom_adapter_1.DOM.importIntoDoc(dom_adapter_1.DOM.content(protoView.element));
      elementsWithBindingsDynamic = dom_adapter_1.DOM.querySelectorAll(rootElementClone, util_1.NG_BINDING_CLASS_SELECTOR);
      viewRootNodes = collection_1.ListWrapper.createFixedSize(protoView.rootNodeCount);
      var childNode = dom_adapter_1.DOM.firstChild(rootElementClone);
      for (var i = 0; i < protoView.rootNodeCount; i++, childNode = dom_adapter_1.DOM.nextSibling(childNode)) {
        viewRootNodes[i] = childNode;
      }
    } else {
      rootElementClone = dom_adapter_1.DOM.importIntoDoc(protoView.element);
      elementsWithBindingsDynamic = dom_adapter_1.DOM.getElementsByClassName(rootElementClone, util_1.NG_BINDING_CLASS);
      viewRootNodes = [rootElementClone];
    }
    var binders = protoView.elementBinders;
    var boundTextNodes = collection_1.ListWrapper.createFixedSize(protoView.boundTextNodeCount);
    var boundElements = collection_1.ListWrapper.createFixedSize(binders.length);
    var boundTextNodeIdx = 0;
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      var element;
      var childNodes;
      if (binderIdx === 0 && protoView.rootBindingOffset === 1) {
        element = protoView.isTemplateElement ? null : rootElementClone;
        childNodes = dom_adapter_1.DOM.childNodes(rootElementClone);
      } else {
        element = elementsWithBindingsDynamic[binderIdx - protoView.rootBindingOffset];
        childNodes = dom_adapter_1.DOM.childNodes(element);
      }
      var textNodeIndices = binder.textNodeIndices;
      for (var i = 0; i < textNodeIndices.length; i++) {
        boundTextNodes[boundTextNodeIdx++] = childNodes[textNodeIndices[i]];
      }
      var contentTag = null;
      if (lang_1.isPresent(binder.contentTagSelector)) {
        contentTag = new content_tag_1.Content(element, binder.contentTagSelector);
      }
      boundElements[binderIdx] = new element_1.DomElement(binder, element, contentTag);
    }
    var view = new view_1.DomView(protoView, viewRootNodes, boundTextNodes, boundElements);
    for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
      var binder = binders[binderIdx];
      var element = boundElements[binderIdx];
      var domEl = element.element;
      var lightDom = null;
      if (lang_1.isPresent(binder.componentId) && (!binder.elementIsEmpty || lang_1.isPresent(inplaceElement))) {
        lightDom = this._shadowDomStrategy.constructLightDom(view, domEl);
      }
      element.lightDom = lightDom;
      var contentTag = element.contentTag;
      if (lang_1.isPresent(contentTag)) {
        var directParentLightDom = this._directParentLightDom(view, binderIdx);
        contentTag.init(directParentLightDom);
      }
      if (lang_1.isPresent(binder.eventLocals) && lang_1.isPresent(binder.localEvents)) {
        for (var i = 0; i < binder.localEvents.length; i++) {
          this._createEventListener(view, domEl, binderIdx, binder.localEvents[i].name, binder.eventLocals);
        }
      }
    }
    return view;
  };
  DomRenderer.prototype._createEventListener = function(view, element, elementIndex, eventName, eventLocals) {
    this._eventManager.addEventListener(element, eventName, function(event) {
      view.dispatchEvent(elementIndex, eventName, event);
    });
  };
  DomRenderer.prototype._moveViewNodesAfterSibling = function(sibling, view) {
    for (var i = view.rootNodes.length - 1; i >= 0; --i) {
      dom_adapter_1.DOM.insertAfter(sibling, view.rootNodes[i]);
    }
  };
  DomRenderer.prototype._moveViewNodesIntoParent = function(parent, view) {
    for (var i = 0; i < view.rootNodes.length; ++i) {
      dom_adapter_1.DOM.appendChild(parent, view.rootNodes[i]);
    }
  };
  DomRenderer.prototype._removeViewNodes = function(view) {
    var len = view.rootNodes.length;
    if (len == 0)
      return ;
    var parent = view.rootNodes[0].parentNode;
    for (var i = len - 1; i >= 0; --i) {
      dom_adapter_1.DOM.removeChild(parent, view.rootNodes[i]);
    }
  };
  DomRenderer.prototype._getOrCreateViewContainer = function(parentView, boundElementIndex) {
    var el = parentView.boundElements[boundElementIndex];
    var vc = el.viewContainer;
    if (lang_1.isBlank(vc)) {
      vc = new view_container_1.DomViewContainer();
      el.viewContainer = vc;
    }
    return vc;
  };
  DomRenderer.prototype._directParentLightDom = function(view, boundElementIndex) {
    var directParentEl = view.getDirectParentElement(boundElementIndex);
    return lang_1.isPresent(directParentEl) ? directParentEl.lightDom : null;
  };
  DomRenderer.prototype._createGlobalEventListener = function(view, elementIndex, eventName, eventTarget, fullName) {
    return this._eventManager.addGlobalEventListener(eventTarget, eventName, function(event) {
      view.dispatchEvent(elementIndex, fullName, event);
    });
  };
  DomRenderer = __decorate([di_1.Injectable(), __param(2, di_1.Inject(exports.DOCUMENT_TOKEN)), __metadata('design:paramtypes', [event_manager_1.EventManager, shadow_dom_strategy_1.ShadowDomStrategy, Object])], DomRenderer);
  return DomRenderer;
})(api_1.Renderer);
exports.DomRenderer = DomRenderer;
exports.__esModule = true;
