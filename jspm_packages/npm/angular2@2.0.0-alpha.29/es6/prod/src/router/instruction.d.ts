import { PathRecognizer } from './path_recognizer';
export declare class RouteParams {
    params: StringMap<string, string>;
    constructor(params: StringMap<string, string>);
    get(param: string): string;
}
/**
 * An `Instruction` represents the component hierarchy of the application based on a given route
 */
export declare class Instruction {
    component: any;
    capturedUrl: string;
    private _recognizer;
    child: Instruction;
    accumulatedUrl: string;
    reuse: boolean;
    specificity: number;
    private _params;
    constructor(component: any, capturedUrl: string, _recognizer: PathRecognizer, child?: Instruction);
    params(): StringMap<string, string>;
    hasChild(): boolean;
    /**
     * Takes a currently active instruction and sets a reuse flag on each of this instruction's
     * children
     */
    reuseComponentsFrom(oldInstruction: Instruction): void;
}
