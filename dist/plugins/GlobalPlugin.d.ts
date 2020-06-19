/// <reference types="express-serve-static-core" />
import FireJSPlugin from "./FireJSPlugin";
export declare const GlobalPlugMinVer = 0.5;
export default class extends FireJSPlugin {
    protected constructor();
    initServer(server: Express.Application): void;
}
