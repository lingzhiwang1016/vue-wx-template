const path = require("path");
const webpack = require("webpack");
const loaders = require("./webpack/loaders");
const plugins = require("./webpack/plugins");

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

const devHotEntry = resolve("build/devClient.js");
// 判断当前是否处于开发状态下
const __DEV__ = (process.env.NODE_ENV || "development") === "development";

// 定义统一的Application，不同的单页面会作为不同的Application
const appsConfig = require("./app.config.js");

const entry = {};

// 遍历定义好的app进行构造
appsConfig.apps.forEach((app) => {
    // 判断是否加入编译
    if (app.compiled === false) {
        // 如果还未开发好,就设置为false
        return;
    }

    entry[app.id] = __DEV__ ? [devHotEntry].concat(app.src) : app.src;
});

// 设置开发时源代码映射工具
// const devTool = __DEV__ ? "#cheap-module-eval-source-map" : "#source-map";
const devTool = __DEV__ ? "#cheap-module-eval-source-map" : "#hidden-source-map";

// 基本配置
const config = {
    cache: true,
    entry,
    devtool: devTool,
    // 所有的出口文件，注意，所有的包括图片等本机被放置到了dist目录下，其他文件放置到static目录下
    output: {
        path: resolve("dist"), // 生成目录
        publicPath: appsConfig.config.assetsPublicPath, // 生成的公共目录
        filename: "js/[name].[hash].js", // 文件名,不加chunkhash,以方便调试时使用，生产环境下可以设置为 [name].bundle.[hash:8].js
        chunkFilename: "js/[id].[chunkhash].chunk.js" // 块文件索引
    },
    // 配置插件
    plugins: __DEV__
        ? [].concat(plugins.commonPlugins).concat(plugins.devPlugins)
        : [].concat(plugins.commonPlugins).concat(plugins.prodPlugins),
    module: {
        rules: [
            loaders.jslint,
            // loaders.wasm,
            loaders.vue,
            loaders.js,
            // loaders.jsx,
            loaders.styles.css,
            // loaders.styles.scss,
            loaders.styles.less,
            loaders.assets,
            loaders.fonts,
            loaders.json,
            loaders.html
        ]
    },
    externals: {
        window: "window",
        jquery: "$",
        OSS: "OSS",
        jQuery: "jQuery",
        wx: "wx"
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
            "@unit": resolve("test/unit"),
            "@e2e": resolve("test/e2e")
        }
    },
    performance: {
        hints: false
    },
    target: "web"
};

module.exports = config;
