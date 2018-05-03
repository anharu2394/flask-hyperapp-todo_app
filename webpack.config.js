module.exports = {
  mode: 'development',
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/static"     
  },
  module: {
      rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {'modules': false}]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules'],
      }
    ]
  }
 
}
