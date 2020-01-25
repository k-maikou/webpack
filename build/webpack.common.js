const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
// const webpack = require('webpack');

const commonConfig = {
  entry: {
		main: './src/index.js'
  },
  module: {													//	当我们遇到一种文件类型的时候，因为我们的文件每次引入的时候都是一个模块
		rules: [												//	规则
			{
				test: /\.js$/,
				exclude: /node_modules/,			//	忽略node_modules里面的第三方模块的文件，优化打包速度
				use: [{
					loader: "babel-loader"			//	在.babelrc里还有配置
				},
				// {
				// 	loader: "imports-loader?this=>window"			// shimming垫片的行为
				// }
				]
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
				test: /\.(eot|ttf|svg)$/,
				use: { loader: 'file-loader' }	//	字体文件用file-loader打包
			},
			
		]
  },
  plugins: [
		new CleanWebpackPlugin(),										//	每次打包的时候删除dist目录
		new HtmlWebpackPlugin({											//	使用该插件可以自动在dist目录下生成html的文件
			template: 'src/index.html'								//	这是生成html文件的模板路径
		}),
		// new webpack.ProvidePlugin({									//	shimming，webpack自带的插件
		// 	$: 'jquery',															//	如果发现你在模块里引入了$，webpack会自动的在对应的模块引入jquery
		// 	_join: ['lodash', 'join']
		// })									
	],
	optimization: {																	//	在开发环境下使用optimization下的usedExports为true
		runtimeChunk: {
			name: 'runtime'
		},
		usedExports: true,														//	哪些模块被引入的就进行打包
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					name: 'vendors'
				}
			}
		}
	},
	performance: false,														//	配置项，不提示webpack打包超过244kb时的警告
	output: {
		
		path: path.resolve(__dirname, '../dist')				//	打包的文件放在dist目录下
	}
}

module.exports = (env) => {
	if (env && env.production) {
		return merge(commonConfig, prodConfig);				//	如果是线上环境抛出prodConfig
	} else {
		return merge(commonConfig, devConfig);				//	如果是开发环境抛出devConfig
	}
}
