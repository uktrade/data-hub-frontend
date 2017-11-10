const router = require('express').Router()

const {
  renderEntityList,
  renderIndex,
  renderMessages,
  renderLocalHeader,
  renderBreadcrumbs,
  renderPagination,
  renderProgress,
  renderCollection,
  renderKeyValueTables,
  renderHiddenText,
} = require('./controllers')

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
  .get('/collection', getInvestmentProjectsCollection, renderCollection)
  .get('/progress', renderProgress)
  .get('/keyvaluetables', renderKeyValueTables)
  .get('/hidden-text', renderHiddenText)
  .all('/form', renderFormElements)

module.exports = router
