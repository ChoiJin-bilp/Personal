module.exports = {
	// configureWebpack: {
	// 	// 关闭 webpack 的性能提示
	// 	// performance: {
	// 	//   hints:false
	// 	// }

	// 	// //或者

	// 	// 警告 webpack 的性能提示
	// 	performance: {
	// 		hints: 'warning',
	// 		// 入口起点的最大体积
	// 		maxEntrypointSize: 50000000,
	// 		// 生成文件的最大体积
	// 		maxAssetSize: 30000000,
	// 		// 只给出 js 文件的性能提示
	// 		assetFilter: function(assetFilename) {
	// 			return assetFilename.endsWith('.js')
	// 		}
	// 	},
	// },
	publicPath: './',
	lintOnSave: true,
	devServer: {
		host: '127.0.0.1',
		hot:true,
		port: 8080,
		https: false,
		open: true,
		proxy: { //跨域
			'/api': {
				target: 'http://bjy.51yunkeyi.com', // target host    网络服务器  http://yinruifang.cn
				ws: true, // proxy websockets
				changeOrigin: true, // needed for virtual hosted sites
				pathRewrite: {
					'^/api': '/' // rewrite path
				}
			},
		},
	},
	configureWebpack: {
		externals: 'hls.js'
	} // 在这配置webpack的externals这个字段
}
