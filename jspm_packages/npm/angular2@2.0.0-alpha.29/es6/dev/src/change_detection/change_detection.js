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
import { JitProtoChangeDetector } from './jit_proto_change_detector';
import { PregenProtoChangeDetector } from './pregen_proto_change_detector';
import { DynamicProtoChangeDetector } from './proto_change_detector';
import { PipeRegistry } from './pipes/pipe_registry';
import { IterableChangesFactory } from './pipes/iterable_changes';
import { KeyValueChangesFactory } from './pipes/keyvalue_changes';
import { ObservablePipeFactory } from './pipes/observable_pipe';
import { PromisePipeFactory } from './pipes/promise_pipe';
import { UpperCaseFactory } from './pipes/uppercase_pipe';
import { LowerCaseFactory } from './pipes/lowercase_pipe';
import { JsonPipe } from './pipes/json_pipe';
import { LimitToPipeFactory } from './pipes/limit_to_pipe';
import { NullPipeFactory } from './pipes/null_pipe';
import { ChangeDetection } from './interfaces';
import { Inject, Injectable, OpaqueToken, Optional } from 'angular2/di';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { CONST, CONST_EXPR, isPresent } from 'angular2/src/facade/lang';
/**
 * Structural diffing for `Object`s and `Map`s.
 *
 * @exportedAs angular2/pipes
 */
export const keyValDiff = CONST_EXPR([CONST_EXPR(new KeyValueChangesFactory()), CONST_EXPR(new NullPipeFactory())]);
/**
 * Structural diffing for `Iterable` types such as `Array`s.
 *
 * @exportedAs angular2/pipes
 */
export const iterableDiff = CONST_EXPR([CONST_EXPR(new IterableChangesFactory()), CONST_EXPR(new NullPipeFactory())]);
/**
 * Async binding to such types as Observable.
 *
 * @exportedAs angular2/pipes
 */
export const async = CONST_EXPR([
    CONST_EXPR(new ObservablePipeFactory()),
    CONST_EXPR(new PromisePipeFactory()),
    CONST_EXPR(new NullPipeFactory())
]);
/**
 * Uppercase text transform.
 *
 * @exportedAs angular2/pipes
 */
export const uppercase = CONST_EXPR([CONST_EXPR(new UpperCaseFactory()), CONST_EXPR(new NullPipeFactory())]);
/**
 * Lowercase text transform.
 *
 * @exportedAs angular2/pipes
 */
export const lowercase = CONST_EXPR([CONST_EXPR(new LowerCaseFactory()), CONST_EXPR(new NullPipeFactory())]);
/**
 * Json stringify transform.
 *
 * @exportedAs angular2/pipes
 */
export const json = CONST_EXPR([CONST_EXPR(new JsonPipe()), CONST_EXPR(new NullPipeFactory())]);
/**
 * LimitTo text transform.
 *
 * @exportedAs angular2/pipes
 */
export const limitTo = CONST_EXPR([CONST_EXPR(new LimitToPipeFactory()), CONST_EXPR(new NullPipeFactory())]);
export const defaultPipes = CONST_EXPR({
    "iterableDiff": iterableDiff,
    "keyValDiff": keyValDiff,
    "async": async,
    "uppercase": uppercase,
    "lowercase": lowercase,
    "json": json,
    "limitTo": limitTo
});
/**
 * Map from {@link ChangeDetectorDefinition#id} to a factory method which takes a
 * {@link PipeRegistry} and a {@link ChangeDetectorDefinition} and generates a
 * {@link ProtoChangeDetector} associated with the definition.
 */
// TODO(kegluneq): Use PregenProtoChangeDetectorFactory rather than Function once possible in
// dart2js. See https://github.com/dart-lang/sdk/issues/23630 for details.
export var preGeneratedProtoDetectors = {};
export const PROTO_CHANGE_DETECTOR_KEY = CONST_EXPR(new OpaqueToken('ProtoChangeDetectors'));
/**
 * Implements change detection using a map of pregenerated proto detectors.
 *
 * @exportedAs angular2/change_detection
 */
export let PreGeneratedChangeDetection = class extends ChangeDetection {
    constructor(registry, protoChangeDetectorsForTest) {
        super();
        this.registry = registry;
        this._dynamicChangeDetection = new DynamicChangeDetection(registry);
        this._protoChangeDetectorFactories = isPresent(protoChangeDetectorsForTest) ?
            protoChangeDetectorsForTest :
            preGeneratedProtoDetectors;
    }
    static isSupported() { return PregenProtoChangeDetector.isSupported(); }
    createProtoChangeDetector(definition) {
        var id = definition.id;
        if (StringMapWrapper.contains(this._protoChangeDetectorFactories, id)) {
            return StringMapWrapper.get(this._protoChangeDetectorFactories, id)(this.registry, definition);
        }
        return this._dynamicChangeDetection.createProtoChangeDetector(definition);
    }
};
PreGeneratedChangeDetection = __decorate([
    Injectable(),
    __param(1, Inject(PROTO_CHANGE_DETECTOR_KEY)),
    __param(1, Optional()), 
    __metadata('design:paramtypes', [PipeRegistry, Object])
], PreGeneratedChangeDetection);
/**
 * Implements change detection that does not require `eval()`.
 *
 * This is slower than {@link JitChangeDetection}.
 *
 * @exportedAs angular2/change_detection
 */
export let DynamicChangeDetection = class extends ChangeDetection {
    constructor(registry) {
        super();
        this.registry = registry;
    }
    createProtoChangeDetector(definition) {
        return new DynamicProtoChangeDetector(this.registry, definition);
    }
};
DynamicChangeDetection = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [PipeRegistry])
], DynamicChangeDetection);
/**
 * Implements faster change detection by generating source code.
 *
 * This requires `eval()`. For change detection that does not require `eval()`, see
 * {@link DynamicChangeDetection} and {@link PreGeneratedChangeDetection}.
 *
 * @exportedAs angular2/change_detection
 */
export let JitChangeDetection = class extends ChangeDetection {
    constructor(registry) {
        super();
        this.registry = registry;
    }
    static isSupported() { return JitProtoChangeDetector.isSupported(); }
    createProtoChangeDetector(definition) {
        return new JitProtoChangeDetector(this.registry, definition);
    }
};
JitChangeDetection = __decorate([
    Injectable(),
    CONST(), 
    __metadata('design:paramtypes', [PipeRegistry])
], JitChangeDetection);
export const defaultPipeRegistry = CONST_EXPR(new PipeRegistry(defaultPipes));
//# sourceMappingURL=change_detection.js.map