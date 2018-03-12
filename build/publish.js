/*eslint no-console: 0 */

const utils = require("./utils");
const oss = require("./alioss");

console.log("start to upload static...\n");
const statics = utils.readFilesSync(utils.resolve("dist"), ["html", "tgz"]);

oss.uploadFilesSync(statics).then((values) => {
    console.log("✔ upload to OSS complete!\n");
}).catch(ossErr => {
    console.log("✔ upload to OSS err!\n", ossErr);
});

