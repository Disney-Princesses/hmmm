// 移除console
let prodPlugins = [];
if (process.env.NODE_ENV === "production") {
  prodPlugins = ["transform-remove-console"];
}
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  env: {
    development: {
      plugins: ["dynamic-import-node", ...prodPlugins],
    },
  },
};
