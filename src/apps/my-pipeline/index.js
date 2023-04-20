const { myPipelineRouter } = require('./router')

module.exports = {
  displayName: 'My Pipeline',
  mountpath: '/my-pipeline',
  router: myPipelineRouter,
}
