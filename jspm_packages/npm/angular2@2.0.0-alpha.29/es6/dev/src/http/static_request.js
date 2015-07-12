/* */ 
"format cjs";
import { Headers } from './headers';
import { isPresent } from 'angular2/src/facade/lang';
// TODO(jeffbcross): properly implement body accessors
/**
 * Creates `Request` instances from provided values.
 *
 * The Request's interface is inspired by the Request constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#request-class),
 * but is considered a static value whose body can be accessed many times. There are other
 * differences in the implementation, but this is the most significant.
 */
export class Request {
    constructor(requestOptions) {
        // TODO: assert that url is present
        this.url = requestOptions.url;
        this._body = requestOptions.body;
        this.method = requestOptions.method;
        // TODO(jeffbcross): implement behavior
        this.mode = requestOptions.mode;
        // Defaults to 'omit', consistent with browser
        // TODO(jeffbcross): implement behavior
        this.credentials = requestOptions.credentials;
        this.headers = new Headers(requestOptions.headers);
        this.cache = requestOptions.cache;
    }
    /**
     * Returns the request's body as string, assuming that body exists. If body is undefined, return
     * empty
     * string.
     */
    text() { return isPresent(this._body) ? this._body.toString() : ''; }
}
//# sourceMappingURL=static_request.js.map