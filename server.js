const express = require("express");
const FireJS = require("./index");
const server = express();
const app = new FireJS({});
app.build();
server.use(app.middleware)
server.listen(5000, _ => {
    console.log("listening on port 5000");
})