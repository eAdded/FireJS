export interface Externals {
    [key: string]: string;
}
export default class {
    constructor();
    getExternals(): Externals;
    render(template: string, render_static: boolean): string;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): void;
}
