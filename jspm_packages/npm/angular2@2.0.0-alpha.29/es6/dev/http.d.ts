export { MockConnection, MockBackend } from 'angular2/src/http/backends/mock_backend';
export { Request } from 'angular2/src/http/static_request';
export { Response } from 'angular2/src/http/static_response';
export { IRequestOptions, IResponseOptions, Connection, ConnectionBackend } from 'angular2/src/http/interfaces';
export { BaseRequestOptions, RequestOptions } from 'angular2/src/http/base_request_options';
export { BaseResponseOptions, ResponseOptions } from 'angular2/src/http/base_response_options';
export { XHRBackend, XHRConnection } from 'angular2/src/http/backends/xhr_backend';
export { Http } from 'angular2/src/http/http';
export { Headers } from 'angular2/src/http/headers';
export { ResponseTypes, ReadyStates, RequestMethods, RequestCredentialsOpts, RequestCacheOpts, RequestModesOpts } from 'angular2/src/http/enums';
export { URLSearchParams } from 'angular2/src/http/url_search_params';
/**
 * Provides a basic set of injectables to use the {@link Http} service in any application.
 *
 * #Example
 *
 * ```
 * import {httpInjectables, Http} from 'angular2/http';
 * @Component({selector: 'http-app', viewInjector: [httpInjectables]})
 * @View({template: '{{data}}'})
 * class MyApp {
 *   constructor(http:Http) {
 *     http.request('data.txt').subscribe(res => this.data = res.text());
 *   }
 * }
 * ```
 *
 */
export declare var httpInjectables: List<any>;
