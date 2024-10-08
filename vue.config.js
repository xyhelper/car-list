const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  //打包后不生成.map文件
  productionSourceMap: false,
  publicPath: "/list",
  //配置请求proxy
  devServer: {
    proxy: {
      "/carpage": {
        target: "https://certain-mercedes-portsmouth-consoles.trycloudflare.com",
        changeOrigin: true,
        ws: true,
        autoRewrite: true,
        cookieDomainRewrite: true,
      },
    },
  },
});
