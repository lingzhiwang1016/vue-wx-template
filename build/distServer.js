/*eslint no-console: 0 */

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const appConfig = require("./app.config");
const utils = require("./utils");
const opn = require("opn");
const oss = require("./alioss");

const spinner = ora("building for production...");
spinner.start();

const startServer = () => {
    const express = require("express");
    const app = express();
    // serve pure static assets
    app.use("/", express.static("./dist"));
    app.use(require("connect-history-api-fallback")());
    app.listen("8090", (err3) => {
        if (err3) {
            console.log(err3);
            return;
        }
        opn("http://localhost:8090");
    });
};

rm(utils.resolve("dist"), (err) => {
    if (err) throw err;

    webpack(webpackConfig, (err2, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + "\n\n");

        console.log(chalk.cyan("  Build complete.\n"));
        console.log(chalk.yellow("  Tip: built files are meant to be served over an HTTP server.\n  Opening index.html over file:// won't work.\n"));

        console.log("start to upload static...\n");
        const statics = utils.readFilesSync(utils.resolve("dist"), ["html", "tgz"]);

        if (process.env.PACK_ENV !== "development") {
            oss.uploadFilesSync(statics).then((values) => {
                console.log("✔ upload to OSS complete!\n");
                startServer();
            }).catch(ossErr => {
                console.log("✔ upload to OSS err!\n", ossErr);
            });
        } else {
            startServer();
        }
    });
});
