const c = require("ansi-colors");
const {args} = require("../config/global.config");
//tick ✓ log # warning ! error X
if(args["--no_output"]){
    module.exports.ok = (...messages)=>{};
    module.exports.error = (...messages)=>{};
    module.exports.warn = (...messages)=>{};
    module.exports.log = (...messages)=>{};
}else if (args["--no_color"]) {
    module.exports.ok = console.log;
    module.exports.error = console.error;
    module.exports.warn = console.warn;
    module.exports.log = console.log;
} else {
    module.exports.log = (...messages) => {
        messages.forEach((message, index) => {
            if (index === 0)
                console.log(c.blue(`# ${message}`))
            else
                console.log(c.blue(`\t${message}`))
        })
    }
    module.exports.ok = (...messages) => {
        messages.forEach((message, index) => {
            if (index === 0)
                console.log(c.green(`✓ ${message}`))
            else
                console.log(c.green(`\t${message}`))
        })
    }
    module.exports.error = (...messages) => {
        messages.forEach((message, index) => {
            if (index === 0)
                console.error(c.red(`X ${message}`))
            else
                console.error(c.red(`\t${message}`))
        })
    }
    module.exports.warn = (...messages) => {
        messages.forEach((message, index) => {
            if (index === 0)
                console.warn(c.yellow(`! ${message}`))
            else
                console.warn(c.yellow(`\t${message}`))
        })
    }
}
module.exports.throwError = (error = Error) => {
    if (args["--no_output"])
        throw undefined;
    else if (args["--no_color"])
        throw error;
    else
        throw c.red(error.toLocaleString());
}
