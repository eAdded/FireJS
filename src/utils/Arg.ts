import arg = require("arg");

export default class<T> {
    private args: [keyof T, string | undefined, any, string][] = [];

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

    help(name: string, description: string, primary: number, secondary: number) {
        this.printHeading(primary, name);
        this.printChild(secondary, "", description);
        this.printHeading(primary, "Options :");
        this.args.forEach(arg => {
            this.printChild(secondary, `${arg[1] || ""},${arg[0]}`, arg[3]);
        })
    }

    private printHeading(color, msg) {
        console.log(`\n\n    \x1b[${color}m${msg}\x1b[0m`)
    }

    private printChild(color, msg, value) {
        console.log(`\n\t    \x1b[${color}m${msg}\x1b[0m\n\t\t    ${value}`)
    }
}