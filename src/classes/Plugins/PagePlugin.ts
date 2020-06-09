import Plugin from "./Plugin"
import {WebpackConfig} from "../../FireJS";

export default class extends Plugin {
    page: string;

    constructor(page: string) {
        super();
        this.page = page;
    }

    async onBuild(renderPage: (path: string, content: any) => void) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {})
    }

    initWebpack(webpackConfig:WebpackConfig) {
    }
}