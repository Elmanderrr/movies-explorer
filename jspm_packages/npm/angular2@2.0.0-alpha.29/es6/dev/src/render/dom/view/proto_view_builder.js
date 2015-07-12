/* */ 
"format cjs";
import { isPresent, isBlank, BaseException, StringWrapper } from 'angular2/src/facade/lang';
import { ListWrapper, MapWrapper, Set, SetWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { ASTWithSource, AstTransformer, AccessMember, LiteralArray, ImplicitReceiver } from 'angular2/change_detection';
import { DomProtoView, DomProtoViewRef, resolveInternalDomProtoView } from './proto_view';
import { ElementBinder, Event } from './element_binder';
import * as api from '../../api';
import { NG_BINDING_CLASS, EVENT_TARGET_SEPARATOR } from '../util';
export class ProtoViewBuilder {
    constructor(rootElement, type) {
        this.rootElement = rootElement;
        this.type = type;
        this.variableBindings = new Map();
        this.elements = [];
    }
    bindElement(element, description = null) {
        var builder = new ElementBinderBuilder(this.elements.length, element, description);
        this.elements.push(builder);
        DOM.addClass(element, NG_BINDING_CLASS);
        return builder;
    }
    bindVariable(name, value) {
        // Store the variable map from value to variable, reflecting how it will be used later by
        // DomView. When a local is set to the view, a lookup for the variable name will take place
        // keyed
        // by the "value", or exported identifier. For example, ng-for sets a view local of "index".
        // When this occurs, a lookup keyed by "index" must occur to find if there is a var referencing
        // it.
        this.variableBindings.set(value, name);
    }
    build() {
        var renderElementBinders = [];
        var apiElementBinders = [];
        var transitiveContentTagCount = 0;
        var boundTextNodeCount = 0;
        ListWrapper.forEach(this.elements, (ebb) => {
            var directiveTemplatePropertyNames = new Set();
            var apiDirectiveBinders = ListWrapper.map(ebb.directives, (dbb) => {
                ebb.eventBuilder.merge(dbb.eventBuilder);
                ListWrapper.forEach(dbb.templatePropertyNames, (name) => directiveTemplatePropertyNames.add(name));
                return new api.DirectiveBinder({
                    directiveIndex: dbb.directiveIndex,
                    propertyBindings: dbb.propertyBindings,
                    eventBindings: dbb.eventBindings,
                    hostPropertyBindings: buildElementPropertyBindings(ebb.element, isPresent(ebb.componentId), dbb.hostPropertyBindings, directiveTemplatePropertyNames)
                });
            });
            var nestedProtoView = isPresent(ebb.nestedProtoView) ? ebb.nestedProtoView.build() : null;
            var nestedRenderProtoView = isPresent(nestedProtoView) ? resolveInternalDomProtoView(nestedProtoView.render) : null;
            if (isPresent(nestedRenderProtoView)) {
                transitiveContentTagCount += nestedRenderProtoView.transitiveContentTagCount;
            }
            if (isPresent(ebb.contentTagSelector)) {
                transitiveContentTagCount++;
            }
            var parentIndex = isPresent(ebb.parent) ? ebb.parent.index : -1;
            apiElementBinders.push(new api.ElementBinder({
                index: ebb.index,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                directives: apiDirectiveBinders,
                nestedProtoView: nestedProtoView,
                propertyBindings: buildElementPropertyBindings(ebb.element, isPresent(ebb.componentId), ebb.propertyBindings, directiveTemplatePropertyNames),
                variableBindings: ebb.variableBindings,
                eventBindings: ebb.eventBindings,
                textBindings: ebb.textBindings,
                readAttributes: ebb.readAttributes
            }));
            var childNodeInfo = this._analyzeChildNodes(ebb.element, ebb.textBindingNodes);
            boundTextNodeCount += ebb.textBindingNodes.length;
            renderElementBinders.push(new ElementBinder({
                textNodeIndices: childNodeInfo.boundTextNodeIndices,
                contentTagSelector: ebb.contentTagSelector,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                nestedProtoView: isPresent(nestedProtoView) ? resolveInternalDomProtoView(nestedProtoView.render) : null,
                componentId: ebb.componentId,
                eventLocals: new LiteralArray(ebb.eventBuilder.buildEventLocals()),
                localEvents: ebb.eventBuilder.buildLocalEvents(),
                globalEvents: ebb.eventBuilder.buildGlobalEvents(),
                elementIsEmpty: childNodeInfo.elementIsEmpty
            }));
        });
        return new api.ProtoViewDto({
            render: new DomProtoViewRef(new DomProtoView({
                element: this.rootElement,
                elementBinders: renderElementBinders,
                transitiveContentTagCount: transitiveContentTagCount,
                boundTextNodeCount: boundTextNodeCount
            })),
            type: this.type,
            elementBinders: apiElementBinders,
            variableBindings: this.variableBindings
        });
    }
    // Note: We need to calculate the next node indices not until the compilation is complete,
    // as the compiler might change the order of elements.
    _analyzeChildNodes(parentElement, boundTextNodes) {
        var childNodes = DOM.childNodes(DOM.templateAwareRoot(parentElement));
        var boundTextNodeIndices = [];
        var indexInBoundTextNodes = 0;
        var elementIsEmpty = true;
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (indexInBoundTextNodes < boundTextNodes.length &&
                node === boundTextNodes[indexInBoundTextNodes]) {
                boundTextNodeIndices.push(i);
                indexInBoundTextNodes++;
                elementIsEmpty = false;
            }
            else if ((DOM.isTextNode(node) && DOM.getText(node).trim().length > 0) ||
                (DOM.isElementNode(node))) {
                elementIsEmpty = false;
            }
        }
        return new _ChildNodesInfo(boundTextNodeIndices, elementIsEmpty);
    }
}
class _ChildNodesInfo {
    constructor(boundTextNodeIndices, elementIsEmpty) {
        this.boundTextNodeIndices = boundTextNodeIndices;
        this.elementIsEmpty = elementIsEmpty;
    }
}
export class ElementBinderBuilder {
    constructor(index, element, description) {
        this.index = index;
        this.element = element;
        this.parent = null;
        this.distanceToParent = 0;
        this.directives = [];
        this.nestedProtoView = null;
        this.propertyBindings = new Map();
        this.variableBindings = new Map();
        this.propertyBindingsToDirectives = new Set();
        this.eventBindings = [];
        this.eventBuilder = new EventBuilder();
        this.textBindingNodes = [];
        this.textBindings = [];
        this.contentTagSelector = null;
        this.readAttributes = new Map();
        this.componentId = null;
    }
    setParent(parent, distanceToParent) {
        this.parent = parent;
        if (isPresent(parent)) {
            this.distanceToParent = distanceToParent;
        }
        return this;
    }
    readAttribute(attrName) {
        if (isBlank(this.readAttributes.get(attrName))) {
            this.readAttributes.set(attrName, DOM.getAttribute(this.element, attrName));
        }
    }
    bindDirective(directiveIndex) {
        var directive = new DirectiveBuilder(directiveIndex);
        this.directives.push(directive);
        return directive;
    }
    bindNestedProtoView(rootElement) {
        if (isPresent(this.nestedProtoView)) {
            throw new BaseException('Only one nested view per element is allowed');
        }
        this.nestedProtoView = new ProtoViewBuilder(rootElement, api.ViewType.EMBEDDED);
        return this.nestedProtoView;
    }
    bindProperty(name, expression) {
        this.propertyBindings.set(name, expression);
    }
    bindPropertyToDirective(name) {
        // we are filling in a set of property names that are bound to a property
        // of at least one directive. This allows us to report "dangling" bindings.
        this.propertyBindingsToDirectives.add(name);
    }
    bindVariable(name, value) {
        // When current is a view root, the variable bindings are set to the *nested* proto view.
        // The root view conceptually signifies a new "block scope" (the nested view), to which
        // the variables are bound.
        if (isPresent(this.nestedProtoView)) {
            this.nestedProtoView.bindVariable(name, value);
        }
        else {
            // Store the variable map from value to variable, reflecting how it will be used later by
            // DomView. When a local is set to the view, a lookup for the variable name will take place
            // keyed
            // by the "value", or exported identifier. For example, ng-for sets a view local of "index".
            // When this occurs, a lookup keyed by "index" must occur to find if there is a var
            // referencing
            // it.
            this.variableBindings.set(value, name);
        }
    }
    bindEvent(name, expression, target = null) {
        this.eventBindings.push(this.eventBuilder.add(name, expression, target));
    }
    bindText(textNode, expression) {
        this.textBindingNodes.push(textNode);
        this.textBindings.push(expression);
    }
    setContentTagSelector(value) { this.contentTagSelector = value; }
    setComponentId(componentId) { this.componentId = componentId; }
}
export class DirectiveBuilder {
    constructor(directiveIndex) {
        this.directiveIndex = directiveIndex;
        // mapping from directive property name to AST for that directive
        this.propertyBindings = new Map();
        // property names used in the template
        this.templatePropertyNames = [];
        this.hostPropertyBindings = new Map();
        this.eventBindings = [];
        this.eventBuilder = new EventBuilder();
    }
    bindProperty(name, expression, elProp) {
        this.propertyBindings.set(name, expression);
        if (isPresent(elProp)) {
            // we are filling in a set of property names that are bound to a property
            // of at least one directive. This allows us to report "dangling" bindings.
            this.templatePropertyNames.push(elProp);
        }
    }
    bindHostProperty(name, expression) {
        this.hostPropertyBindings.set(name, expression);
    }
    bindEvent(name, expression, target = null) {
        this.eventBindings.push(this.eventBuilder.add(name, expression, target));
    }
}
export class EventBuilder extends AstTransformer {
    constructor() {
        super();
        this.locals = [];
        this.localEvents = [];
        this.globalEvents = [];
        this._implicitReceiver = new ImplicitReceiver();
    }
    add(name, source, target) {
        // TODO(tbosch): reenable this when we are parsing element properties
        // out of action expressions
        // var adjustedAst = astWithSource.ast.visit(this);
        var adjustedAst = source.ast;
        var fullName = isPresent(target) ? target + EVENT_TARGET_SEPARATOR + name : name;
        var result = new api.EventBinding(fullName, new ASTWithSource(adjustedAst, source.source, source.location));
        var event = new Event(name, target, fullName);
        if (isBlank(target)) {
            this.localEvents.push(event);
        }
        else {
            this.globalEvents.push(event);
        }
        return result;
    }
    visitAccessMember(ast) {
        var isEventAccess = false;
        var current = ast;
        while (!isEventAccess && (current instanceof AccessMember)) {
            var am = current;
            if (am.name == '$event') {
                isEventAccess = true;
            }
            current = am.receiver;
        }
        if (isEventAccess) {
            this.locals.push(ast);
            var index = this.locals.length - 1;
            return new AccessMember(this._implicitReceiver, `${index}`, (arr) => arr[index], null);
        }
        else {
            return ast;
        }
    }
    buildEventLocals() { return this.locals; }
    buildLocalEvents() { return this.localEvents; }
    buildGlobalEvents() { return this.globalEvents; }
    merge(eventBuilder) {
        this._merge(this.localEvents, eventBuilder.localEvents);
        this._merge(this.globalEvents, eventBuilder.globalEvents);
        ListWrapper.concat(this.locals, eventBuilder.locals);
    }
    _merge(host, tobeAdded) {
        var names = [];
        for (var i = 0; i < host.length; i++) {
            names.push(host[i].fullName);
        }
        for (var j = 0; j < tobeAdded.length; j++) {
            if (!ListWrapper.contains(names, tobeAdded[j].fullName)) {
                host.push(tobeAdded[j]);
            }
        }
    }
}
var PROPERTY_PARTS_SEPARATOR = new RegExp('\\.');
const ATTRIBUTE_PREFIX = 'attr';
const CLASS_PREFIX = 'class';
const STYLE_PREFIX = 'style';
function buildElementPropertyBindings(protoElement, isNgComponent, bindingsInTemplate, directiveTempaltePropertyNames) {
    var propertyBindings = [];
    MapWrapper.forEach(bindingsInTemplate, (ast, propertyNameInTemplate) => {
        var propertyBinding = createElementPropertyBinding(ast, propertyNameInTemplate);
        if (isValidElementPropertyBinding(protoElement, isNgComponent, propertyBinding)) {
            propertyBindings.push(propertyBinding);
        }
        else if (!SetWrapper.has(directiveTempaltePropertyNames, propertyNameInTemplate)) {
            throw new BaseException(`Can't bind to '${propertyNameInTemplate}' since it isn't a know property of the '${DOM.tagName(protoElement).toLowerCase()}' element and there are no matching directives with a corresponding property`);
        }
    });
    return propertyBindings;
}
function isValidElementPropertyBinding(protoElement, isNgComponent, binding) {
    if (binding.type === api.PropertyBindingType.PROPERTY) {
        var tagName = DOM.tagName(protoElement);
        var possibleCustomElement = tagName.indexOf('-') !== -1;
        if (possibleCustomElement && !isNgComponent) {
            // can't tell now as we don't know which properties a custom element will get
            // once it is instantiated
            return true;
        }
        else {
            return DOM.hasProperty(protoElement, binding.property);
        }
    }
    return true;
}
function createElementPropertyBinding(ast, propertyNameInTemplate) {
    var parts = StringWrapper.split(propertyNameInTemplate, PROPERTY_PARTS_SEPARATOR);
    if (parts.length === 1) {
        var propName = parts[0];
        var mappedPropName = StringMapWrapper.get(DOM.attrToPropMap, propName);
        propName = isPresent(mappedPropName) ? mappedPropName : propName;
        return new api.ElementPropertyBinding(api.PropertyBindingType.PROPERTY, ast, propName);
    }
    else if (parts[0] == ATTRIBUTE_PREFIX) {
        return new api.ElementPropertyBinding(api.PropertyBindingType.ATTRIBUTE, ast, parts[1]);
    }
    else if (parts[0] == CLASS_PREFIX) {
        return new api.ElementPropertyBinding(api.PropertyBindingType.CLASS, ast, parts[1]);
    }
    else if (parts[0] == STYLE_PREFIX) {
        var unit = parts.length > 2 ? parts[2] : null;
        return new api.ElementPropertyBinding(api.PropertyBindingType.STYLE, ast, parts[1], unit);
    }
    else {
        throw new BaseException(`Invalid property name ${propertyNameInTemplate}`);
    }
}
//# sourceMappingURL=proto_view_builder.js.map