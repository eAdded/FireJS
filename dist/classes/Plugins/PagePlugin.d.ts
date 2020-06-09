import Plugin from "./Plugin";
import { WebpackConfig } from "../../FireJS";
export default class extends Plugin {
    page: string;
    constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void): Promise<void>;
    initWebpack(webpackConfig: WebpackConfig): void;
}
