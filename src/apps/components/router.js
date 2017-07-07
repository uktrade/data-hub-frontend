const router = require('express').Router()

const { handleFormPost } = require('./middleware')
const {
  renderEntityList,
  renderFormElements,
  renderIndex,
  renderMessages,
  renderBreadcrumbs,
} = require('./controllers')

router
  .get('/', renderIndex)
  .get('/breadcrumbs', renderBreadcrumbs)
  .get('/messages', renderMessages)
  .get('/entity-list', renderEntityList)
  .get('/form', renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
