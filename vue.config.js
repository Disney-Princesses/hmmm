const path = require("path");
module.exports = {
  lintOnSave: false,
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
    const fileRule = config.module.rule("file");
    fileRule.uses.clear();
    fileRule
      .test(/.svg$/)
      .exclude.add(path.resolve(__dirname, "./src/icons/svg"))
      .end()
      .use("file-loader")
      .loader("file-loader");
  },
  devServer: {
    port: 9898,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // 开启代理服务器
    proxy: {
      // 只有/开头的请求才会向远程服务器发送请求
      "/": {
        target: "http://liufusong.top:7001/",
        // target: "http://hmmm-api.itheima.net/",
        changeOrigin: true,
      },
    },
  },
};
