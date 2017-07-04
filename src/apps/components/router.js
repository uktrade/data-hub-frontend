const router = require('express').Router()
const { renderIndex, renderFormElements, renderMessages } = require('./controllers')
const { handleFormPost } = require('./middleware')

router
  .get('/', renderIndex)
  .get('/messages', renderMessages)
  .get('/form', renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
