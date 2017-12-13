module.exports = (options, req) => ({
  entry: './scroll-flip-page.vue',
  format: 'umd',
  component: 'ScrollFlipPage',
  moduleName: 'ScrollFlipPage',
  sourceMap: false,
  html: false,
  filename: {
    js: 'scroll-flip-page.js'
  },
  webpack(config) {
    config.externals = {
      'finger-mover': 'finger-mover',
      'simulation-scroll-y': 'simulation-scroll-y'
    }
    return config
  }
})