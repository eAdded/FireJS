/// <reference types="express-serve-static-core" />
import { WebpackConfig } from "../../FireJS";
export default class {
    constructor();
    initServer(server: Express.Application): void;
    initWebpack(webpackConfig: WebpackConfig): void;
}
