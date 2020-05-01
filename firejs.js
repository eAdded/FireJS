#!/usr/bin/env node
const FireJS = require("./index");
const app = new FireJS({});
if(app.getContext().config.pro)
    app.buildPro().then(_=>console.log("DONE")).catch(err=>{throw err});
else {
    require("./server")(app);
}