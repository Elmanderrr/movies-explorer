import { ChangeDetection, ChangeDetectorDefinition } from 'angular2/change_detection';
import * as renderApi from 'angular2/src/render/api';
import { AppProtoView } from './view';
import { DirectiveBinding } from './element_injector';
export declare class ProtoViewFactory {
    _changeDetection: ChangeDetection;
    constructor(_changeDetection: ChangeDetection);
    createAppProtoViews(hostComponentBinding: DirectiveBinding, rootRenderProtoView: renderApi.ProtoViewDto, allDirectives: List<DirectiveBinding>): List<AppProtoView>;
}
/**
 * Returns the data needed to create ChangeDetectors
 * for the given ProtoView and all nested ProtoViews.
 */
export declare function getChangeDetectorDefinitions(hostComponentMetadata: renderApi.DirectiveMetadata, rootRenderProtoView: renderApi.ProtoViewDto, allRenderDirectiveMetadata: List<renderApi.DirectiveMetadata>): List<ChangeDetectorDefinition>;
export declare function createVariableLocations(elementBinders: List<renderApi.ElementBinder>): Map<string, number>;
export declare function createDirectiveVariableBindings(renderElementBinder: renderApi.ElementBinder, directiveBindings: List<DirectiveBinding>): Map<string, number>;
