#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const server_1 = require("./server");
const app = new index_1.default();
if (app.Context.config.pro)
    app.buildPro(() => {
        app.Context.cli.ok("DONE ⌐■-■");
    });
else {
    new server_1.default(app);
}
