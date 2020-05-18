#!/usr/bin/env node
import FireJs from "./index"

const app = new FireJs();
if (app.getContext().config.pro)
    app.buildPro(() => {
        app.getContext().cli.ok("DONE ⌐■-■")
    });
else {
    require("./server")(app);
}