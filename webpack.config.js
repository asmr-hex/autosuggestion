const path = require('path');

/*
  once webpack support es modules as library targets,
  (see https://github.com/webpack/webpack/issues/2933)
  we can add support for that.
*/
module.exports = [
  {
    name: 'umd bundle',
    entry: {
      'auto-complete': './src/index.ts',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    }, 
    output: {
      filename: '[name].umd.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'autocomplete',
      libraryTarget: 'umd',
      globalObject: "this",
    },    
  },
]
