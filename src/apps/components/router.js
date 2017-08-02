const router = require('express').Router()

const { handleFormPost, handleEntitySearch } = require('./middleware')
const {
  renderEntityList,
  renderFormElements,
  renderIndex,
  renderMessages,
  renderLocalHeader,
  renderBreadcrumbs,
  renderPagination,
  renderResults,
} = require('./controllers')

const {
  getInvestmentProjectsCollection,
} = require('../investment-projects/middleware/collection')

router
  .get('/', renderIndex)
  .get('/breadcrumbs', renderBreadcrumbs)
  .get('/messages', renderMessages)
  .get('/entity-list', renderEntityList)
  .get('/local-header', renderLocalHeader)
  .get('/pagination', renderPagination)
  .get('/results', getInvestmentProjectsCollection, renderResults)
  .get('/form', handleEntitySearch, renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
