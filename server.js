const express = require("express");
const FireJS = require("./index");
const server = express();
const app = new FireJS({});
app.build().then(
    () => {
        server.use((req, res, next) => {
            console.log(req.url);
        })
        server.listen(5000, _ => {
            console.log("listening on port 5000");
        })
    }
);