import PagePath from "../classes/PagePath";
import { $, ChunkGroup, PathRelatives } from "../index";
import { ExplicitPages, TemplateTags } from "../mappers/ConfigMapper";
interface param {
    rel: PathRelatives;
    tags: TemplateTags;
    externals: string[];
    pages: ExplicitPages;
    babelPath: string;
    template: string;
}
export declare class DefaultArchitect {
    private param;
    constructor(param: param);
    render(chunkGroup: ChunkGroup, pagePath: PagePath, render_static?: boolean): string;
    addChunk(template: string, chunk: string, root?: string | undefined, tag?: string | undefined): string;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): string;
}
export default class extends DefaultArchitect {
    constructor($: $);
}
export {};
