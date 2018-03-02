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
  renderMetaList,
} = require('./controllers')

const { adviserLookup } = require('./middleware')
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
  .get('/meta-list', renderMetaList)
  .all('/form', adviserLookup, renderFormElements)

module.exports = router
