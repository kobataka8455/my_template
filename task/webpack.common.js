const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { htmlWebpackPluginTemplateCustomizer } = require("template-ejs-loader");
const glob = require("glob");
const pkConfig = require("../package.json").config;

/*
 * data
 */
const isProd = process.env.NODE_ENV === "production";
const config = {
  path: {
    html: {
      root: path.resolve(__dirname, "../src/html/"),
      glob: path.resolve(__dirname, "../src/html/**/*.ejs"),
    },
    img: {
      root: path.resolve(__dirname, "../src/images/"),
    },
    ejs: {
      root: path.resolve(__dirname, "../src/ejs/"),
    },
    js: {
      root: path.resolve(__dirname, "../src/scripts/"),
    },
    build: {
      root: path.resolve(__dirname, "../build/"),
    }
  }
};

// html file set
const templateData = glob.sync(config.path.html.glob, {
  ignore: ["**/_*.ejs"],
}).map((file) => {
  return {
    filename: file.replace(config.path.html.root + "/", '').replace(".ejs", ".html"),
    filepath: file,
  };
});

/*
 * helper
 */
const htmlGlobPlugins = (_entries) => {
  return Object.keys(_entries).map(
    (key) => new HtmlWebpackPlugin({
      // chunks: Object.keys(entries),
      filename: _entries[key].filename,
      template: htmlWebpackPluginTemplateCustomizer({
        templatePath: _entries[key].filepath,
        htmlLoaderOption: {
          minimize: isProd, // html-loaderのminify設定
        },
        templateEjsLoaderOption: {
          data: {
            isProd: isProd,
            path: {
              img: config.path.img.root,
              ejs: config.path.ejs.root,
              breakP: pkConfig.breakpoints.md,
            }
          }
        },
      }),
      inject: isProd ? false : "head",
      minify: isProd,  // html-webpack-pluginのminify設定
    }),
  );
};

/*
 * helper
 */
const modules = {
  stats: 'errors-only',
  entry: {
    app: path.resolve(__dirname, "../src/scripts/index.js"),
  },
  output: {
    path: config.path.build.root,
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
    ...htmlGlobPlugins(templateData),
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

module.exports = modules;