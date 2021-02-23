const router = require('express').Router()

const {
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')
const { renderInteractionList } = require('./controllers/list')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')
const { getRequestBody } = require('../../middleware/collection')

const { setDefaultQuery, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('./middleware/collection')

const subAppRouter = require('./router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.get(
  '/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractionList
)

router.get(
  '/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('interaction')
)

router.use(subAppRouter)

module.exports = router
