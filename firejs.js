#!/usr/bin/env node
const FireJS = require("./index");
const app = new FireJS({});
if(app.getContext().config.pro)
    app.buildPro(()=>{console.log("DONE")});
else {
    require("./server")(app);
}