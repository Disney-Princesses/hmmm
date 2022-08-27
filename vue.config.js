const path = require("path");

let externals = {};

if (process.env.NODE_ENV === "production") {
  externals = {
    echarts: "echarts",
    "element-ui": "ELEMENT",
    vue: "Vue",
    xlsx: "XLSX",
    "cos-js-sdk-v5": "COS",
  };
}

module.exports = {
  lintOnSave: false,
  publicPath: "./",
  productionSourceMap: false,
  publicPath: "./",
  productionSourceMap: false,
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .test(/.svg$/)
      .include.add(path.resolve(__dirname, "./src/icons/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    // 排除 elementUI xlsx  和 vue
    externals;
    // cdn资源
    config.plugin("html").tap((args) => {
      args[0].myEnv = process.env.NODE_ENV;
      return args;
    });
    // 关闭预加载
    config.plugins.delete("prefetch");
    const fileRule = config.module.rule("file");
    fileRule.uses.clear();
    fileRule
      .test(/.svg$/)
      .exclude.add(path.resolve(__dirname, "./src/icons/svg"))
      .end()
      .use("file-loader")
      .loader("file-loader");

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons", // test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }); // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
  devServer: {
    port: 9898,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    }, // 开启代理服务器
    proxy: {
      // 只有/开头的请求才会向远程服务器发送请求
      "/": {
        target: "http://liufusong.top:7001/", // target: "http://hmmm-api.itheima.net/",
        changeOrigin: true,
      },
    },
  },
};
