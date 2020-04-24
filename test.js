const ReactStaticGen = require("./index");
const rsg = new ReactStaticGen({userConfig: {noPlugin: true}});
rsg.build(_ => {
    const pageArchitect = rsg.newPathArchitect();
    pageArchitect.readTemplate((err, template) => {
        console.log(
            pageArchitect.render(
            "index.js",
            [
                "pagal"
            ], template));
    });
});