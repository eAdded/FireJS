const c = require("ansi-colors");
const config = require("../config/global.config");
//tick ✓ log # warning ! error X
console.log(config)
if (config["--no-color"]) {
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
module.exports.throwError = (message, others) => {
    module.exports.error(message);
    throw others;
}
