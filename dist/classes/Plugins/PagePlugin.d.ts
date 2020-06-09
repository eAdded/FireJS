import { WebpackConfig } from "../../FireJS";
export default class {
    page: string;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void): Promise<void>;
    initWebpack(webpackConfig: WebpackConfig): void;
}
