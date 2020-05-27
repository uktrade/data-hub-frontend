const urls = require('../../lib/urls')

const { myPipelineRouter } = require('./router')

module.exports = {
  displayName: 'My Pipeline',
  mountpath: urls.pipeline.edit.mountPoint,
  router: myPipelineRouter,
}
