//tick ✓ log # warning ! error X
import {Args} from "../mappers/ConfigMapper";

export default class {
    normal;
    error;
    ok;
    warn;
    log;

    constructor(args: Args) {
        if (args["--silent"]) {
            this.normal = () => {
            }
            this.ok = () => {
            };
            this.error = () => {
            };
            this.warn = () => {
            };
            this.log = () => {
            };
        } else if (args["--plain"]) {
            this.normal = this.ok = console.log;
            this.error = console.error;
            this.warn = console.warn;
            this.log = console.log;
        } else {
            this.normal = console.log;
            this.log = (...messages) => console.error('\x1b[34m#', ...messages, '\x1b[0m');
            this.ok = (...messages) => console.error('\x1b[32m✓', ...messages, '\x1b[0m');
            this.error = (...messages) => console.error('\x1b[31mX', ...messages, '\x1b[0m');
            this.warn = (...messages) => console.error('\x1b[33m!', ...messages, '\x1b[0m');
        }
    }
}