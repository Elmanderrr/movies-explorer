/* */ 
"format cjs";
import { isBlank, BaseException } from 'angular2/src/facade/lang';
import { isListLikeIterable, Map, MapWrapper, ListWrapper, StringMap } from 'angular2/src/facade/collection';
/**
 * Polyfill for [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers), as
 * specified in the [Fetch Spec](https://fetch.spec.whatwg.org/#headers-class). The only known
 * difference from the spec is the lack of an `entries` method.
 */
export class Headers {
    constructor(headers) {
        if (isBlank(headers)) {
            this._headersMap = new Map();
            return;
        }
        if (headers instanceof Headers) {
            this._headersMap = headers._headersMap;
        }
        else if (headers instanceof StringMap) {
            this._headersMap = MapWrapper.createFromStringMap(headers);
            MapWrapper.forEach(this._headersMap, (v, k) => {
                if (!isListLikeIterable(v)) {
                    var list = [];
                    list.push(v);
                    this._headersMap.set(k, list);
                }
            });
        }
    }
    /**
     * Appends a header to existing list of header values for a given header name.
     */
    append(name, value) {
        var mapName = this._headersMap.get(name);
        var list = isListLikeIterable(mapName) ? mapName : [];
        list.push(value);
        this._headersMap.set(name, list);
    }
    /**
     * Deletes all header values for the given name.
     */
    delete(name) { MapWrapper.delete(this._headersMap, name); }
    forEach(fn) { MapWrapper.forEach(this._headersMap, fn); }
    /**
     * Returns first header that matches given name.
     */
    get(header) { return ListWrapper.first(this._headersMap.get(header)); }
    /**
     * Check for existence of header by given name.
     */
    has(header) { return this._headersMap.has(header); }
    /**
     * Provides names of set headers
     */
    keys() { return MapWrapper.keys(this._headersMap); }
    /**
     * Sets or overrides header value for given name.
     */
    set(header, value) {
        var list = [];
        if (isListLikeIterable(value)) {
            var pushValue = value.join(',');
            list.push(pushValue);
        }
        else {
            list.push(value);
        }
        this._headersMap.set(header, list);
    }
    /**
     * Returns values of all headers.
     */
    values() { return MapWrapper.values(this._headersMap); }
    /**
     * Returns list of header values for a given name.
     */
    getAll(header) {
        var headers = this._headersMap.get(header);
        return isListLikeIterable(headers) ? headers : [];
    }
    /**
     * This method is not implemented.
     */
    entries() { throw new BaseException('"entries" method is not implemented on Headers class'); }
}
//# sourceMappingURL=headers.js.map