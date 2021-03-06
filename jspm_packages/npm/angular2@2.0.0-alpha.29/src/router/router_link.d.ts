import { Router } from './router';
import { Location } from './location';
/**
 * The RouterLink directive lets you link to specific parts of your app.
 *
 * Consider the following route configuration:

 * ```
 * @RouteConfig({
 *   path: '/user', component: UserCmp, as: 'user'
 * });
 * class MyComp {}
 * ```
 *
 * When linking to this `user` route, you can write:
 *
 * ```
 * <a [router-link]="['./user']">link to user component</a>
 * ```
 *
 * RouterLink expects the value to be an array of route names, followed by the params
 * for that level of routing. For instance `['/team', {teamId: 1}, 'user', {userId: 2}]`
 * means that we want to generate a link for the `team` route with params `{teamId: 1}`,
 * and with a child route `user` with params `{userId: 2}`.
 *
 * The first route name should be prepended with either `./` or `/`.
 * If the route begins with `/`, the router will look up the route from the root of the app.
 * If the route begins with `./`, the router will instead look in the current component's
 * children for the route.
 *
 * @exportedAs angular2/router
 */
export declare class RouterLink {
    private _router;
    private _location;
    private _routeParams;
    visibleHref: string;
    _navigationHref: string;
    constructor(_router: Router, _location: Location);
    routeParams: List<any>;
    onClick(): boolean;
}
export declare var __esModule: boolean;
