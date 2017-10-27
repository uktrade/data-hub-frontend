const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { renderCollectionList, renderReconciliationList } = require('./controllers')
const {
  setCollectionResults,
  setReconciliationResults,
  setRequestBody,
} = require('./middleware')

const DEFAULT_QUERY = {
  sortby: 'created_on:desc',
}

const DEFAULT_QUERY_RECONCILIATION = {
  sortby: 'payment_due_date:asc',
  status: 'quote_accepted',
}

router.get('/',
  setDefaultQuery(DEFAULT_QUERY),
  setRequestBody,
  setCollectionResults,
  renderCollectionList
)

router.get('/reconciliation',
  setDefaultQuery(DEFAULT_QUERY_RECONCILIATION),
  setRequestBody,
  setReconciliationResults,
  renderReconciliationList
)

module.exports = router
