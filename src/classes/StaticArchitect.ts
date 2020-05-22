export default class {
    constructor() {
    }

    getExternals(): string[] {
        throw new Error("getExternals method not implemented")
    }

    render(template: string, render_static: boolean) {
        throw new Error("render method not implemented")
    }

    addInnerHTML(template: string, element: string, tag: string): string {
        throw new Error("addInnerHtml method not implemented")
    }

    finalize(template: string) {
        throw new Error("finalize method not implemented")
    }
}