"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arg = require("arg");
function getArgs() {
    return arg({
        //Types
        "--webpack-conf": String,
        "--export": Boolean,
        "--export-fly": String,
        "--disk": Boolean,
        "--pro": Boolean,
        "--conf": String,
        "--verbose": Boolean,
        "--plain": Boolean,
        "--silent": Boolean,
        "--disable-plugins": Boolean,
        "--help": Boolean,
        //Aliases
        "-w": "--webpack-conf",
        "-e": "--export",
        "-d": "--disk",
        "-p": "--pro",
        "-c": "--conf",
        "-v": "--verbose",
        "-s": "--silent",
        "-h": "--help"
    });
}
exports.getArgs = getArgs;
