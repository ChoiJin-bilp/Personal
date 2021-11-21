module.exports = {
  publicPath: './',
  lintOnSave: true,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: false,
    open: true,
    proxy: {
      //跨域
      '/api': {
        target: 'http://192.168.32.112:8090', // target host 112
        ws: true, // proxy websockets
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
          '^/api': '', // rewrite path
        },
      },
    },
  },
};
