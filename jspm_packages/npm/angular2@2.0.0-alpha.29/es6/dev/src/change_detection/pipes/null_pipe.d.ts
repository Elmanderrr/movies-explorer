import { Pipe, BasePipe, WrappedValue, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * @exportedAs angular2/pipes
 */
export declare class NullPipeFactory implements PipeFactory {
    supports(obj: any): boolean;
    create(cdRef: ChangeDetectorRef): Pipe;
}
/**
 * @exportedAs angular2/pipes
 */
export declare class NullPipe extends BasePipe {
    called: boolean;
    static supportsObj(obj: any): boolean;
    supports(obj: any): boolean;
    transform(value: any, args?: List<any>): WrappedValue;
}
