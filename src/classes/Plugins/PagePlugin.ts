import {WebpackConfig} from "../../FireJS";

export default class {
    page: string;

    constructor(page: string) {
        this.page = page;
    }

    async onBuild(renderPage: (path: string, content: any) => void) {
        renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {})
    }

    initWebpack(webpackConfig: WebpackConfig) {
    }
}