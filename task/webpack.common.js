const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { htmlWebpackPluginTemplateCustomizer } = require("template-ejs-loader");
const glob = require("glob");
const pkConfig = require("../package.json").config;
const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs');

/*
 * data
 */
const isProd = process.env.NODE_ENV === "production";
const config = {
  path: {
    main: {
      root: path.resolve(__dirname, "../src"),
    },
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
      inject: "head", // memo: isProd ? false : "head",
      minify: isProd,  // html-webpack-pluginのminify設定
    }),
  );
};
const runIconFont = () => {
  // icons/svgフォルダにファイルが有るか確認
  const iconFontFiles = glob.sync(config.path.main.root + "/icons/svg/*.svg");
  if (iconFontFiles.length > 0) {
    return new WebpackIconfontPluginNodejs({
      fontName: 'icons',
      cssPrefix: 'ic',
      svgs: path.join(config.path.main.root, "/icons/svg/**/*.svg"),
      formats: ['eot', 'woff2', 'woff', 'ttf'],
      fontsOutput: path.join(config.path.main.root, "/icons/"),
      template: path.join(config.path.main.root, "/icons/templates/scss.njk"),
      cssOutput: path.join(config.path.main.root, "/styles/_mixins/_icons.scss"),
      cssFontPath: '../icons',
      htmlOutput: false
    });
  } else {
    return () => { };
  }
};

/*
 * helper
 */
const modules = {
  stats: 'errors-only',
  entry: {
    app: path.join(config.path.main.root, "/scripts/index.js"),
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
    }),
    runIconFont(),
  ],
  resolve: {
    alias: {
      "@": config.path.main.root,
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