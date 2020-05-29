"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arg = require("arg");
function getArgs() {
    return arg({
        //Types
        "--webpack-conf": String,
        "--export": Boolean,
        "--export-fly": Boolean,
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
        "-h": "--help",
        //paths
        "--root": String,
        "--src": String,
        "--pages": String,
        "--out": String,
        "--dist": String,
        "--cache": String,
        "--fly": String,
        "--template": String,
        "--lib": String,
        "--map": String,
        "--static": String,
        "--plugins": String //plugins dir, default : root/src/plugins
    });
}
exports.getArgs = getArgs;
