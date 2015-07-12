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
import { PromiseWrapper } from 'angular2/src/facade/async';
import { BaseException } from 'angular2/src/facade/lang';
import { DOM } from 'angular2/src/dom/dom_adapter';
import { ViewDefinition, ViewType, RenderCompiler } from '../../api';
import { CompilePipeline } from './compile_pipeline';
import { ViewLoader } from 'angular2/src/render/dom/compiler/view_loader';
import { DefaultStepFactory } from './compile_step_factory';
import { Parser } from 'angular2/change_detection';
import { ShadowDomStrategy } from '../shadow_dom/shadow_dom_strategy';
/**
 * The compiler loads and translates the html templates of components into
 * nested ProtoViews. To decompose its functionality it uses
 * the CompilePipeline and the CompileSteps.
 */
export class DomCompiler extends RenderCompiler {
    constructor(_stepFactory, _viewLoader) {
        super();
        this._stepFactory = _stepFactory;
        this._viewLoader = _viewLoader;
    }
    compile(view) {
        var tplPromise = this._viewLoader.load(view);
        return PromiseWrapper.then(tplPromise, (el) => this._compileTemplate(view, el, ViewType.COMPONENT), (e) => {
            throw new BaseException(`Failed to load the template for "${view.componentId}" : ${e}`);
        });
    }
    compileHost(directiveMetadata) {
        var hostViewDef = new ViewDefinition({
            componentId: directiveMetadata.id,
            templateAbsUrl: null, template: null,
            styles: null,
            styleAbsUrls: null,
            directives: [directiveMetadata]
        });
        var element = DOM.createElement(directiveMetadata.selector);
        return this._compileTemplate(hostViewDef, element, ViewType.HOST);
    }
    _compileTemplate(viewDef, tplElement, protoViewType) {
        var pipeline = new CompilePipeline(this._stepFactory.createSteps(viewDef));
        var compileElements = pipeline.process(tplElement, protoViewType, viewDef.componentId);
        return PromiseWrapper.resolve(compileElements[0].inheritedProtoView.build());
    }
}
export let DefaultDomCompiler = class extends DomCompiler {
    constructor(parser, shadowDomStrategy, viewLoader) {
        super(new DefaultStepFactory(parser, shadowDomStrategy), viewLoader);
    }
};
DefaultDomCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Parser, ShadowDomStrategy, ViewLoader])
], DefaultDomCompiler);
//# sourceMappingURL=compiler.js.map