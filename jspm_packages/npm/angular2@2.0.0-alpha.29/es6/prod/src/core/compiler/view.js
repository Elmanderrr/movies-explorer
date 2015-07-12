/* */ 
"format cjs";
import { ListWrapper, MapWrapper, Map, StringMapWrapper } from 'angular2/src/facade/collection';
import { Locals } from 'angular2/change_detection';
import { ElementBinder } from './element_binder';
import { isPresent, isBlank, BaseException } from 'angular2/src/facade/lang';
import { ViewRef } from './view_ref';
import { ElementRef } from './element_ref';
export class AppViewContainer {
    constructor() {
        // The order in this list matches the DOM order.
        this.views = [];
    }
}
/**
 * Const of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
export class AppView {
    constructor(renderer, proto, protoLocals) {
        this.renderer = renderer;
        this.proto = proto;
        this.render = null;
        this.elementInjectors = null;
        this.changeDetector = null;
        this.componentChildViews = null;
        this.preBuiltObjects = null;
        /**
         * The context against which data-binding expressions in this view are evaluated against.
         * This is always a component instance.
         */
        this.context = null;
        this.viewContainers = ListWrapper.createFixedSize(this.proto.elementBinders.length);
        this.elementRefs = ListWrapper.createFixedSize(this.proto.elementBinders.length);
        this.ref = new ViewRef(this);
        for (var i = 0; i < this.elementRefs.length; i++) {
            this.elementRefs[i] = new ElementRef(this.ref, i, renderer);
        }
        this.locals = new Locals(null, MapWrapper.clone(protoLocals)); // TODO optimize this
    }
    init(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews) {
        this.changeDetector = changeDetector;
        this.elementInjectors = elementInjectors;
        this.rootElementInjectors = rootElementInjectors;
        this.preBuiltObjects = preBuiltObjects;
        this.componentChildViews = componentChildViews;
    }
    setLocal(contextName, value) {
        if (!this.hydrated())
            throw new BaseException('Cannot set locals on dehydrated view.');
        if (!this.proto.variableBindings.has(contextName)) {
            return;
        }
        var templateName = this.proto.variableBindings.get(contextName);
        this.locals.set(templateName, value);
    }
    hydrated() { return isPresent(this.context); }
    /**
     * Triggers the event handlers for the element and the directives.
     *
     * This method is intended to be called from directive EventEmitters.
     *
     * @param {string} eventName
     * @param {*} eventObj
     * @param {int} binderIndex
     */
    triggerEventHandlers(eventName, eventObj, binderIndex) {
        var locals = new Map();
        locals.set('$event', eventObj);
        this.dispatchEvent(binderIndex, eventName, locals);
    }
    // dispatch to element injector or text nodes based on context
    notifyOnBinding(b, currentValue) {
        if (b.isElementProperty()) {
            this.renderer.setElementProperty(this.elementRefs[b.elementIndex], b.propertyName, currentValue);
        }
        else if (b.isElementAttribute()) {
            this.renderer.setElementAttribute(this.elementRefs[b.elementIndex], b.propertyName, currentValue);
        }
        else if (b.isElementClass()) {
            this.renderer.setElementClass(this.elementRefs[b.elementIndex], b.propertyName, currentValue);
        }
        else if (b.isElementStyle()) {
            var unit = isPresent(b.propertyUnit) ? b.propertyUnit : '';
            this.renderer.setElementStyle(this.elementRefs[b.elementIndex], b.propertyName, `${currentValue}${unit}`);
        }
        else if (b.isTextNode()) {
            this.renderer.setText(this.render, b.elementIndex, currentValue);
        }
        else {
            throw new BaseException('Unsupported directive record');
        }
    }
    notifyOnAllChangesDone() {
        var ei = this.elementInjectors;
        for (var i = ei.length - 1; i >= 0; i--) {
            if (isPresent(ei[i]))
                ei[i].onAllChangesDone();
        }
    }
    getDirectiveFor(directive) {
        var elementInjector = this.elementInjectors[directive.elementIndex];
        return elementInjector.getDirectiveAtIndex(directive.directiveIndex);
    }
    getDetectorFor(directive) {
        var childView = this.componentChildViews[directive.elementIndex];
        return isPresent(childView) ? childView.changeDetector : null;
    }
    invokeElementMethod(elementIndex, methodName, args) {
        this.renderer.invokeElementMethod(this.elementRefs[elementIndex], methodName, args);
    }
    // implementation of EventDispatcher#dispatchEvent
    // returns false if preventDefault must be applied to the DOM event
    dispatchEvent(elementIndex, eventName, locals) {
        // Most of the time the event will be fired only when the view is in the live document.
        // However, in a rare circumstance the view might get dehydrated, in between the event
        // queuing up and firing.
        var allowDefaultBehavior = true;
        if (this.hydrated()) {
            var elBinder = this.proto.elementBinders[elementIndex];
            if (isBlank(elBinder.hostListeners))
                return allowDefaultBehavior;
            var eventMap = elBinder.hostListeners[eventName];
            if (isBlank(eventMap))
                return allowDefaultBehavior;
            MapWrapper.forEach(eventMap, (expr, directiveIndex) => {
                var context;
                if (directiveIndex === -1) {
                    context = this.context;
                }
                else {
                    context = this.elementInjectors[elementIndex].getDirectiveAtIndex(directiveIndex);
                }
                var result = expr.eval(context, new Locals(this.locals, locals));
                if (isPresent(result)) {
                    allowDefaultBehavior = allowDefaultBehavior && result == true;
                }
            });
        }
        return allowDefaultBehavior;
    }
}
/**
 *
 */
export class AppProtoView {
    constructor(render, protoChangeDetector, variableBindings, variableLocations) {
        this.render = render;
        this.protoChangeDetector = protoChangeDetector;
        this.variableBindings = variableBindings;
        this.variableLocations = variableLocations;
        this.elementBinders = [];
        this.protoLocals = new Map();
        if (isPresent(variableBindings)) {
            MapWrapper.forEach(variableBindings, (templateName, _) => { this.protoLocals.set(templateName, null); });
        }
    }
    bindElement(parent, distanceToParent, protoElementInjector, componentDirective = null) {
        var elBinder = new ElementBinder(this.elementBinders.length, parent, distanceToParent, protoElementInjector, componentDirective);
        this.elementBinders.push(elBinder);
        return elBinder;
    }
    /**
     * Adds an event binding for the last created ElementBinder via bindElement.
     *
     * If the directive index is a positive integer, the event is evaluated in the context of
     * the given directive.
     *
     * If the directive index is -1, the event is evaluated in the context of the enclosing view.
     *
     * @param {string} eventName
     * @param {AST} expression
     * @param {int} directiveIndex The directive index in the binder or -1 when the event is not bound
     *                             to a directive
     */
    bindEvent(eventBindings, boundElementIndex, directiveIndex = -1) {
        var elBinder = this.elementBinders[boundElementIndex];
        var events = elBinder.hostListeners;
        if (isBlank(events)) {
            events = StringMapWrapper.create();
            elBinder.hostListeners = events;
        }
        for (var i = 0; i < eventBindings.length; i++) {
            var eventBinding = eventBindings[i];
            var eventName = eventBinding.fullName;
            var event = StringMapWrapper.get(events, eventName);
            if (isBlank(event)) {
                event = new Map();
                StringMapWrapper.set(events, eventName, event);
            }
            event.set(directiveIndex, eventBinding.source);
        }
    }
}
//# sourceMappingURL=view.js.map