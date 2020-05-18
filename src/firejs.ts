#!/usr/bin/env node
import FireJS from "./index"
import Server from "./server"

const app = new FireJS();
if (app.Context.config.pro)
    app.buildPro(() => {
        app.Context.cli.ok("DONE ⌐■-■")
    });
else {
    new Server(app);
}