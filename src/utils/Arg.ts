import arg = require("arg");

export default class<T> {
    private args: [keyof T, string | undefined, any, string][] = [];
    public _name: string;
    public _version: string;
    public _description: string;
    private _usage: string;
    private _examples: string[][] = [];
    private _primary: number = 1;
    private _secondary: number = 33;

    name(name: string) {
        this._name = name;
        return this;
    }

    version(version: string) {
        this._version = version;
        return this;
    }

    description(description: string) {
        this._description = description;
        return this;
    }

    usage(usage: string) {
        this._usage = usage;
        return this;
    }

    example(example: string, description: string) {
        this._examples.push([example, description]);
        return this;
    }

    primary(color: number) {
        this._primary = color;
        return this;
    }

    secondary(color: number) {
        this._secondary = color;
        return this;
    }

    option(flags: [string, keyof T] | [keyof T], valueType: any, description: string) {
        if (flags.length > 2)
            throw new Error("There can't be more than 2 flags for a command");
        if (flags.length == 2 && flags[0].length != 2)
            throw new Error("Short flag can't be smaller or greater than 1 char");
        //long, short | undefined, value type, desc
        // @ts-ignore
        this.args.push([flags.pop(), flags.pop(), valueType, description]);
        return this;
    }

    parse(options: any = undefined): T {
        const spec = {};
        this.args.forEach(arg => {
            // @ts-ignore
            spec[arg[0]] = arg[2];
            if (arg[1])
                spec[arg[1]] = arg[0];
        })
        return <T><unknown>arg(spec, options);
    }

    smartParse(options: any = undefined): T | never {
        const args = this.parse(options);
        let mini_name;
        this._usage = this._usage || `${mini_name = this._name.toLowerCase().replace(/\s/g, '')} <flag>`;
        if (!this._examples.length) {
            this._examples.push([`$ ${mini_name || (mini_name = this._name.toLowerCase().replace(/\s/g, ''))} -h`, "Print Help"])
            this._examples.push([`$ ${mini_name} -v`, "Print Version"])
        }
        if (args["--help"]) {
            this.displayHelp();
        } else if (args["--version"])
            console.log(this._version)
        else
            return args;
        process.exit(0)
    }

    displayHelp() {
        process.stdout.write("\n")
        printHeading(this._primary, this._name);
        printChild(0, this._description, "");
        printHeading(this._primary, "Usage :");
        printChild(0, this._usage, "");
        printHeading(this._primary, "Version :");
        printChild(0, this._version, "");
        printHeading(this._primary, "Option(s) :");
        this.args.forEach(arg => {
            printChild(this._secondary, `${arg[1] ? `${arg[1]}, ` : ""}${arg[0]}`, arg[3]);
        })
        if (this._examples.length) {
            printHeading(this._primary, "Example(s) :");
            this._examples.forEach(example => {
                printChild(this._secondary, example[0], example[1]);
            })
        }
        process.stdout.write("\n")
    }
}

export function printHeading(color: number, msg: string) {
    process.stdout.write(`\n    \x1b[${color}m${msg}\x1b[0m`)
}

export function printChild(color: number, msg: string, value: string | undefined = undefined) {
    process.stdout.write(`\n\t  \x1b[${color}m${msg}\x1b[0m\n\t\t${value ? value + "\n" : ""}`)
}