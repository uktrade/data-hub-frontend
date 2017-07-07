const router = require('express').Router()

const { handleFormPost } = require('./middleware')
const {
  renderEntityList,
  renderFormElements,
  renderIndex,
  renderMessages,
} = require('./controllers')

router
  .get('/', renderIndex)
  .get('/messages', renderMessages)
  .get('/entity-list', renderEntityList)
  .get('/form', renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
