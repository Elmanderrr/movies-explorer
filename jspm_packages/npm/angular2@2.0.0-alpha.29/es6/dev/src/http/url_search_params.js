/* */ 
"format cjs";
import { isPresent, StringWrapper } from 'angular2/src/facade/lang';
import { Map, MapWrapper, ListWrapper, isListLikeIterable } from 'angular2/src/facade/collection';
function paramParser(rawParams) {
    var map = new Map();
    var params = StringWrapper.split(rawParams, new RegExp('&'));
    ListWrapper.forEach(params, (param) => {
        var split = StringWrapper.split(param, new RegExp('='));
        var key = ListWrapper.get(split, 0);
        var val = ListWrapper.get(split, 1);
        var list = isPresent(map.get(key)) ? map.get(key) : [];
        list.push(val);
        map.set(key, list);
    });
    return map;
}
/**
 * Map-like representation of url search parameters, based on
 * [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams) in the url living standard.
 *
 */
export class URLSearchParams {
    constructor(rawParams) {
        this.rawParams = rawParams;
        this.paramsMap = paramParser(rawParams);
    }
    has(param) { return this.paramsMap.has(param); }
    get(param) {
        var storedParam = this.paramsMap.get(param);
        if (isListLikeIterable(storedParam)) {
            return ListWrapper.first(storedParam);
        }
        else {
            return null;
        }
    }
    getAll(param) {
        var mapParam = this.paramsMap.get(param);
        return isPresent(mapParam) ? mapParam : [];
    }
    append(param, val) {
        var mapParam = this.paramsMap.get(param);
        var list = isPresent(mapParam) ? mapParam : [];
        list.push(val);
        this.paramsMap.set(param, list);
    }
    toString() {
        var paramsList = [];
        MapWrapper.forEach(this.paramsMap, (values, k) => {
            ListWrapper.forEach(values, v => { paramsList.push(k + '=' + v); });
        });
        return ListWrapper.join(paramsList, '&');
    }
    delete(param) { MapWrapper.delete(this.paramsMap, param); }
}
//# sourceMappingURL=url_search_params.js.map