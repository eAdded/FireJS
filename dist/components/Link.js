"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinkApi_1 = require("../../dist/scripts/LinkApi");
exports.default = ({ to, children, className }) => {
    let wasLoaded = false;
    function preLoad(event, callback) {
        if (wasLoaded)
            return;
        LinkApi_1.preloadPage(to, callback || function () {
            wasLoaded = true;
        });
    }
    function apply(event) {
        if (!wasLoaded) //there is no muse enter in mobile devices
            preLoad(undefined, () => {
                LinkApi_1.loadPage(to);
            });
        else
            LinkApi_1.loadPage(to);
        try {
            event.preventDefault();
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
    // @ts-ignore
    React.createElement("a", { href: to, className: className, onClick: apply.bind(this), onMouseEnter: preLoad.bind(this) }, children));
};
