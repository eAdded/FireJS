/// <reference types="express-serve-static-core" />
import { WebpackConfig } from "../../FireJS";
import FireJSPlugin from "./FireJSPlugin";
export declare const GlobalPlugMinVer = 0.1;
export default class extends FireJSPlugin {
    protected constructor();
    initServer(server: Express.Application): void;
    initWebpack(webpackConfig: WebpackConfig): void;
}
