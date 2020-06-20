import FireJSPlugin, {PluginCode} from "./FireJSPlugin";

export const PagePlugMinVer = 0.5;

export default abstract class extends FireJSPlugin {
    page: string;

    protected constructor(page: string) {
        super(0.5, PluginCode.PagePlugin);
        this.page = page;
    }

    onBuild(renderPage: (path: string, content: any) => void, ...extra: any) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {})
    }
}