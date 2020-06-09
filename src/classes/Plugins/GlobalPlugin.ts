import Plugin from "./Plugin"
import {WebpackConfig} from "../../FireJS";

export default class extends Plugin {

    constructor() {
        super();
    }

    initServer(server: Express.Application) {
    }

    initWebpack(webpackConfig: WebpackConfig) {
    }
}