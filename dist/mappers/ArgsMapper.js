"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arg = require("arg");
function getArgs() {
    return arg({
        //Types
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--plain": Boolean,
        "--silent": Boolean,
        "--disable-plugins": Boolean,
        "--help": Boolean,
        //Aliases
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "-s": "--silent",
        "-h": "--help",
    });
}
exports.getArgs = getArgs;
