const path = require("path");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  target: "web",
  mode: "development",
  devtool: "eval-cheap-source-map",
  output: {
    chunkFilename: "js/[name].chunk.js",
  },
  devServer: {
    client: {
      logging: "error",
    },
    watchFiles: ["src/**/*.ejs"],
    liveReload: true,
    hot: true,
    open: true,
  },
  plugins: [
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new ESLintPlugin({
      extensions: "js",
      emitWarning: true,
      files: path.resolve(__dirname, "../src"),
    }),
    new StylelintPlugin({
      files: path.join("src", "**/*.s?(a|c)ss"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              sourceMaps: false,
            },
          },
        ],
      },
      {
        test: /\.s?css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
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
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|webp|svg)(\?.*)?$/,
        type: "asset/resource",
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        type: "asset/resource",
      },
    ],
  },
});
