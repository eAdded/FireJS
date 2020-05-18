#!/usr/bin/env node
import FireJs from "./index"
import Server from "./server"

const app = new FireJs();
if (app.getContext().config.pro)
    app.buildPro(() => {
        app.getContext().cli.ok("DONE ⌐■-■")
    });
else {
    new Server(app);
}