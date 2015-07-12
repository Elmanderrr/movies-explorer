export declare class LocationStrategy {
    path(): string;
    pushState(ctx: any, title: string, url: string): void;
    forward(): void;
    back(): void;
    onPopState(fn: any): void;
    getBaseHref(): string;
}
