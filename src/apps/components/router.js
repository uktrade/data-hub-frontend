const router = require('express').Router()

const {
  renderEntityList,
  renderIndex,
  renderMessages,
  renderLocalHeader,
  renderBreadcrumbs,
  renderPagination,
  renderProgress,
  renderResults,
} = require('./controllers')

const { handleFormPost, handleEntitySearch } = require('./form/middleware')
const { renderFormElements } = require('./form/controllers')

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
  .get('/progress', renderProgress)
  .get('/form', handleEntitySearch, renderFormElements)
  .post('/form', handleFormPost, renderFormElements)

module.exports = router
