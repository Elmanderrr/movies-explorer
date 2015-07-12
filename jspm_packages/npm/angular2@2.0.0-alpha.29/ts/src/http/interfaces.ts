/// <reference path="../../typings/rx/rx.d.ts" />

import {
  ReadyStates,
  RequestModesOpts,
  RequestMethods,
  RequestCacheOpts,
  RequestCredentialsOpts,
  ResponseTypes
} from './enums';
import {Headers} from './headers';
import {BaseException} from 'angular2/src/facade/lang';
import {EventEmitter} from 'angular2/src/facade/async';
import {Request} from './static_request';

/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {@link Request}.
 */
export class ConnectionBackend {
  constructor() {}
  createConnection(request: any): Connection { throw new BaseException('Abstract!'); }
}

/**
 * Abstract class from which real connections are derived.
 */
export class Connection {
  readyState: ReadyStates;
  request: Request;
  response: EventEmitter;  // TODO: generic of <Response>;
  dispose(): void { throw new BaseException('Abstract!'); }
}

/**
 * Interface for options to construct a Request, based on
 * [RequestInit](https://fetch.spec.whatwg.org/#requestinit) from the Fetch spec.
 */
export interface IRequestOptions {
  url?: string;
  method?: RequestMethods;
  headers?: Headers;
  // TODO: Support Blob, ArrayBuffer, JSON, URLSearchParams, FormData
  body?: string;
  mode?: RequestModesOpts;
  credentials?: RequestCredentialsOpts;
  cache?: RequestCacheOpts;
}

/**
 * Interface for options to construct a Response, based on
 * [ResponseInit](https://fetch.spec.whatwg.org/#responseinit) from the Fetch spec.
 */
export interface IResponseOptions {
  // TODO: Support Blob, ArrayBuffer, JSON
  body?: string | Object | FormData;
  status?: number;
  statusText?: string;
  headers?: Headers;
  type?: ResponseTypes;
  url?: string;
}
