import { RouteHandler } from './route_handler';
export declare class Segment {
    name: string;
    regex: string;
}
export declare class PathRecognizer {
    path: string;
    handler: RouteHandler;
    segments: List<Segment>;
    regex: RegExp;
    specificity: number;
    terminal: boolean;
    constructor(path: string, handler: RouteHandler);
    parseParams(url: string): StringMap<string, string>;
    generate(params: StringMap<string, string>): string;
    resolveComponentType(): Promise<any>;
}
