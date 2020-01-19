const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

	// development时使用 devtool: 'cheap-module-eval-source-map',
	// production时使用 devtool: 'cheap-module-source-map',

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

module.exports = {
	mode: 'development',											// 开发环境的打包，让代码不会被压缩
	devtool: 'cheap-module-eval-source-map', //	source-map 更改页面不会重新刷新获取请求 
	entry: {
		main: './src/index.js'
	},
	devServer: {							//	webpack的dev-server,方便在开发环境的时候开发源代码 npm run start
		contentBase: './dist',	//	在哪个目录下启动服务器
		open: true,							//	每次服务器重启的时候，都会打开一个新的网页
		port: 8080,							//	端口号
		hot: true,							//	是否支持热更新 HMR
		hotOnly: true,					//	即使不支持HMR，HMR有问题，也不帮你重新刷新浏览器
		// proxy: {
		// 	"/api": "http://localhost:3000"
		// }
	},
	module: {												//	当我们遇到一种文件类型的时候，因为我们的文件每次引入的时候都是一个模块
		rules: [											//	规则
			{
				test: /\.js$/,
				exclude: /node_modules/,	//	忽略node_modules里面的第三方模块的文件，优化打包速度
				loader: "babel-loader",		//	在.babelrc里还有配置
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: {
					loader: 'url-loader',		//	遇到图片使用url-loader打包，会把图片拷贝到dist目录下，同时返回一个文件地址
					options: {
						name: '[name]_[hash].[ext]',
						outputPath: 'images/',
						limit: 10240					//	如果小于10240，会以base64的格式放在打包文件里，减少http图片请求速度
					}
				}
			},
			{
        test: /\.css$/,
        use: [ "style-loader", "css-loader", "postcss-loader"]
			},
			{
				test: /\.(eot|ttf|svg)$/,
				use: { loader: 'file-loader' }	//	字体文件用file-loader打包
			},
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
			}	
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),		//	HMR 热更新注册
		new CleanWebpackPlugin(),										//	每次打包的时候删除dist目录
		new HtmlWebpackPlugin({											//	使用该插件可以自动在dist目录下生成html的文件
			template: 'src/index.html'								//	这是生成html文件的模板路径
		})
	],
	output: {
		filename: '[name].js',											//	打包的文件名，根据entry的key值决定
		publicPath: '/',
		path: path.resolve(__dirname, 'dist')				//	打包的文件放在dist目录下
	}
}