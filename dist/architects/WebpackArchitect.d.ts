import {$, WebpackConfig} from "../FireJSX";
import Page from "../classes/Page";

export default class {
    readonly defaultConfig: WebpackConfig;
    private readonly $;

    constructor($: $);

    forExternals(): WebpackConfig;

    forPage(page: Page): WebpackConfig;
}
