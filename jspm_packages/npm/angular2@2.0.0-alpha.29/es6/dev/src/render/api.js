/* */ 
"format cjs";
import { isPresent, isBlank, RegExpWrapper } from 'angular2/src/facade/lang';
import { Map, MapWrapper } from 'angular2/src/facade/collection';
/**
 * General notes:
 *
 * The methods for creating / destroying views in this API are used in the AppViewHydrator
 * and RenderViewHydrator as well.
 *
 * We are already parsing expressions on the render side:
 * - this makes the ElementBinders more compact
 *   (e.g. no need to distinguish interpolations from regular expressions from literals)
 * - allows to retrieve which properties should be accessed from the event
 *   by looking at the expression
 * - we need the parse at least for the `template` attribute to match
 *   directives in it
 * - render compiler is not on the critical path as
 *   its output will be stored in precompiled templates.
 */
export class EventBinding {
    constructor(fullName, source) {
        this.fullName = fullName;
        this.source = source;
    }
}
export var PropertyBindingType;
(function (PropertyBindingType) {
    PropertyBindingType[PropertyBindingType["PROPERTY"] = 0] = "PROPERTY";
    PropertyBindingType[PropertyBindingType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
    PropertyBindingType[PropertyBindingType["CLASS"] = 2] = "CLASS";
    PropertyBindingType[PropertyBindingType["STYLE"] = 3] = "STYLE";
})(PropertyBindingType || (PropertyBindingType = {}));
export class ElementPropertyBinding {
    constructor(type, astWithSource, property, unit = null) {
        this.type = type;
        this.astWithSource = astWithSource;
        this.property = property;
        this.unit = unit;
    }
}
export class ElementBinder {
    constructor({ index, parentIndex, distanceToParent, directives, nestedProtoView, propertyBindings, variableBindings, eventBindings, textBindings, readAttributes } = {}) {
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
}
export class DirectiveBinder {
    constructor({ directiveIndex, propertyBindings, eventBindings, hostPropertyBindings }) {
        this.directiveIndex = directiveIndex;
        this.propertyBindings = propertyBindings;
        this.eventBindings = eventBindings;
        this.hostPropertyBindings = hostPropertyBindings;
    }
}
export var ViewType;
(function (ViewType) {
    // A view that contains the host element with bound component directive.
    // Contains a COMPONENT view
    ViewType[ViewType["HOST"] = 0] = "HOST";
    // The view of the component
    // Can contain 0 to n EMBEDDED views
    ViewType[ViewType["COMPONENT"] = 1] = "COMPONENT";
    // A view that is embedded into another View via a <template> element
    // inside of a COMPONENT view
    ViewType[ViewType["EMBEDDED"] = 2] = "EMBEDDED";
})(ViewType || (ViewType = {}));
export class ProtoViewDto {
    constructor({ render, elementBinders, variableBindings, type }) {
        this.render = render;
        this.elementBinders = elementBinders;
        this.variableBindings = variableBindings;
        this.type = type;
    }
}
// group 1: property from "[property]"
// group 2: event from "(event)"
// group 3: action from "@action"
var hostRegExp = RegExpWrapper.create('^(?:(?:\\[([^\\]]+)\\])|(?:\\(([^\\)]+)\\))|(?:@(.+)))$');
export class DirectiveMetadata {
    constructor({ id, selector, compileChildren, events, hostListeners, hostProperties, hostAttributes, hostActions, properties, readAttributes, type, callOnDestroy, callOnChange, callOnCheck, callOnInit, callOnAllChangesDone, changeDetection, exportAs }) {
        this.id = id;
        this.selector = selector;
        this.compileChildren = isPresent(compileChildren) ? compileChildren : true;
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
    static get DIRECTIVE_TYPE() { return 0; }
    static get COMPONENT_TYPE() { return 1; }
    static create({ id, selector, compileChildren, events, host, properties, readAttributes, type, callOnDestroy, callOnChange, callOnCheck, callOnInit, callOnAllChangesDone, changeDetection, exportAs }) {
        let hostListeners = new Map();
        let hostProperties = new Map();
        let hostAttributes = new Map();
        let hostActions = new Map();
        if (isPresent(host)) {
            MapWrapper.forEach(host, (value, key) => {
                var matches = RegExpWrapper.firstMatch(hostRegExp, key);
                if (isBlank(matches)) {
                    hostAttributes.set(key, value);
                }
                else if (isPresent(matches[1])) {
                    hostProperties.set(matches[1], value);
                }
                else if (isPresent(matches[2])) {
                    hostListeners.set(matches[2], value);
                }
                else if (isPresent(matches[3])) {
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
    }
}
// An opaque reference to a DomProtoView
export class RenderProtoViewRef {
}
// An opaque reference to a DomView
export class RenderViewRef {
}
export class ViewDefinition {
    constructor({ componentId, templateAbsUrl, template, styleAbsUrls, styles, directives }) {
        this.componentId = componentId;
        this.templateAbsUrl = templateAbsUrl;
        this.template = template;
        this.styleAbsUrls = styleAbsUrls;
        this.styles = styles;
        this.directives = directives;
    }
}
export class RenderCompiler {
    /**
     * Creats a ProtoViewDto that contains a single nested component with the given componentId.
     */
    compileHost(directiveMetadata) { return null; }
    /**
     * Compiles a single DomProtoView. Non recursive so that
     * we don't need to serialize all possible components over the wire,
     * but only the needed ones based on previous calls.
     */
    compile(view) { return null; }
}
export class Renderer {
    /**
     * Creates a root host view that includes the given element.
     * @param {RenderProtoViewRef} hostProtoViewRef a RenderProtoViewRef of type
     * ProtoViewDto.HOST_VIEW_TYPE
     * @param {any} hostElementSelector css selector for the host element (will be queried against the
     * main document)
     * @return {RenderViewRef} the created view
     */
    createRootHostView(hostProtoViewRef, hostElementSelector) {
        return null;
    }
    /**
     * Creates a regular view out of the given ProtoView
     */
    createView(protoViewRef) { return null; }
    /**
     * Destroys the given view after it has been dehydrated and detached
     */
    destroyView(viewRef) { }
    /**
     * Attaches a componentView into the given hostView at the given element
     */
    attachComponentView(location, componentViewRef) { }
    /**
     * Detaches a componentView into the given hostView at the given element
     */
    detachComponentView(location, componentViewRef) { }
    /**
     * Attaches a view into a ViewContainer (in the given parentView at the given element) at the
     * given index.
     */
    attachViewInContainer(location, atIndex, viewRef) { }
    /**
     * Detaches a view into a ViewContainer (in the given parentView at the given element) at the
     * given index.
     */
    // TODO(tbosch): this should return a promise as it can be animated!
    detachViewInContainer(location, atIndex, viewRef) { }
    /**
     * Hydrates a view after it has been attached. Hydration/dehydration is used for reusing views
     * inside of the view pool.
     */
    hydrateView(viewRef) { }
    /**
     * Dehydrates a view after it has been attached. Hydration/dehydration is used for reusing views
     * inside of the view pool.
     */
    dehydrateView(viewRef) { }
    /**
     * Returns the native element at the given location.
     * Attention: In a WebWorker scenario, this should always return null!
     */
    getNativeElementSync(location) { return null; }
    /**
     * Sets a property on an element.
     */
    setElementProperty(location, propertyName, propertyValue) { }
    /**
     * Sets an attribute on an element.
     */
    setElementAttribute(location, attributeName, attributeValue) { }
    /**
     * Sets a class on an element.
     */
    setElementClass(location, className, isAdd) { }
    /**
     * Sets a style on an element.
     */
    setElementStyle(location, styleName, styleValue) { }
    /**
     * Calls a method on an element.
     */
    invokeElementMethod(location, methodName, args) { }
    /**
     * Sets the value of a text node.
     */
    setText(viewRef, textNodeIndex, text) { }
    /**
     * Sets the dispatcher for all events of the given view
     */
    setEventDispatcher(viewRef, dispatcher) { }
}
//# sourceMappingURL=api.js.map