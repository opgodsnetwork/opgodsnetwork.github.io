// webpack.config.js or similar
module.exports = {
  module: {
    rules: [
      {
        test: /\.(gltf|glb)$/,
        use: ['gltf-loader']
      }
    ]
  }
}
