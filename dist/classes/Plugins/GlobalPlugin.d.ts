/// <reference types="express-serve-static-core" />
import FireJSPlugin from "./FireJSPlugin";
export declare const GlobalPlugMinVer = 0.1;
export default class extends FireJSPlugin {
    protected constructor();
    initServer(server: Express.Application): void;
}
