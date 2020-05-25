import { $, WebpackConfig } from "../FireJS";
import Page from "../classes/Page";
export default class {
    private readonly $;
    private readonly userConfig;
    constructor(globalData: $, userConfig?: WebpackConfig);
    externals(): WebpackConfig;
    babel(page: Page): WebpackConfig;
    direct(page: Page): WebpackConfig;
}
