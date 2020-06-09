import { $, WebpackConfig } from "../FireJS";
import Page from "../classes/Page";
export default class {
    private readonly $;
    readonly defaultConfig: WebpackConfig;
    constructor(globalData: $);
    forExternals(): WebpackConfig;
    forPage(page: Page): WebpackConfig;
}
