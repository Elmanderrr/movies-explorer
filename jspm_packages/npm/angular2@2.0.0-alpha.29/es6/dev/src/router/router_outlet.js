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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { PromiseWrapper } from 'angular2/src/facade/async';
import { isPresent } from 'angular2/src/facade/lang';
import { Directive, Attribute } from 'angular2/src/core/annotations/decorators';
import { DynamicComponentLoader, ElementRef } from 'angular2/core';
import { Injector, bind } from 'angular2/di';
import * as routerMod from './router';
import { RouteParams } from './instruction';
/**
 * A router outlet is a placeholder that Angular dynamically fills based on the application's route.
 *
 * ## Use
 *
 * ```
 * <router-outlet></router-outlet>
 * ```
 */
export let RouterOutlet = class {
    constructor(_elementRef, _loader, _parentRouter, nameAttr) {
        this._elementRef = _elementRef;
        this._loader = _loader;
        this._parentRouter = _parentRouter;
        this._childRouter = null;
        this._componentRef = null;
        this._currentInstruction = null;
        // TODO: reintroduce with new // sibling routes
        // if (isBlank(nameAttr)) {
        //  nameAttr = 'default';
        //}
        this._parentRouter.registerOutlet(this);
    }
    /**
     * Given an instruction, update the contents of this outlet.
     */
    activate(instruction) {
        // if we're able to reuse the component, we just have to pass along the instruction to the
        // component's router
        // so it can propagate changes to its children
        if ((instruction == this._currentInstruction || instruction.reuse) &&
            isPresent(this._childRouter)) {
            return this._childRouter.commit(instruction.child);
        }
        this._currentInstruction = instruction;
        this._childRouter = this._parentRouter.childRouter(instruction.component);
        var params = new RouteParams(instruction.params());
        var bindings = Injector.resolve([bind(RouteParams).toValue(params), bind(routerMod.Router).toValue(this._childRouter)]);
        return this.deactivate()
            .then((_) => this._loader.loadNextToLocation(instruction.component, this._elementRef, bindings))
            .then((componentRef) => {
            this._componentRef = componentRef;
            return this._childRouter.commit(instruction.child);
        });
    }
    deactivate() {
        return (isPresent(this._childRouter) ? this._childRouter.deactivate() :
            PromiseWrapper.resolve(true))
            .then((_) => {
            if (isPresent(this._componentRef)) {
                this._componentRef.dispose();
                this._componentRef = null;
            }
        });
    }
    canDeactivate(instruction) {
        // TODO: how to get ahold of the component instance here?
        return PromiseWrapper.resolve(true);
    }
};
RouterOutlet = __decorate([
    Directive({
        selector: 'router-outlet'
    }),
    __param(3, Attribute('name')), 
    __metadata('design:paramtypes', [ElementRef, DynamicComponentLoader, routerMod.Router, String])
], RouterOutlet);
//# sourceMappingURL=router_outlet.js.map