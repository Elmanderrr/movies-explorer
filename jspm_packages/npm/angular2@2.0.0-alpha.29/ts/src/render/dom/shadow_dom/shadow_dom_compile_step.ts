import {isBlank, isPresent, assertionsEnabled, isPromise} from 'angular2/src/facade/lang';

import {DOM} from 'angular2/src/dom/dom_adapter';

import {CompileStep} from '../compiler/compile_step';
import {CompileElement} from '../compiler/compile_element';
import {CompileControl} from '../compiler/compile_control';
import {ViewDefinition} from '../../api';
import {ShadowDomStrategy} from './shadow_dom_strategy';

export class ShadowDomCompileStep implements CompileStep {
  constructor(public _shadowDomStrategy: ShadowDomStrategy, public _view: ViewDefinition) {}

  process(parent: CompileElement, current: CompileElement, control: CompileControl) {
    var tagName = DOM.tagName(current.element).toUpperCase();
    if (tagName == 'STYLE') {
      this._processStyleElement(current, control);
    } else if (tagName == 'CONTENT') {
      this._processContentElement(current);
    } else {
      var componentId = current.isBound() ? current.inheritedElementBinder.componentId : null;
      this._shadowDomStrategy.processElement(this._view.componentId, componentId, current.element);
    }
  }

  _processStyleElement(current: CompileElement, control: CompileControl) {
    this._shadowDomStrategy.processStyleElement(this._view.componentId, this._view.templateAbsUrl,
                                                current.element);

    // Style elements should not be further processed by the compiler, as they can not contain
    // bindings. Skipping further compiler steps allow speeding up the compilation process.
    control.ignoreCurrentElement();
  }

  _processContentElement(current: CompileElement) {
    if (this._shadowDomStrategy.hasNativeContentElement()) {
      return;
    }
    var attrs = current.attrs();
    var selector = attrs.get('select');
    selector = isPresent(selector) ? selector : '';

    var contentStart = DOM.createScriptTag('type', 'ng/contentStart');
    if (assertionsEnabled()) {
      DOM.setAttribute(contentStart, 'select', selector);
    }
    var contentEnd = DOM.createScriptTag('type', 'ng/contentEnd');
    DOM.insertBefore(current.element, contentStart);
    DOM.insertBefore(current.element, contentEnd);
    DOM.remove(current.element);

    current.element = contentStart;
    current.bindElement().setContentTagSelector(selector);
  }
}
