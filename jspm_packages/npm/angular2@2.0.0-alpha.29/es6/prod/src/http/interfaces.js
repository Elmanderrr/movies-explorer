/* */ 
"format cjs";
/// <reference path="../../typings/rx/rx.d.ts" />
import { BaseException } from 'angular2/src/facade/lang';
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {@link Request}.
 */
export class ConnectionBackend {
    constructor() {
    }
    createConnection(request) { throw new BaseException('Abstract!'); }
}
/**
 * Abstract class from which real connections are derived.
 */
export class Connection {
    dispose() { throw new BaseException('Abstract!'); }
}
//# sourceMappingURL=interfaces.js.map