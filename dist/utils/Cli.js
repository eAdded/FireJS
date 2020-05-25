"use strict";
//tick ✓ log # warning ! error X
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(mode = undefined) {
        switch (mode) {
            case "--silent":
                this.normal = () => {
                };
                this.ok = () => {
                };
                this.error = () => {
                };
                this.warn = () => {
                };
                this.log = () => {
                };
                break;
            case "--plain":
                this.normal = this.ok = console.log;
                this.error = console.error;
                this.warn = console.warn;
                this.log = console.log;
                break;
            default:
                this.normal = console.log;
                this.log = (...messages) => console.log('\x1b[34m#', ...messages, '\x1b[0m');
                this.ok = (...messages) => console.log('\x1b[32m✓', ...messages, '\x1b[0m');
                this.error = (...messages) => console.error('\x1b[31mX', ...messages, '\x1b[0m');
                this.warn = (...messages) => console.warn('\x1b[33m!', ...messages, '\x1b[0m');
        }
    }
}
exports.default = default_1;
