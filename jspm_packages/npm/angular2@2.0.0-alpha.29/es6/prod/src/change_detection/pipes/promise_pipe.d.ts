import { Pipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Implements async bindings to Promise.
 *
 * # Example
 *
 * In this example we bind the description promise to the DOM.
 * The async pipe will convert a promise to the value with which it is resolved. It will also
 * request a change detection check when the promise is resolved.
 *
 *  ```
 * @Component({
 *   selector: "task-cmp",
 *   changeDetection: ON_PUSH
 * })
 * @View({
 *   template: "Task Description {{ description | async }}"
 * })
 * class Task {
 *   description:Promise<string>;
 * }
 *
 * ```
 *
 * @exportedAs angular2/pipes
 */
export declare class PromisePipe implements Pipe {
    _ref: ChangeDetectorRef;
    _latestValue: Object;
    _latestReturnedValue: Object;
    _sourcePromise: Promise<any>;
    constructor(_ref: ChangeDetectorRef);
    supports(promise: any): boolean;
    onDestroy(): void;
    transform(promise: Promise<any>, args?: List<any>): any;
    _updateLatestValue(value: Object): void;
}
/**
 * Provides a factory for [PromisePipe].
 *
 * @exportedAs angular2/pipes
 */
export declare class PromisePipeFactory implements PipeFactory {
    supports(promise: any): boolean;
    create(cdRef: ChangeDetectorRef): Pipe;
}
