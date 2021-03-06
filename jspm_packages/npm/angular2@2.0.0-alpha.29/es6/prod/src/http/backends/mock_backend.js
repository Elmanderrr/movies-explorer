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
import { Request } from 'angular2/src/http/static_request';
import { ReadyStates } from 'angular2/src/http/enums';
import { Connection, ConnectionBackend } from 'angular2/src/http/interfaces';
import { ObservableWrapper, EventEmitter } from 'angular2/src/facade/async';
import { isPresent } from 'angular2/src/facade/lang';
import { IMPLEMENTS, BaseException } from 'angular2/src/facade/lang';
/**
 *
 * Mock Connection to represent a {@link Connection} for tests.
 *
 **/
export let MockConnection = class {
    constructor(req) {
        this.response = new EventEmitter();
        this.readyState = ReadyStates.OPEN;
        this.request = req;
    }
    /**
     * Changes the `readyState` of the connection to a custom state of 5 (cancelled).
     */
    dispose() {
        if (this.readyState !== ReadyStates.DONE) {
            this.readyState = ReadyStates.CANCELLED;
        }
    }
    /**
     * Sends a mock response to the connection. This response is the value that is emitted to the
     * {@link EventEmitter} returned by {@link Http}.
     *
     * #Example
     *
     * ```
     * var connection;
     * backend.connections.subscribe(c => connection = c);
     * http.request('data.json').subscribe(res => console.log(res.text()));
     * connection.mockRespond(new Response('fake response')); //logs 'fake response'
     * ```
     *
     */
    mockRespond(res) {
        if (this.readyState === ReadyStates.DONE || this.readyState === ReadyStates.CANCELLED) {
            throw new BaseException('Connection has already been resolved');
        }
        this.readyState = ReadyStates.DONE;
        ObservableWrapper.callNext(this.response, res);
        ObservableWrapper.callReturn(this.response);
    }
    /**
     * Not yet implemented!
     *
     * Sends the provided {@link Response} to the `downloadObserver` of the `Request`
     * associated with this connection.
     */
    mockDownload(res) {
        // this.request.downloadObserver.onNext(res);
        // if (res.bytesLoaded === res.totalBytes) {
        //   this.request.downloadObserver.onCompleted();
        // }
    }
    // TODO(jeffbcross): consider using Response type
    /**
     * Emits the provided error object as an error to the {@link Response} {@link EventEmitter}
     * returned
     * from {@link Http}.
     */
    mockError(err) {
        // Matches XHR semantics
        this.readyState = ReadyStates.DONE;
        ObservableWrapper.callThrow(this.response, err);
        ObservableWrapper.callReturn(this.response);
    }
};
MockConnection = __decorate([
    IMPLEMENTS(Connection), 
    __metadata('design:paramtypes', [Request])
], MockConnection);
/**
 * A mock backend for testing the {@link Http} service.
 *
 * This class can be injected in tests, and should be used to override bindings
 * to other backends, such as {@link XHRBackend}.
 *
 * #Example
 *
 * ```
 * import {MockBackend, DefaultOptions, Http} from 'angular2/http';
 * it('should get some data', inject([AsyncTestCompleter], (async) => {
 *   var connection;
 *   var injector = Injector.resolveAndCreate([
 *     MockBackend,
 *     bind(Http).toFactory((backend, defaultOptions) => {
 *       return new Http(backend, defaultOptions)
 *     }, [MockBackend, DefaultOptions])]);
 *   var http = injector.get(Http);
 *   var backend = injector.get(MockBackend);
 *   //Assign any newly-created connection to local variable
 *   backend.connections.subscribe(c => connection = c);
 *   http.request('data.json').subscribe((res) => {
 *     expect(res.text()).toBe('awesome');
 *     async.done();
 *   });
 *   connection.mockRespond(new Response('awesome'));
 * }));
 * ```
 *
 * This method only exists in the mock implementation, not in real Backends.
 **/
export let MockBackend = class {
    constructor() {
        this.connectionsArray = [];
        this.connections = new EventEmitter();
        ObservableWrapper.subscribe(this.connections, connection => this.connectionsArray.push(connection));
        this.pendingConnections = new EventEmitter();
    }
    /**
     * Checks all connections, and raises an exception if any connection has not received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     */
    verifyNoPendingRequests() {
        let pending = 0;
        ObservableWrapper.subscribe(this.pendingConnections, c => pending++);
        if (pending > 0)
            throw new BaseException(`${pending} pending connections to be resolved`);
    }
    /**
     * Can be used in conjunction with `verifyNoPendingRequests` to resolve any not-yet-resolve
     * connections, if it's expected that there are connections that have not yet received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     */
    resolveAllConnections() { ObservableWrapper.subscribe(this.connections, c => c.readyState = 4); }
    /**
     * Creates a new {@link MockConnection}. This is equivalent to calling `new
     * MockConnection()`, except that it also will emit the new `Connection` to the `connections`
     * emitter of this `MockBackend` instance. This method will usually only be used by tests
     * against the framework itself, not by end-users.
     */
    createConnection(req) {
        if (!isPresent(req) || !(req instanceof Request)) {
            throw new BaseException(`createConnection requires an instance of Request, got ${req}`);
        }
        let connection = new MockConnection(req);
        ObservableWrapper.callNext(this.connections, connection);
        return connection;
    }
};
MockBackend = __decorate([
    Injectable(),
    IMPLEMENTS(ConnectionBackend), 
    __metadata('design:paramtypes', [])
], MockBackend);
//# sourceMappingURL=mock_backend.js.map