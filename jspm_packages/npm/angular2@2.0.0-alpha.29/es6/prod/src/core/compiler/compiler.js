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
import { Binding, resolveForwardRef, Injectable } from 'angular2/di';
import { Type, isBlank, isType, isPresent, BaseException, normalizeBlank, stringify, isArray, isPromise } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { ListWrapper, Map, MapWrapper } from 'angular2/src/facade/collection';
import { DirectiveResolver } from './directive_resolver';
import { ProtoViewRef } from './view_ref';
import { DirectiveBinding } from './element_injector';
import { ViewResolver } from './view_resolver';
import { ComponentUrlMapper } from './component_url_mapper';
import { ProtoViewFactory } from './proto_view_factory';
import { UrlResolver } from 'angular2/src/services/url_resolver';
import { AppRootUrl } from 'angular2/src/services/app_root_url';
import * as renderApi from 'angular2/src/render/api';
/**
 * Cache that stores the AppProtoView of the template of a component.
 * Used to prevent duplicate work and resolve cyclic dependencies.
 */
export let CompilerCache = class {
    constructor() {
        this._cache = new Map();
        this._hostCache = new Map();
    }
    set(component, protoView) { this._cache.set(component, protoView); }
    get(component) {
        var result = this._cache.get(component);
        return normalizeBlank(result);
    }
    setHost(component, protoView) {
        this._hostCache.set(component, protoView);
    }
    getHost(component) {
        var result = this._hostCache.get(component);
        return normalizeBlank(result);
    }
    clear() {
        this._cache.clear();
        this._hostCache.clear();
    }
};
CompilerCache = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], CompilerCache);
/**
 * @exportedAs angular2/view
 */
export let Compiler = class {
    constructor(reader, cache, viewResolver, componentUrlMapper, urlResolver, render, protoViewFactory, appUrl) {
        this._reader = reader;
        this._compilerCache = cache;
        this._compiling = new Map();
        this._viewResolver = viewResolver;
        this._componentUrlMapper = componentUrlMapper;
        this._urlResolver = urlResolver;
        this._appUrl = appUrl.value;
        this._render = render;
        this._protoViewFactory = protoViewFactory;
    }
    _bindDirective(directiveTypeOrBinding) {
        if (directiveTypeOrBinding instanceof DirectiveBinding) {
            return directiveTypeOrBinding;
        }
        else if (directiveTypeOrBinding instanceof Binding) {
            let annotation = this._reader.resolve(directiveTypeOrBinding.token);
            return DirectiveBinding.createFromBinding(directiveTypeOrBinding, annotation);
        }
        else {
            let annotation = this._reader.resolve(directiveTypeOrBinding);
            return DirectiveBinding.createFromType(directiveTypeOrBinding, annotation);
        }
    }
    // Create a hostView as if the compiler encountered <hostcmp></hostcmp>.
    // Used for bootstrapping.
    compileInHost(componentTypeOrBinding) {
        var componentType = isType(componentTypeOrBinding) ? componentTypeOrBinding :
            componentTypeOrBinding.token;
        var hostAppProtoView = this._compilerCache.getHost(componentType);
        var hostPvPromise;
        if (isPresent(hostAppProtoView)) {
            hostPvPromise = PromiseWrapper.resolve(hostAppProtoView);
        }
        else {
            var componentBinding = this._bindDirective(componentTypeOrBinding);
            Compiler._assertTypeIsComponent(componentBinding);
            var directiveMetadata = componentBinding.metadata;
            hostPvPromise = this._render.compileHost(directiveMetadata)
                .then((hostRenderPv) => {
                return this._compileNestedProtoViews(componentBinding, hostRenderPv, [componentBinding]);
            });
        }
        return hostPvPromise.then((hostAppProtoView) => { return new ProtoViewRef(hostAppProtoView); });
    }
    _compile(componentBinding) {
        var component = componentBinding.key.token;
        var protoView = this._compilerCache.get(component);
        if (isPresent(protoView)) {
            // The component has already been compiled into an AppProtoView,
            // returns a plain AppProtoView, not wrapped inside of a Promise.
            // Needed for recursive components.
            return protoView;
        }
        var pvPromise = this._compiling.get(component);
        if (isPresent(pvPromise)) {
            // The component is already being compiled, attach to the existing Promise
            // instead of re-compiling the component.
            // It happens when a template references a component multiple times.
            return pvPromise;
        }
        var view = this._viewResolver.resolve(component);
        var directives = this._flattenDirectives(view);
        for (var i = 0; i < directives.length; i++) {
            if (!Compiler._isValidDirective(directives[i])) {
                throw new BaseException(`Unexpected directive value '${stringify(directives[i])}' on the View of component '${stringify(component)}'`);
            }
        }
        var boundDirectives = this._removeDuplicatedDirectives(ListWrapper.map(directives, (directive) => this._bindDirective(directive)));
        var renderTemplate = this._buildRenderTemplate(component, view, boundDirectives);
        pvPromise =
            this._render.compile(renderTemplate)
                .then((renderPv) => {
                return this._compileNestedProtoViews(componentBinding, renderPv, boundDirectives);
            });
        this._compiling.set(component, pvPromise);
        return pvPromise;
    }
    _removeDuplicatedDirectives(directives) {
        var directivesMap = new Map();
        directives.forEach((dirBinding) => { directivesMap.set(dirBinding.key.id, dirBinding); });
        return MapWrapper.values(directivesMap);
    }
    _compileNestedProtoViews(componentBinding, renderPv, directives) {
        var protoViews = this._protoViewFactory.createAppProtoViews(componentBinding, renderPv, directives);
        var protoView = protoViews[0];
        if (isPresent(componentBinding)) {
            var component = componentBinding.key.token;
            if (renderPv.type === renderApi.ViewType.COMPONENT) {
                // Populate the cache before compiling the nested components,
                // so that components can reference themselves in their template.
                this._compilerCache.set(component, protoView);
                MapWrapper.delete(this._compiling, component);
            }
            else {
                this._compilerCache.setHost(component, protoView);
            }
        }
        var nestedPVPromises = [];
        ListWrapper.forEach(this._collectComponentElementBinders(protoViews), (elementBinder) => {
            var nestedComponent = elementBinder.componentDirective;
            var elementBinderDone = (nestedPv) => { elementBinder.nestedProtoView = nestedPv; };
            var nestedCall = this._compile(nestedComponent);
            if (isPromise(nestedCall)) {
                nestedPVPromises.push(nestedCall.then(elementBinderDone));
            }
            else {
                elementBinderDone(nestedCall);
            }
        });
        if (nestedPVPromises.length > 0) {
            return PromiseWrapper.all(nestedPVPromises).then((_) => protoView);
        }
        else {
            return protoView;
        }
    }
    _collectComponentElementBinders(protoViews) {
        var componentElementBinders = [];
        ListWrapper.forEach(protoViews, (protoView) => {
            ListWrapper.forEach(protoView.elementBinders, (elementBinder) => {
                if (isPresent(elementBinder.componentDirective)) {
                    componentElementBinders.push(elementBinder);
                }
            });
        });
        return componentElementBinders;
    }
    _buildRenderTemplate(component, view, directives) {
        var componentUrl = this._urlResolver.resolve(this._appUrl, this._componentUrlMapper.getUrl(component));
        var templateAbsUrl = null;
        var styleAbsUrls = null;
        if (isPresent(view.templateUrl)) {
            templateAbsUrl = this._urlResolver.resolve(componentUrl, view.templateUrl);
        }
        else if (isPresent(view.template)) {
            // Note: If we have an inline template, we also need to send
            // the url for the component to the render so that it
            // is able to resolve urls in stylesheets.
            templateAbsUrl = componentUrl;
        }
        if (isPresent(view.styleUrls)) {
            styleAbsUrls =
                ListWrapper.map(view.styleUrls, url => this._urlResolver.resolve(componentUrl, url));
        }
        return new renderApi.ViewDefinition({
            componentId: stringify(component),
            templateAbsUrl: templateAbsUrl, template: view.template,
            styleAbsUrls: styleAbsUrls,
            styles: view.styles,
            directives: ListWrapper.map(directives, directiveBinding => directiveBinding.metadata)
        });
    }
    _flattenDirectives(template) {
        if (isBlank(template.directives))
            return [];
        var directives = [];
        this._flattenList(template.directives, directives);
        return directives;
    }
    _flattenList(tree, out) {
        for (var i = 0; i < tree.length; i++) {
            var item = resolveForwardRef(tree[i]);
            if (isArray(item)) {
                this._flattenList(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    static _isValidDirective(value) {
        return isPresent(value) && (value instanceof Type || value instanceof Binding);
    }
    static _assertTypeIsComponent(directiveBinding) {
        if (directiveBinding.metadata.type !== renderApi.DirectiveMetadata.COMPONENT_TYPE) {
            throw new BaseException(`Could not load '${stringify(directiveBinding.key.token)}' because it is not a component.`);
        }
    }
};
Compiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [DirectiveResolver, CompilerCache, ViewResolver, ComponentUrlMapper, UrlResolver, renderApi.RenderCompiler, ProtoViewFactory, AppRootUrl])
], Compiler);
//# sourceMappingURL=compiler.js.map