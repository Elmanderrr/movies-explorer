/* */ 
"format cjs";
import { PropertyBindingParser } from './property_binding_parser';
import { TextInterpolationParser } from './text_interpolation_parser';
import { DirectiveParser } from './directive_parser';
import { ViewSplitter } from './view_splitter';
import { ShadowDomCompileStep } from '../shadow_dom/shadow_dom_compile_step';
export class CompileStepFactory {
    createSteps(view) { return null; }
}
export class DefaultStepFactory extends CompileStepFactory {
    constructor(_parser, _shadowDomStrategy) {
        super();
        this._parser = _parser;
        this._shadowDomStrategy = _shadowDomStrategy;
    }
    createSteps(view) {
        return [
            new ViewSplitter(this._parser),
            new PropertyBindingParser(this._parser),
            new DirectiveParser(this._parser, view.directives),
            new TextInterpolationParser(this._parser),
            new ShadowDomCompileStep(this._shadowDomStrategy, view)
        ];
    }
}
//# sourceMappingURL=compile_step_factory.js.map