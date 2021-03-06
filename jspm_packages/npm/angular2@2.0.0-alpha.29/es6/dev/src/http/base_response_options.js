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
import { Injectable } from 'angular2/di';
import { isPresent } from 'angular2/src/facade/lang';
import { Headers } from './headers';
import { ResponseTypes } from './enums';
/**
 * Creates a response options object similar to the
 * [ResponseInit](https://fetch.spec.whatwg.org/#responseinit) description
 * in the Fetch
 * Spec to be optionally provided when instantiating a
 * {@link Response}.
 *
 * All values are null by default.
 */
export class ResponseOptions {
    constructor({ body, status, headers, statusText, type, url } = {}) {
        this.body = isPresent(body) ? body : null;
        this.status = isPresent(status) ? status : null;
        this.headers = isPresent(headers) ? headers : null;
        this.statusText = isPresent(statusText) ? statusText : null;
        this.type = isPresent(type) ? type : null;
        this.url = isPresent(url) ? url : null;
    }
    merge(options) {
        return new ResponseOptions({
            body: isPresent(options) && isPresent(options.body) ? options.body : this.body,
            status: isPresent(options) && isPresent(options.status) ? options.status : this.status,
            headers: isPresent(options) && isPresent(options.headers) ? options.headers : this.headers,
            statusText: isPresent(options) && isPresent(options.statusText) ? options.statusText :
                this.statusText,
            type: isPresent(options) && isPresent(options.type) ? options.type : this.type,
            url: isPresent(options) && isPresent(options.url) ? options.url : this.url,
        });
    }
}
/**
 * Injectable version of {@link ResponseOptions}, with overridable default values.
 */
export let BaseResponseOptions = class extends ResponseOptions {
    constructor() {
        super({ status: 200, statusText: 'Ok', type: ResponseTypes.Default, headers: new Headers() });
    }
};
BaseResponseOptions = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], BaseResponseOptions);
//# sourceMappingURL=base_response_options.js.map