/// <reference types="express-serve-static-core" />
import FireJSPlugin from "./FireJSPlugin";
import {JSDOM} from "jsdom";

export declare const GlobalPlugMinVer = 1;
export default class extends FireJSPlugin {
    protected constructor();

    initServer(server: Express.Application): void;

    initDom(dom: JSDOM): void;
}
