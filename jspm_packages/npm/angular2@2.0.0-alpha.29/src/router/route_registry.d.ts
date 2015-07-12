import { RouteMatch } from './route_recognizer';
import { Instruction } from './instruction';
/**
 * The RouteRegistry holds route configurations for each component in an Angular app.
 * It is responsible for creating Instructions from URLs, and generating URLs based on route and
 * parameters.
 */
export declare class RouteRegistry {
    private _rootHostComponent;
    private _rules;
    constructor(_rootHostComponent: any);
    /**
     * Given a component and a configuration object, add the route to this registry
     */
    config(parentComponent: any, config: StringMap<string, any>): void;
    /**
     * Reads the annotations of a component and configures the registry based on them
     */
    configFromComponent(component: any): void;
    /**
     * Given a URL and a parent component, return the most specific instruction for navigating
     * the application into the state specified by the
     */
    recognize(url: string, parentComponent: any): Promise<Instruction>;
    _completeRouteMatch(partialMatch: RouteMatch): Promise<Instruction>;
    /**
     * Given a list with component names and params like: `['./user', {id: 3 }]`
     * generates a url with a leading slash relative to the provided `parentComponent`.
     */
    generate(linkParams: List<any>, parentComponent: any): string;
}
export declare var __esModule: boolean;
