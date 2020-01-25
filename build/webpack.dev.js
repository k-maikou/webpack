const webpack = require('webpack');

	// development时使用 devtool: 'cheap-module-eval-source-map',	开发环境
	// production时使用 devtool: 'cheap-module-source-map',				生产环境

	// 业务代码可以使用以下babel 不过需要导入import '@babel/polyfill' 会造成全局污染
  // presets: [["@babel/preset-env", {
  // 	targets: {
  // 		chrome: '67',
  // 	},
  // 	useBuiltIns: 'usage'
	// }]]
	
	// 非业务代码使用以下配置，以闭包的形式配置
	// "plugins": [["@babel/plugin-transform-runtime", {
  //   "corejs": 2,
  //   "helpers": true,
  //   "regenerator": true,
  //   "useESModules": false
  // }]]

 const devConfig = {
	mode: 'development',											//	开发环境的打包，让代码不会被压缩
	devtool: 'cheap-module-eval-source-map', 	//	source-map 更改页面不会重新刷新获取请求 
	devServer: {							//	webpack的dev-server,方便在开发环境的时候开发源代码 npm run start
		contentBase: './dist',	//	在哪个目录下启动服务器
		open: true,							//	每次服务器重启的时候，都会打开一个新的网页
		port: 8080,							//	端口号
		hot: true,							//	是否支持热更新 HMR
		historyApiFallback: true,	//	支持单页面如果没创建对应跳转的页面问题
		// hotOnly: true,					//	即使不支持HMR，HMR有问题，也不帮你重新刷新浏览器
		proxy: {
			"/react/api": {
				target: "https://www.dell-lee.com",
				secure: false,
				pathRewrite: {
					'header.json': 'demo.json'
				},
				changeOrigin: true,
				headers: {
					host: 'www.dell-lee.com',
					cookie: 'asd'
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2		
						}
					},
					'sass-loader',
					'postcss-loader'
				]
			},
			{
        test: /\.css$/,
        use: [ "style-loader", "css-loader", "postcss-loader"]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),		//	HMR 热更新注册
	],
	output: {
		filename: '[name].js',											//	打包的文件名，根据entry的key值决定
		chunkFilename: '[name].js',
	}
}

module.exports = devConfig;