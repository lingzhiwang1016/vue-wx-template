/*eslint no-console: 0 */

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const appConfig = require("./app.config");
const utils = require("./utils");
const oss = require("./alioss");

const spinner = ora("building for production...");
spinner.start();

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

        if (appConfig.config.cdn) {
            oss.uploadFilesSync(statics, appConfig.config.cndPrefix).then((values) => {
                console.log("✔ upload to OSS complete!\n");
            }).catch(ossErr => {
                console.log("✔ upload to OSS err!\n", ossErr);
            });
        }
    });
});
