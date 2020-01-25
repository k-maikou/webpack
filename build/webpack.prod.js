const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
  // development时使用 devtool: 'cheap-module-eval-source-map',	开发环境
	// production时使用 devtool: 'cheap-module-source-map',				生产环境

const prodConfig = {
	mode: 'production',											//	开发环境的打包，让代码不会被压缩
	// devtool: 'cheap-module-source-map', 	//	source-map 更改页面不会重新刷新获取请求
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
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
        use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
			}
		]
	},
	optimization: {
		minimizer: [new OptimizeCssAssetsPlugin({})]		//	css代码压缩
	},
	plugins: [
		new MiniCssExtractPlugin({											//	css代码分割
			filename: '[name].css',												// 	css文件名配置
			chunkFilename: '[name].chunk.css'
		}),
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true
		})
	],
	output: {
		filename: '[name].[contenthash].js',											//	打包的文件名，根据entry的key值决定
		chunkFilename: '[name].[contenthash].js',
	}
}

module.exports = prodConfig;
