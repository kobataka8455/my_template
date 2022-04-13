const path = require("path");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
	devtool: false,
	stats: "errors-only",
	bail: true,
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	},
	output: {
		filename: "js/[name].[chunkhash:8].js",
		chunkFilename: "js/[name].[chunkhash:8].chunk.js",
	},
	plugins: [
		// new CopyWebpackPlugin({ // ファイルのコピーだけする場合
		// 	patterns: [
		// 		{
		// 			from: path.resolve(__dirname, "../src/root_public"),
		// 			to: "./",
		// 		},
		// 	],
		// }),
		new Webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[chunkhash:8].css",
			chunkFilename: "css/[name].[chunkhash:8].chunk.js",
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
					},
				],
			},
			{
				test: /\.s?css/i,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: false,
						},
					},
					"postcss-loader",
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass"),
							sassOptions: {
								includePaths: [path.resolve(__dirname, "../src/styles/")],
							},
						},
					},
				],
			},
			{
				test: /\.(woff|woff2)(\?.*)?$/,
				type: "asset/resource",
				generator: {
					filename: "fonts/[hash][ext]",
				},
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|webp|svg)(\?.*)?$/,
				type: "asset/resource",
				generator: {
					filename: "images/[hash][ext]",
				},
			},
			{
				test: /\.(mp4|webm)(\?.*)?$/,
				type: "asset/resource",
				generator: {
					filename: "movies/[hash][ext]",
				},
			},
		],
	},
});
