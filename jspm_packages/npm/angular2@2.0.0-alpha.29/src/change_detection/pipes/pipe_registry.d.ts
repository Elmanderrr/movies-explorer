import { Pipe } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
export declare class PipeRegistry {
    config: any;
    constructor(config: any);
    get(type: string, obj: any, cdRef?: ChangeDetectorRef, existingPipe?: Pipe): Pipe;
    private _getListOfFactories(type, obj);
    private _getMatchingFactory(listOfFactories, type, obj);
}
export declare var __esModule: boolean;
