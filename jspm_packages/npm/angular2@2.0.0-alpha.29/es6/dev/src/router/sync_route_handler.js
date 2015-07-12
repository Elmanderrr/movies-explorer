/* */ 
"format cjs";
import { PromiseWrapper } from 'angular2/src/facade/async';
export class SyncRouteHandler {
    constructor(componentType) {
        this.componentType = componentType;
        this._resolvedComponent = null;
        this._resolvedComponent = PromiseWrapper.resolve(componentType);
    }
    resolveComponentType() { return this._resolvedComponent; }
}
//# sourceMappingURL=sync_route_handler.js.map