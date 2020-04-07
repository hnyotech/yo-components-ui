'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API:'"http://dev.hnyotech.com.cn:1010/assetsapi"',
  AttachAPI: '"http://dev.hnyotech.com.cn:1010/baseapi"',
  // API:'"http://localhost:50070"',
  // AttachAPI: '"http://localhost:50070"',
})
