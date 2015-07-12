import {StringMap, StringMapWrapper} from 'angular2/src/facade/collection';

/**
 * Acceptable origin modes to be associated with a {@link Request}, based on
 * [RequestMode](https://fetch.spec.whatwg.org/#requestmode) from the Fetch spec.
 */
export enum RequestModesOpts {
  Cors,
  NoCors,
  SameOrigin
}

/**
 * Acceptable cache option to be associated with a {@link Request}, based on
 * [RequestCache](https://fetch.spec.whatwg.org/#requestcache) from the Fetch spec.
 */
export enum RequestCacheOpts {
  Default,
  NoStore,
  Reload,
  NoCache,
  ForceCache,
  OnlyIfCached
}

/**
 * Acceptable credentials option to be associated with a {@link Request}, based on
 * [RequestCredentials](https://fetch.spec.whatwg.org/#requestcredentials) from the Fetch spec.
 */
export enum RequestCredentialsOpts {
  Omit,
  SameOrigin,
  Include
}

/**
 * Supported http methods.
 */
export enum RequestMethods {
  GET,
  POST,
  PUT,
  DELETE,
  OPTIONS,
  HEAD,
  PATCH
}

// TODO: Remove this when enum lookups are available in ts2dart
// https://github.com/angular/ts2dart/issues/221
export class RequestMethodsMap {
  private _methods: List<string>;
  constructor() { this._methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH']; }
  getMethod(method: int): string { return this._methods[method]; }
}
/**
 * All possible states in which a connection can be, based on
 * [States](http://www.w3.org/TR/XMLHttpRequest/#states) from the `XMLHttpRequest` spec, but with an
 * additional "CANCELLED" state.
 */
export enum ReadyStates {
  UNSENT,
  OPEN,
  HEADERS_RECEIVED,
  LOADING,
  DONE,
  CANCELLED
}

/**
 * Acceptable response types to be associated with a {@link Response}, based on
 * [ResponseType](https://fetch.spec.whatwg.org/#responsetype) from the Fetch spec.
 */
export enum ResponseTypes {
  Basic,
  Cors,
  Default,
  Error,
  Opaque
}
