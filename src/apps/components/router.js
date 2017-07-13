const router = require('express').Router()

const { handleFormPost, handleEntitySearch } = require('./middleware')
const {
  renderEntityList,
  renderFormElements,
  renderIndex,
  renderMessages,
  renderBreadcrumbs,
  renderPagination,
} = require('./controllers')

router
  .get('/', renderIndex)
  .get('/breadcrumbs', renderBreadcrumbs)
  .get('/messages', renderMessages)
  .get('/entity-list', renderEntityList)
  .get('/pagination', renderPagination)
  .get('/form', handleEntitySearch, renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
