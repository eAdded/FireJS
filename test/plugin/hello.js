const PagePlugin = require("../../dist/plugins/PagePlugin.js");

exports.default = class extends PagePlugin.default {
    constructor() {
        super("index.js");
    }

    onBuild(renderPage, ...extra) {
        console.log("assdasd")
        renderPage("/index", {emoji: "🔥"})
    }
}