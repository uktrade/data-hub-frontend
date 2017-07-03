const router = require('express').Router()
const { renderIndex, renderFormElements } = require('./controllers')
const { handleFormPost } = require('./middleware')

router
  .get('/', renderIndex)
  .get('/form', renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
