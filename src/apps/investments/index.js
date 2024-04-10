throw Error('Is this used?')
const router = require('./router')
const { root } = require('./paths')

module.exports = {
  displayName: 'Investments',
  mountpath: root,
  router,
}
