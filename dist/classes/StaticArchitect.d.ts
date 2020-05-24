export default class {
    constructor();
    getExternals(): string[];
    render(template: string, render_static: boolean): void;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): void;
}
