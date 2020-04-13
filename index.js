const config = require("./config/default.config");
const pageBundeler = require("./bundelers/page.bundeler")
const path = require("path")
const fs = require("fs");

fs.readdir(path.join(config.src,"pages"),(err,file)=>{
    if(err)
        console.error("error while reading pages");
    else {
        console.log(path.join(config.src,"pages",file.toString()));
        pageBundeler(path.join(config.src,"pages",file.toString()));
    }
});
