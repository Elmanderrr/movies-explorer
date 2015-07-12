/* */ 
"format cjs";
import { RegExpWrapper, isBlank, isPresent, isType, isStringMap, BaseException } from 'angular2/src/facade/lang';
import { Map, MapWrapper } from 'angular2/src/facade/collection';
import { PathRecognizer } from './path_recognizer';
import { AsyncRouteHandler } from './async_route_handler';
import { SyncRouteHandler } from './sync_route_handler';
/**
 * `RouteRecognizer` is responsible for recognizing routes for a single component.
 * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
 * components.
 */
export class RouteRecognizer {
    constructor() {
        this.names = new Map();
        this.redirects = new Map();
        this.matchers = new Map();
    }
    addRedirect(path, target) {
        if (path == '/') {
            path = '';
        }
        this.redirects.set(path, target);
    }
    addConfig(path, handlerObj, alias = null) {
        var handler = configObjToHandler(handlerObj['component']);
        var recognizer = new PathRecognizer(path, handler);
        MapWrapper.forEach(this.matchers, (matcher, _) => {
            if (recognizer.regex.toString() == matcher.regex.toString()) {
                throw new BaseException(`Configuration '${path}' conflicts with existing route '${matcher.path}'`);
            }
        });
        this.matchers.set(recognizer.regex, recognizer);
        if (isPresent(alias)) {
            this.names.set(alias, recognizer);
        }
        return recognizer.terminal;
    }
    /**
     * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
     *
     */
    recognize(url) {
        var solutions = [];
        if (url.length > 0 && url[url.length - 1] == '/') {
            url = url.substring(0, url.length - 1);
        }
        MapWrapper.forEach(this.redirects, (target, path) => {
            // "/" redirect case
            if (path == '/' || path == '') {
                if (path == url) {
                    url = target;
                }
            }
            else if (url.startsWith(path)) {
                url = target + url.substring(path.length);
            }
        });
        MapWrapper.forEach(this.matchers, (pathRecognizer, regex) => {
            var match;
            if (isPresent(match = RegExpWrapper.firstMatch(regex, url))) {
                var matchedUrl = '/';
                var unmatchedUrl = '';
                if (url != '/') {
                    matchedUrl = match[0];
                    unmatchedUrl = url.substring(match[0].length);
                }
                solutions.push(new RouteMatch(pathRecognizer, matchedUrl, unmatchedUrl));
            }
        });
        return solutions;
    }
    hasRoute(name) { return this.names.has(name); }
    generate(name, params) {
        var pathRecognizer = this.names.get(name);
        if (isBlank(pathRecognizer)) {
            return null;
        }
        var url = pathRecognizer.generate(params);
        return { url, 'nextComponent': pathRecognizer.handler.componentType };
    }
}
export class RouteMatch {
    constructor(recognizer, matchedUrl, unmatchedUrl) {
        this.recognizer = recognizer;
        this.matchedUrl = matchedUrl;
        this.unmatchedUrl = unmatchedUrl;
    }
    params() { return this.recognizer.parseParams(this.matchedUrl); }
}
function configObjToHandler(config) {
    if (isType(config)) {
        return new SyncRouteHandler(config);
    }
    else if (isStringMap(config)) {
        if (isBlank(config['type'])) {
            throw new BaseException(`Component declaration when provided as a map should include a 'type' property`);
        }
        var componentType = config['type'];
        if (componentType == 'constructor') {
            return new SyncRouteHandler(config['constructor']);
        }
        else if (componentType == 'loader') {
            return new AsyncRouteHandler(config['loader']);
        }
        else {
            throw new BaseException(`oops`);
        }
    }
    throw new BaseException(`Unexpected component "${config}".`);
}
//# sourceMappingURL=route_recognizer.js.map