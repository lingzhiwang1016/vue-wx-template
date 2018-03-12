// @flow

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

//判断当前是否处于开发状态下
const __DEV__ = (process.env.NODE_ENV || "development") === "development";
function resolve (dir) {
    return path.join(__dirname, "../..", dir);
}

// 通用插件组
const commonPlugins = [
    // 将全部 node_modules 中的代码移入
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "js/vendor.[hash].js",
        minChunks: ({ resource }) =>
            resource &&
            resource.indexOf("node_modules") >= 0 &&
            resource.match(/\.(js|less|scss)$/)
    }),
    // 定义环境变量
    new webpack.DefinePlugin({
        // 这里将 Node 中使用的变量也传入到 Web 环境中，以方便使用
        "process.env": {
            //因为使用热加载，所以在开发状态下可能传入的环境变量为空
            NODE_ENV: JSON.stringify(__DEV__ ? "development" : "production"),
            PACK_ENV: JSON.stringify(process.env.PACK_ENV || "development")
        },
        // 判断当前是否处于开发状态
        __DEV__: JSON.stringify(__DEV__)
    })
];

//开发时使用插件
const devPlugins = [

    // 启用 HMR
    new webpack.HotModuleReplacementPlugin(),

    // 在控制台中输出可读的模块名
    new webpack.NamedModulesPlugin(),

    // 避免发出包含错误的模块
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true,
        options: {
            context: "/"
        }
    }),
    new FriendlyErrorsPlugin()
];

//生产环境下使用插件
const prodPlugins = [

    // 使用 Scope Hositing 特性
    // new webpack.optimize.ModuleConcatenationPlugin(),

    //提取Loader定义到同一地方
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
            context: "/"
        }
    }),

    //提取出所有的CSS代码
    new ExtractTextPlugin("css/[name].[contenthash].css"),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
        cssProcessorOptions: {
            safe: true
        }
    }),

    //代码压缩插件
    new webpack.optimize.UglifyJsPlugin({
    // new UglifyJSPlugin({
        sourceMap: false,
        compress: {
            warnings: false
        }
    }),

    // new BundleAnalyzerPlugin({
    //     analyzerMode: "static"
    // }),

    new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
    // copy custom static assets
    new CopyWebpackPlugin([
        {
            from: resolve("static"),
            to: resolve("dist"),
            ignore: [".*"]
        }
    ])
];

//定义HTML文件入口,默认的调试文件为src/index.html
const htmlPages = [];
const apps = require("../app.config").apps;
//遍历定义好的app进行构造
apps.forEach((app) => {
    //判断是否加入编译
    if (app.compiled === false) {
        //如果还未开发好,就设置为false
        return;
    }

    //判断是否设置了HTML页面,如果设置了则添加
    if (app.indexPage) {
        //构造HTML页面
        htmlPages.push({
            filename: app.id + ".html",
            template: "underscore-template-loader!" + app.indexPage, //默认使用underscore作为模板
            inject: false, // 使用自动插入JS脚本,
            chunks: ["vendor", app.id], //选定需要插入的chunk名,
            title: "美好生活 启航之旅",
            favicon: resolve("/src/assets/favicon.png"), //favicon路径,通过webpack引入同时可以生成hash值
            //设置压缩选项
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        });
    }
});

//自动创建HTML代码
htmlPages.forEach((p) => {
    commonPlugins.push(new HtmlWebpackPlugin(p));
});

exports.devPlugins = devPlugins;
exports.prodPlugins = prodPlugins;
exports.commonPlugins = commonPlugins;
