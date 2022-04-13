const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
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
      template: path.resolve(__dirname, "../src/html/index.ejs"),
      minify: false,
      // chunks: ['top'], // ページ毎にJSを分けたいとき
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
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
            options: {
              minimize: false,
            },
          },
          {
            loader: "template-ejs-loader",
          },
        ],
      },
    ],
  },
};
