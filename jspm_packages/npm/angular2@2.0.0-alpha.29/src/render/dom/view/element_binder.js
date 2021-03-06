/* */ 
'use strict';var ElementBinder = (function () {
    function ElementBinder(_a) {
        var _b = _a === void 0 ? {} : _a, textNodeIndices = _b.textNodeIndices, contentTagSelector = _b.contentTagSelector, nestedProtoView = _b.nestedProtoView, componentId = _b.componentId, eventLocals = _b.eventLocals, localEvents = _b.localEvents, globalEvents = _b.globalEvents, parentIndex = _b.parentIndex, distanceToParent = _b.distanceToParent, elementIsEmpty = _b.elementIsEmpty;
        this.textNodeIndices = textNodeIndices;
        this.contentTagSelector = contentTagSelector;
        this.nestedProtoView = nestedProtoView;
        this.componentId = componentId;
        this.eventLocals = eventLocals;
        this.localEvents = localEvents;
        this.globalEvents = globalEvents;
        this.parentIndex = parentIndex;
        this.distanceToParent = distanceToParent;
        this.elementIsEmpty = elementIsEmpty;
    }
    return ElementBinder;
})();
exports.ElementBinder = ElementBinder;
var Event = (function () {
    function Event(name, target, fullName) {
        this.name = name;
        this.target = target;
        this.fullName = fullName;
    }
    return Event;
})();
exports.Event = Event;
var HostAction = (function () {
    function HostAction(actionName, actionExpression, expression) {
        this.actionName = actionName;
        this.actionExpression = actionExpression;
        this.expression = expression;
    }
    return HostAction;
})();
exports.HostAction = HostAction;
exports.__esModule = true;
//# sourceMappingURL=element_binder.js.map