const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { htmlWebpackPluginTemplateCustomizer } = require("template-ejs-loader");

module.exports = {
  stats: 'errors-only',
  entry: {
    app: path.resolve(__dirname, "../src/scripts/index.js"),
  },
  output: {
    path: path.join(__dirname, "../build"),
    filename: "js/[name].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: htmlWebpackPluginTemplateCustomizer({
        templatePath: path.resolve(__dirname, "../src/html/index.ejs"),
        htmlLoaderOption: {
          minimize: process.env.NODE_ENV === "production" ? false : true, // html-loaderのminify設定
        },
        templateEjsLoaderOption: {
          data: {
            EJS: path.resolve(__dirname, "../src/ejs/"),
          }
        },
      }),
      inject: process.env.NODE_ENV === "production" ? false : "head",
      minify: process.env.NODE_ENV === "production" ? false : true,
      // chunks: ['top'], // ページ毎にJSを分けたいとき
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.ejs$/i,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: "template-ejs-loader",
          },
        ],
      },
    ],
  },
};
