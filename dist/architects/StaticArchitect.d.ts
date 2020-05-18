import MapComponent from "../classes/MapComponent";
import PagePath from "../classes/PagePath";
import { $ } from "../index";
export default class {
    private readonly $;
    constructor(globalData: $);
    render(mapComponent: MapComponent, pagePath: PagePath): string;
    addChunk(template: string, chunk: string, root?: string | undefined, tag?: string | undefined): string;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): string;
}
