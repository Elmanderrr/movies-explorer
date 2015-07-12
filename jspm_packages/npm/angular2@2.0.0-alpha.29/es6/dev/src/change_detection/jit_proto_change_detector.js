/* */ 
"format cjs";
import { ListWrapper } from 'angular2/src/facade/collection';
import { ChangeDetectorJITGenerator } from './change_detection_jit_generator';
import { coalesce } from './coalesce';
import { ProtoRecordBuilder } from './proto_change_detector';
export class JitProtoChangeDetector {
    constructor(_pipeRegistry, definition) {
        this._pipeRegistry = _pipeRegistry;
        this.definition = definition;
        this._factory = this._createFactory(definition);
    }
    static isSupported() { return true; }
    instantiate(dispatcher) {
        return this._factory(dispatcher, this._pipeRegistry);
    }
    _createFactory(definition) {
        var recordBuilder = new ProtoRecordBuilder();
        ListWrapper.forEach(definition.bindingRecords, (b) => { recordBuilder.add(b, definition.variableNames); });
        var records = coalesce(recordBuilder.records);
        return new ChangeDetectorJITGenerator(definition.id, definition.strategy, records, this.definition.directiveRecords)
            .generate();
    }
}
//# sourceMappingURL=jit_proto_change_detector.js.map