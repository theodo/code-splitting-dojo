module.exports = function override(config, env) {
  const analyzeBundle = process.argv.indexOf("--analyze-bundle") !== -1;

  if (analyzeBundle) {
    const rewireWebpackBundleAnalyzer = require("react-app-rewire-webpack-bundle-analyzer");
    config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: "static",
      reportFilename: "report.html"
    });
  }

  config.optimization.splitChunks = {
    chunks: "all",
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        enforce: true,
        name(module) {
          // get the name. E.g. node_modules/packageName/not/this/part.js
          // or node_modules/packageName
          const packageName = module.context.match(
            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
          )[1];

          // npm package names are URL-safe, but some servers don't like @ symbols
          return `npm.${packageName.replace("@", "")}`;
        }
      }
    }
  };

  return config;
};
