const path = require("path");
const webpack = require("webpack");
const { InjectManifest } = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "*.png", context: "public" },
        { from: "*.json", context: "public" },
        { from: "*.ico", context: "public" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Adjust the path if needed
      filename: "index.html",
    }),
    new InjectManifest({
      swSrc: "./src/workbox.js",
      swDest: "service-worker.js",
      exclude: [/\.LICENSE\./, /\.map$/],
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_BASE_URL": JSON.stringify(
        process.env.REACT_APP_BASE_URL
      ),
      "process.env.REACT_APP_USERNAME": JSON.stringify(
        process.env.REACT_APP_USERNAME
      ),
      "process.env.REACT_APP_PASSWORD": JSON.stringify(
        process.env.REACT_APP_PASSWORD
      ),
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
};
