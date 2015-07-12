import { Pipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Implements uppercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text uppercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp"
 * })
 * @View({
 *   template: "Username: {{ user | uppercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 *
 * @exportedAs angular2/pipes
 */
export declare class UpperCasePipe implements Pipe {
    _latestValue: string;
    supports(str: any): boolean;
    onDestroy(): void;
    transform(value: string, args?: List<any>): string;
}
/**
 * @exportedAs angular2/pipes
 */
export declare class UpperCaseFactory implements PipeFactory {
    supports(str: any): boolean;
    create(cdRef: ChangeDetectorRef): Pipe;
}
export declare var __esModule: boolean;
