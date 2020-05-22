import MapComponent from "../classes/Page";
import { $, WebpackConfig } from "../index";
export default class {
    private readonly $;
    constructor(globalData: $);
    externals(): WebpackConfig;
    getConfigBase(): WebpackConfig;
    readUserConfig(): WebpackConfig;
    babel(mapComponent: MapComponent, user_config: WebpackConfig): WebpackConfig;
    direct(mapComponent: MapComponent, user_config: WebpackConfig): WebpackConfig;
}
