import PagePath from "../classes/Path";
import { $, ChunkGroup, PathRelatives } from "../index";
import { ExplicitPages, TemplateTags } from "../mappers/ConfigMapper";
export interface StaticConfig {
    rel: PathRelatives;
    tags: TemplateTags;
    externals: string[];
    pages: ExplicitPages;
    babelPath: string;
    template: string;
}
export declare class DefaultArchitect {
    private param;
    constructor(param: StaticConfig);
    render(template: string, chunkGroup: ChunkGroup, pagePath: PagePath, render_static: boolean): string;
    addChunk(template: string, chunk: string, root?: string | undefined, tag?: string | undefined): string;
    addInnerHTML(template: string, element: string, tag: string): string;
    finalize(template: string): string;
}
export default class extends DefaultArchitect {
    constructor($: $);
}
