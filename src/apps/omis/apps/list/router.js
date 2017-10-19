const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { setCollectionResults, setReconciliationResults, setRequestBody } = require('./middleware')
const { renderCollectionList, renderReconciliationList } = require('./controllers')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'created_on:desc',
}

router
  .route(['/', '/reconciliation'])
  .all(setDefaultQuery(DEFAULT_COLLECTION_QUERY), setRequestBody)

router.get('/', setCollectionResults, renderCollectionList)
router.get('/reconciliation', setReconciliationResults, renderReconciliationList)

module.exports = router
