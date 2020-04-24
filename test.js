const ReactStaticGen = require("./index");
const rsg = new ReactStaticGen({userConfig:{noPlugin:true} ,map:["index.js"]});
rsg.build(_=>{
    rsg.buildPage(
        "index.js",
        [
            "pagal"
        ],
        rsg.getTemplate());
});