import { Pipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Implements lowercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text lowercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp"
 * })
 * @View({
 *   template: "Username: {{ user | lowercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 *
 * @exportedAs angular2/pipes
 */
export declare class LowerCasePipe implements Pipe {
    _latestValue: string;
    supports(str: any): boolean;
    onDestroy(): void;
    transform(value: string, args?: List<any>): string;
}
/**
 * @exportedAs angular2/pipes
 */
export declare class LowerCaseFactory implements PipeFactory {
    supports(str: any): boolean;
    create(cdRef: ChangeDetectorRef): Pipe;
}
