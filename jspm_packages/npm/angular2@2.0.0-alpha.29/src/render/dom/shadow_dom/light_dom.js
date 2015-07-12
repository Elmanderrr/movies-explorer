/* */ 
'use strict';
var dom_adapter_1 = require("../../../dom/dom_adapter");
var collection_1 = require("../../../facade/collection");
var lang_1 = require("../../../facade/lang");
var DestinationLightDom = (function() {
  function DestinationLightDom() {}
  return DestinationLightDom;
})();
exports.DestinationLightDom = DestinationLightDom;
var _Root = (function() {
  function _Root(node, boundElement) {
    this.node = node;
    this.boundElement = boundElement;
  }
  return _Root;
})();
var LightDom = (function() {
  function LightDom(lightDomView, element) {
    this.shadowDomView = null;
    this._roots = null;
    this.lightDomView = lightDomView;
    this.nodes = dom_adapter_1.DOM.childNodesAsList(element);
  }
  LightDom.prototype.attachShadowDomView = function(shadowDomView) {
    this.shadowDomView = shadowDomView;
  };
  LightDom.prototype.detachShadowDomView = function() {
    this.shadowDomView = null;
  };
  LightDom.prototype.redistribute = function() {
    redistributeNodes(this.contentTags(), this.expandedDomNodes());
  };
  LightDom.prototype.contentTags = function() {
    if (lang_1.isPresent(this.shadowDomView)) {
      return this._collectAllContentTags(this.shadowDomView, []);
    } else {
      return [];
    }
  };
  LightDom.prototype._collectAllContentTags = function(view, acc) {
    var _this = this;
    if (view.proto.transitiveContentTagCount === 0) {
      return acc;
    }
    var els = view.boundElements;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (lang_1.isPresent(el.contentTag)) {
        acc.push(el.contentTag);
      }
      if (lang_1.isPresent(el.viewContainer)) {
        collection_1.ListWrapper.forEach(el.viewContainer.contentTagContainers(), function(view) {
          _this._collectAllContentTags(view, acc);
        });
      }
    }
    return acc;
  };
  LightDom.prototype.expandedDomNodes = function() {
    var res = [];
    var roots = this._findRoots();
    for (var i = 0; i < roots.length; ++i) {
      var root = roots[i];
      if (lang_1.isPresent(root.boundElement)) {
        var vc = root.boundElement.viewContainer;
        var content = root.boundElement.contentTag;
        if (lang_1.isPresent(vc)) {
          res = collection_1.ListWrapper.concat(res, vc.nodes());
        } else if (lang_1.isPresent(content)) {
          res = collection_1.ListWrapper.concat(res, content.nodes());
        } else {
          res.push(root.node);
        }
      } else {
        res.push(root.node);
      }
    }
    return res;
  };
  LightDom.prototype._findRoots = function() {
    if (lang_1.isPresent(this._roots))
      return this._roots;
    var boundElements = this.lightDomView.boundElements;
    this._roots = collection_1.ListWrapper.map(this.nodes, function(n) {
      var boundElement = null;
      for (var i = 0; i < boundElements.length; i++) {
        var boundEl = boundElements[i];
        if (lang_1.isPresent(boundEl) && boundEl.element === n) {
          boundElement = boundEl;
          break;
        }
      }
      return new _Root(n, boundElement);
    });
    return this._roots;
  };
  return LightDom;
})();
exports.LightDom = LightDom;
function redistributeNodes(contents, nodes) {
  for (var i = 0; i < contents.length; ++i) {
    var content = contents[i];
    var select = content.select;
    if (select.length === 0) {
      content.insert(collection_1.ListWrapper.clone(nodes));
      collection_1.ListWrapper.clear(nodes);
    } else {
      var matchSelector = function(n) {
        return dom_adapter_1.DOM.elementMatches(n, select);
      };
      var matchingNodes = collection_1.ListWrapper.filter(nodes, matchSelector);
      content.insert(matchingNodes);
      collection_1.ListWrapper.removeAll(nodes, matchingNodes);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (lang_1.isPresent(node.parentNode)) {
      dom_adapter_1.DOM.remove(nodes[i]);
    }
  }
}
exports.__esModule = true;
