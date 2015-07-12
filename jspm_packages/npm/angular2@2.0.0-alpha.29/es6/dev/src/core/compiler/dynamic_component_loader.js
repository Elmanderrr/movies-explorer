/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/di';
import { Compiler } from './compiler';
import { AppViewManager } from 'angular2/src/core/compiler/view_manager';
/**
 * @exportedAs angular2/view
 */
export class ComponentRef {
    constructor(location, instance, dispose) {
        this.location = location;
        this.instance = instance;
        this.dispose = dispose;
    }
    get hostView() { return this.location.parentView; }
}
/**
 * Service for dynamically loading a Component into an arbitrary position in the internal Angular
 * application tree.
 *
 * @exportedAs angular2/view
 */
export let DynamicComponentLoader = class {
    constructor(_compiler, _viewManager) {
        this._compiler = _compiler;
        this._viewManager = _viewManager;
    }
    /**
     * Loads a root component that is placed at the first element that matches the
     * component's selector.
     * The loaded component receives injection normally as a hosted view.
     */
    loadAsRoot(typeOrBinding, overrideSelector, injector) {
        return this._compiler.compileInHost(typeOrBinding)
            .then(hostProtoViewRef => {
            var hostViewRef = this._viewManager.createRootHostView(hostProtoViewRef, overrideSelector, injector);
            var newLocation = this._viewManager.getHostElement(hostViewRef);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => { this._viewManager.destroyRootHostView(hostViewRef); };
            return new ComponentRef(newLocation, component, dispose);
        });
    }
    /**
     * Loads a component into the component view of the provided ElementRef
     * next to the element with the given name
     * The loaded component receives
     * injection normally as a hosted view.
     */
    loadIntoLocation(typeOrBinding, hostLocation, anchorName, bindings = null) {
        return this.loadNextToLocation(typeOrBinding, this._viewManager.getNamedElementInComponentView(hostLocation, anchorName), bindings);
    }
    /**
     * Loads a component next to the provided ElementRef. The loaded component receives
     * injection normally as a hosted view.
     */
    loadNextToLocation(typeOrBinding, location, bindings = null) {
        return this._compiler.compileInHost(typeOrBinding)
            .then(hostProtoViewRef => {
            var viewContainer = this._viewManager.getViewContainer(location);
            var hostViewRef = viewContainer.create(hostProtoViewRef, viewContainer.length, null, bindings);
            var newLocation = this._viewManager.getHostElement(hostViewRef);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => {
                var index = viewContainer.indexOf(hostViewRef);
                if (index !== -1) {
                    viewContainer.remove(index);
                }
            };
            return new ComponentRef(newLocation, component, dispose);
        });
    }
};
DynamicComponentLoader = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Compiler, AppViewManager])
], DynamicComponentLoader);
//# sourceMappingURL=dynamic_component_loader.js.map