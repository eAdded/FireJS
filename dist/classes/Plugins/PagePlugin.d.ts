import { CHUNK_MAP, WebpackConfig } from "../../FireJS";
import FireJSPlugin from "./FireJSPlugin";
export declare const PagePlugMinVer = 0.1;
export default abstract class extends FireJSPlugin {
    page: string;
    protected constructor(page: string);
    onBuild(renderPage: (path: string, content: any) => void): Promise<void>;
    initWebpack(webpackConfig: WebpackConfig): void;
    initMap(map: CHUNK_MAP): void;
}
