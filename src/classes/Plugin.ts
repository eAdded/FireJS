export default class {
    page: string;
    public version: string = "0.16.0";
    paths = new Map<string, undefined>();

    constructor(page: string) {
        this.page = page;
    }

    async onBuild(renderPage: (path: string, content: any) => void) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {})
    }

    async initServer(server: Express.Application) {}
}