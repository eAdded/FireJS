"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plugin_1 = require("./Plugin");
class default_1 extends Plugin_1.default {
    constructor(page) {
        super();
        this.page = page;
    }
    onBuild(renderPage) {
        return __awaiter(this, void 0, void 0, function* () {
            renderPage("/" + this.page.toString().substring(0, this.page.toString().lastIndexOf(".")), {});
        });
    }
}
exports.default = default_1;
