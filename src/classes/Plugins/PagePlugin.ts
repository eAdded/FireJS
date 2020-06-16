import FireJSPlugin, {PluginCode} from "./FireJSPlugin";

export const PagePlugMinVer = 0.1;

export default abstract class extends FireJSPlugin {
    page: string;

    protected constructor(page: string) {
        super(0.4, PluginCode.PagePlugin);
        this.page = page;
    }

    async onBuild(renderPage: (path: string, content: any) => void, ...extra: any): Promise<void> {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {})
    }
}