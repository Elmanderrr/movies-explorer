import { ViewDefinition, ProtoViewDto, ViewType, DirectiveMetadata, RenderCompiler } from '../../api';
import { ViewLoader } from 'angular2/src/render/dom/compiler/view_loader';
import { CompileStepFactory } from './compile_step_factory';
import { Parser } from 'angular2/change_detection';
import { ShadowDomStrategy } from '../shadow_dom/shadow_dom_strategy';
/**
 * The compiler loads and translates the html templates of components into
 * nested ProtoViews. To decompose its functionality it uses
 * the CompilePipeline and the CompileSteps.
 */
export declare class DomCompiler extends RenderCompiler {
    _stepFactory: CompileStepFactory;
    _viewLoader: ViewLoader;
    constructor(_stepFactory: CompileStepFactory, _viewLoader: ViewLoader);
    compile(view: ViewDefinition): Promise<ProtoViewDto>;
    compileHost(directiveMetadata: DirectiveMetadata): Promise<ProtoViewDto>;
    _compileTemplate(viewDef: ViewDefinition, tplElement: any, protoViewType: ViewType): Promise<ProtoViewDto>;
}
export declare class DefaultDomCompiler extends DomCompiler {
    constructor(parser: Parser, shadowDomStrategy: ShadowDomStrategy, viewLoader: ViewLoader);
}
export declare var __esModule: boolean;
