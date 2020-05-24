/// <reference types="node" />
import MapComponent from "../classes/Page";
export declare function writeFileRecursively(path: string, data: string | Buffer): Promise<unknown>;
export declare function moveChunks(mapComponent: MapComponent, $: any): Promise<unknown>;
export declare function readDirRecursively(dir: string, inputFileSystem: any, callback: any): void;
