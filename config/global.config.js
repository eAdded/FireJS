const path = require("path")
module.exports = {
    name : "react-static-gen",//name off project
    root : process.cwd(),//project root directory
    dist : path.join(process.cwd() , "dist")
}