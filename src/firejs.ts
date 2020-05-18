#!/usr/bin/env node
import FireJS from "./index"
import Server from "./server"

const app = new FireJS();
if (app.getContext().config.pro)
    app.buildPro(() => {
        app.getContext().cli.ok("DONE ⌐■-■")
    });
else {
    new Server(app);
}