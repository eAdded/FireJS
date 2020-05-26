import { $, WebpackConfig } from "../FireJS";
import Page from "../classes/Page";
export default class {
    private readonly $;
    private readonly userConfig;
    constructor(globalData: $, userConfig?: WebpackConfig);
    forExternals(): WebpackConfig;
    forPage(page: Page): WebpackConfig;
}
