/// <reference types="express-serve-static-core" />
import Plugin from "./Plugin";
import { WebpackConfig } from "../../FireJS";
export default class extends Plugin {
    constructor();
    initServer(server: Express.Application): void;
    initWebpack(webpackConfig: WebpackConfig): void;
}
