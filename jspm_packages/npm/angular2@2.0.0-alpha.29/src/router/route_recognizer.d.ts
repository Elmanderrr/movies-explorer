import { PathRecognizer } from './path_recognizer';
/**
 * `RouteRecognizer` is responsible for recognizing routes for a single component.
 * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
 * components.
 */
export declare class RouteRecognizer {
    names: Map<string, PathRecognizer>;
    redirects: Map<string, string>;
    matchers: Map<RegExp, PathRecognizer>;
    addRedirect(path: string, target: string): void;
    addConfig(path: string, handlerObj: any, alias?: string): boolean;
    /**
     * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
     *
     */
    recognize(url: string): List<RouteMatch>;
    hasRoute(name: string): boolean;
    generate(name: string, params: any): StringMap<string, any>;
}
export declare class RouteMatch {
    recognizer: PathRecognizer;
    matchedUrl: string;
    unmatchedUrl: string;
    constructor(recognizer: PathRecognizer, matchedUrl: string, unmatchedUrl: string);
    params(): StringMap<string, string>;
}
export declare var __esModule: boolean;
