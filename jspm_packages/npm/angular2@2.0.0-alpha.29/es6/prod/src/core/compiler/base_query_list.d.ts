/**
 * Injectable Objects that contains a live list of child directives in the light Dom of a directive.
 * The directives are kept in depth-first pre-order traversal of the DOM.
 *
 * In the future this class will implement an Observable interface.
 * For now it uses a plain list of observable callbacks.
 *
 * @exportedAs angular2/view
 */
export declare class BaseQueryList<T> {
    protected _results: List<T>;
    protected _callbacks: any[];
    protected _dirty: boolean;
    [Symbol.iterator](): any;
    reset(newList: any): void;
    add(obj: any): void;
    fireCallbacks(): void;
    onChange(callback: any): void;
    removeCallback(callback: any): void;
    length: number;
    first: T;
    last: T;
}
