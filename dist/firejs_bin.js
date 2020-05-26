#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FireJS_1 = require("./FireJS");
const server_1 = require("./server");
const path_1 = require("path");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = new Date().getTime();
        const app = new FireJS_1.default();
        const $ = app.getContext();
        if ($.config.pro) {
            try {
                yield app.init();
                yield app.buildPro();
                $.cli.ok("Build finished in", (new Date().getTime() - startTime) / 1000 + "s");
                $.cli.log("Generating babel chunk map");
                const map = {
                    staticConfig: $.renderer.param,
                    pageMap: {},
                    template: $.template
                };
                for (const page of $.pageMap.values())
                    map.pageMap[page.toString()] = page.chunks;
                $.outputFileSystem.writeFileSync(path_1.join($.config.paths.babel, "firejs.map.json"), JSON.stringify(map));
                $.cli.ok("Finished in", (new Date().getTime() - startTime) / 1000 + "s");
                if ($.config.paths.static)
                    $.cli.warn("Don't forget to copy the static folder to dist");
            }
            catch (err) {
                $.cli.error(err);
            }
        }
        else {
            const server = new server_1.default(app);
            yield server.init();
        }
    });
})();
