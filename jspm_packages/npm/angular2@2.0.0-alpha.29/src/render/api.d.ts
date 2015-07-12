import { ASTWithSource } from 'angular2/change_detection';
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
export declare class EventBinding {
    fullName: string;
    source: ASTWithSource;
    constructor(fullName: string, source: ASTWithSource);
}
export declare enum PropertyBindingType {
    PROPERTY = 0,
    ATTRIBUTE = 1,
    CLASS = 2,
    STYLE = 3,
}
export declare class ElementPropertyBinding {
    type: PropertyBindingType;
    astWithSource: ASTWithSource;
    property: string;
    unit: string;
    constructor(type: PropertyBindingType, astWithSource: ASTWithSource, property: string, unit?: string);
}
export declare class ElementBinder {
    index: number;
    parentIndex: number;
    distanceToParent: number;
    directives: List<DirectiveBinder>;
    nestedProtoView: ProtoViewDto;
    propertyBindings: List<ElementPropertyBinding>;
    variableBindings: Map<string, string>;
    eventBindings: List<EventBinding>;
    textBindings: List<ASTWithSource>;
    readAttributes: Map<string, string>;
    constructor({index, parentIndex, distanceToParent, directives, nestedProtoView, propertyBindings, variableBindings, eventBindings, textBindings, readAttributes}?: {
        index?: number;
        parentIndex?: number;
        distanceToParent?: number;
        directives?: List<DirectiveBinder>;
        nestedProtoView?: ProtoViewDto;
        propertyBindings?: List<ElementPropertyBinding>;
        variableBindings?: Map<string, string>;
        eventBindings?: List<EventBinding>;
        textBindings?: List<ASTWithSource>;
        readAttributes?: Map<string, string>;
    });
}
export declare class DirectiveBinder {
    directiveIndex: number;
    propertyBindings: Map<string, ASTWithSource>;
    eventBindings: List<EventBinding>;
    hostPropertyBindings: List<ElementPropertyBinding>;
    constructor({directiveIndex, propertyBindings, eventBindings, hostPropertyBindings}: {
        directiveIndex?: number;
        propertyBindings?: Map<string, ASTWithSource>;
        eventBindings?: List<EventBinding>;
        hostPropertyBindings?: List<ElementPropertyBinding>;
    });
}
export declare enum ViewType {
    HOST = 0,
    COMPONENT = 1,
    EMBEDDED = 2,
}
export declare class ProtoViewDto {
    render: RenderProtoViewRef;
    elementBinders: List<ElementBinder>;
    variableBindings: Map<string, string>;
    type: ViewType;
    constructor({render, elementBinders, variableBindings, type}: {
        render?: RenderProtoViewRef;
        elementBinders?: List<ElementBinder>;
        variableBindings?: Map<string, string>;
        type?: ViewType;
    });
}
export declare class DirectiveMetadata {
    static DIRECTIVE_TYPE: number;
    static COMPONENT_TYPE: number;
    id: any;
    selector: string;
    compileChildren: boolean;
    events: List<string>;
    properties: List<string>;
    readAttributes: List<string>;
    type: number;
    callOnDestroy: boolean;
    callOnChange: boolean;
    callOnCheck: boolean;
    callOnInit: boolean;
    callOnAllChangesDone: boolean;
    changeDetection: string;
    exportAs: string;
    hostListeners: Map<string, string>;
    hostProperties: Map<string, string>;
    hostAttributes: Map<string, string>;
    hostActions: Map<string, string>;
    constructor({id, selector, compileChildren, events, hostListeners, hostProperties, hostAttributes, hostActions, properties, readAttributes, type, callOnDestroy, callOnChange, callOnCheck, callOnInit, callOnAllChangesDone, changeDetection, exportAs}: {
        id?: string;
        selector?: string;
        compileChildren?: boolean;
        events?: List<string>;
        hostListeners?: Map<string, string>;
        hostProperties?: Map<string, string>;
        hostAttributes?: Map<string, string>;
        hostActions?: Map<string, string>;
        properties?: List<string>;
        readAttributes?: List<string>;
        type?: number;
        callOnDestroy?: boolean;
        callOnChange?: boolean;
        callOnCheck?: boolean;
        callOnInit?: boolean;
        callOnAllChangesDone?: boolean;
        changeDetection?: string;
        exportAs?: string;
    });
    static create({id, selector, compileChildren, events, host, properties, readAttributes, type, callOnDestroy, callOnChange, callOnCheck, callOnInit, callOnAllChangesDone, changeDetection, exportAs}: {
        id?: string;
        selector?: string;
        compileChildren?: boolean;
        events?: List<string>;
        host?: Map<string, string>;
        properties?: List<string>;
        readAttributes?: List<string>;
        type?: number;
        callOnDestroy?: boolean;
        callOnChange?: boolean;
        callOnCheck?: boolean;
        callOnInit?: boolean;
        callOnAllChangesDone?: boolean;
        changeDetection?: string;
        exportAs?: string;
    }): DirectiveMetadata;
}
export declare class RenderProtoViewRef {
}
export declare class RenderViewRef {
}
export declare class ViewDefinition {
    componentId: string;
    templateAbsUrl: string;
    template: string;
    directives: List<DirectiveMetadata>;
    styleAbsUrls: List<string>;
    styles: List<string>;
    constructor({componentId, templateAbsUrl, template, styleAbsUrls, styles, directives}: {
        componentId?: string;
        templateAbsUrl?: string;
        template?: string;
        styleAbsUrls?: List<string>;
        styles?: List<string>;
        directives?: List<DirectiveMetadata>;
    });
}
export declare class RenderCompiler {
    /**
     * Creats a ProtoViewDto that contains a single nested component with the given componentId.
     */
    compileHost(directiveMetadata: DirectiveMetadata): Promise<ProtoViewDto>;
    /**
     * Compiles a single DomProtoView. Non recursive so that
     * we don't need to serialize all possible components over the wire,
     * but only the needed ones based on previous calls.
     */
    compile(view: ViewDefinition): Promise<ProtoViewDto>;
}
export interface RenderElementRef {
    renderView: RenderViewRef;
    boundElementIndex: number;
}
export declare class Renderer {
    /**
     * Creates a root host view that includes the given element.
     * @param {RenderProtoViewRef} hostProtoViewRef a RenderProtoViewRef of type
     * ProtoViewDto.HOST_VIEW_TYPE
     * @param {any} hostElementSelector css selector for the host element (will be queried against the
     * main document)
     * @return {RenderViewRef} the created view
     */
    createRootHostView(hostProtoViewRef: RenderProtoViewRef, hostElementSelector: string): RenderViewRef;
    /**
     * Creates a regular view out of the given ProtoView
     */
    createView(protoViewRef: RenderProtoViewRef): RenderViewRef;
    /**
     * Destroys the given view after it has been dehydrated and detached
     */
    destroyView(viewRef: RenderViewRef): void;
    /**
     * Attaches a componentView into the given hostView at the given element
     */
    attachComponentView(location: RenderElementRef, componentViewRef: RenderViewRef): void;
    /**
     * Detaches a componentView into the given hostView at the given element
     */
    detachComponentView(location: RenderElementRef, componentViewRef: RenderViewRef): void;
    /**
     * Attaches a view into a ViewContainer (in the given parentView at the given element) at the
     * given index.
     */
    attachViewInContainer(location: RenderElementRef, atIndex: number, viewRef: RenderViewRef): void;
    /**
     * Detaches a view into a ViewContainer (in the given parentView at the given element) at the
     * given index.
     */
    detachViewInContainer(location: RenderElementRef, atIndex: number, viewRef: RenderViewRef): void;
    /**
     * Hydrates a view after it has been attached. Hydration/dehydration is used for reusing views
     * inside of the view pool.
     */
    hydrateView(viewRef: RenderViewRef): void;
    /**
     * Dehydrates a view after it has been attached. Hydration/dehydration is used for reusing views
     * inside of the view pool.
     */
    dehydrateView(viewRef: RenderViewRef): void;
    /**
     * Returns the native element at the given location.
     * Attention: In a WebWorker scenario, this should always return null!
     */
    getNativeElementSync(location: RenderElementRef): any;
    /**
     * Sets a property on an element.
     */
    setElementProperty(location: RenderElementRef, propertyName: string, propertyValue: any): void;
    /**
     * Sets an attribute on an element.
     */
    setElementAttribute(location: RenderElementRef, attributeName: string, attributeValue: string): void;
    /**
     * Sets a class on an element.
     */
    setElementClass(location: RenderElementRef, className: string, isAdd: boolean): void;
    /**
     * Sets a style on an element.
     */
    setElementStyle(location: RenderElementRef, styleName: string, styleValue: string): void;
    /**
     * Calls a method on an element.
     */
    invokeElementMethod(location: RenderElementRef, methodName: string, args: List<any>): void;
    /**
     * Sets the value of a text node.
     */
    setText(viewRef: RenderViewRef, textNodeIndex: number, text: string): void;
    /**
     * Sets the dispatcher for all events of the given view
     */
    setEventDispatcher(viewRef: RenderViewRef, dispatcher: EventDispatcher): void;
}
/**
 * A dispatcher for all events happening in a view.
 */
export interface EventDispatcher {
    /**
     * Called when an event was triggered for a on-* attribute on an element.
     * @param {Map<string, any>} locals Locals to be used to evaluate the
     *   event expressions
     */
    dispatchEvent(elementIndex: number, eventName: string, locals: Map<string, any>): any;
}
export declare var __esModule: boolean;
