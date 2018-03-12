/*eslint no-console: 0 */

const express = require("express");
const webpack = require("webpack");
const proxyMiddleware = require("http-proxy-middleware");
const appConfig = require("./app.config");
const webpackConfig = require("./webpack.config");
const opn = require("opn");
const fs = require("fs-extra");
const utils = require("./utils");

const app = express();
const compiler = webpack(webpackConfig);
const port = appConfig.devServer.port;
const devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: "/",
    quiet: true
});
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    log: () => {
    }
});

compiler.plugin("compilation", (compilation) => {
    compilation.plugin("html-webpack-plugin-after-emit", (data, cb) => {
        hotMiddleware.publish({ action: "reload" });
        cb();
    });
});

// 启动mock数据
const jsonFiles = utils.readFilesSync(utils.resolve("build/mock"), []);
const routes = express.Router();
Object.keys(jsonFiles).forEach((key) => {
    const filePath = jsonFiles[key];
    const data = require(filePath);
    let method = "get";
    let routePath = key.replace(".json", "");
    if (data.method) {
        method = data.method;
    }
    if (data.path) {
        routePath = data.path;
    }
    console.log("mock ", method, routePath);
    const dataRes = data.res;
    if (method === "get") {
        routes.get(routePath, (req, res) => {
            res.json(dataRes);
        });
    } else if (method === "post") {
        routes.post(routePath, (req, res) => {
            res.json(dataRes);
        });
    } else if (method === "put") {
        routes.put(routePath, (req, res) => {
            res.json(dataRes);
        });
    } else if (method === "delete") {
        routes.delete(routePath, (req, res) => {
            res.json(dataRes);
        });
    } else {
        console.log("method err");
    }
});
app.use("/", routes);

// proxy api requests
// Object.keys(appConfig.proxy).forEach((context) => {
//     let options = appConfig.proxy[context]
//     if (typeof options === "string") {
//         options = { target: options, changeOrigin: true };
//     }
//     app.use(proxyMiddleware(options.filter || context, options));
// });

app.use(require("connect-history-api-fallback")());
app.use(devMiddleware);
app.use(hotMiddleware);
app.use("/", express.static(utils.resolve("static")));

devMiddleware.waitUntilValid(() => {
    console.log(`> Listening at http://127.0.0.1:${port}\n`.verbose);
});

module.exports = app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Listening at http://0.0.0.0:${appConfig.devServer.port}/`);
    opn(`http://127.0.0.1:${port}`);
});
