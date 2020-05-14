const urls = require('../../../../lib/urls')

const router = require('./router')

module.exports = {
  mountpath: urls.companies.pipeline.mountPoint,
  router,
}
