// @flow

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 判断当前是否处于开发状态下
const __DEV__ = (process.env.NODE_ENV || "development") === "development";

function resolve (dir) {
    return path.join(__dirname, "../..", dir);
}

const includePath = [resolve("src"), resolve("test")];

// 对 JS/JSX/VUE 的格式校验
exports.jslint = {
    test: /\.(js|vue)$/,
    loader: "eslint-loader",
    enforce: "pre",
    include: includePath,
    exclude: /(node_modules)/,
    options: {
        formatter: require("eslint-friendly-formatter")
    }
};

// 基于Babel的JS/JSX Loader
exports.jsx = {
    test: /\.(js|jsx)$/,
    include: includePath,
    exclude: /(node_modules)/,
    use: ["babel-loader"]
};

exports.vue = {
    test: /\.vue$/,
    loader: "vue-loader",
    include: [
        resolve("src"),
        resolve("test"),
        resolve("node_modules/element-ui/src"),
        resolve("node_modules/element-ui/packages")
    ],
    options: {
        loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
        }
        // other vue-loader options go here
    }
};

exports.js = {
    test: /\.js$/,
    loader: "babel-loader",
    include: [
        resolve("src"),
        resolve("test"),
        resolve("node_modules/element-ui/src"),
        resolve("node_modules/element-ui/packages")
    ]
};

// 对于TS与TSX的校验
exports.tslint = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: ["tslint-loader"]
};

// 对于TS与TSX的Loader
exports.tsx = {
    test: /\.ts|tsx?$/,
    exclude: /node_modules/,
    use: ["awesome-typescript-loader"]
};

// 用于 Webpack 的 WASM 二进制模块导入工具，其能够允许你在 JavaScript 代码中导入 wasm 格式文件并且将二进制文件打包成为 JS Bundle 的一部分
// 什么是 WebAssembly ? 看知乎：https://www.zhihu.com/question/31415286
exports.wasm = {
    test: /\.wasm$/,
    use: ["wasm-loader"]
};

// 根据不同的环境开发设置不同的样式加载的Loader
const moduleCSSLoader = {
    loader: "css-loader",
    query: {
        modules: true,
        importLoaders: 1,
        localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
    }
};

const postCSSLoader = {
    loader: "postcss-loader",
    options: {
        config: {
            path: resolve(".postcsssrc.js")
        }
    }
};

exports.styles = {
    css: {
        test: /\.css$/,
        // include: includePath,
        use: __DEV__ ? ["style-loader", "css-loader", postCSSLoader] : ExtractTextPlugin.extract({
            use: ["css-loader", postCSSLoader]
        })
    },
    scss: {
        test: /\.(scss|sass)$/,
        include: includePath,
        use: __DEV__ ? ["style-loader", "css-loader", postCSSLoader, "sass-loader"] : ExtractTextPlugin.extract({
            use: ["css-loader", postCSSLoader, "sass-loader"]
        })
    },
    less: {
        test: /\.(less)$/,
        include: includePath,
        use: __DEV__ ? ["style-loader", "css-loader", postCSSLoader, "less-loader"] : ExtractTextPlugin.extract({
            use: ["css-loader", postCSSLoader, "less-loader"]
        })
    }
};

//对于图片与字体文件的导入工具,并且设置默认的dist中存放方式
// inline base64 URLs for <=8k images, direct URLs for the rest
exports.assets = {
    test: /\.(svg|png|jpe?g|gif|mp4|webm)(\?\S*)?$/,
    loader: "url-loader?limit=8192&name=img/[name].[hash:7].[ext]"
};

exports.fonts = {
    test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/,
    loader: "url-loader?limit=8192&name=fonts/[name].[hash:7].[ext]"
};

//对于JSON文件的导入
exports.json = {
    test: /\.json$/,
    loader: "json"
};

exports.html = {
    test: /\.html$/,
    exclude: /node_modules/,
    loader: "html-loader?minimize",
    include: [resolve("src/ext/weui.js")]
}
