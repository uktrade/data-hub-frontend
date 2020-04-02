const router = require('express').Router()

const {
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderCompletePage, postComplete } = require('./controllers/complete')
const { renderInteractionList } = require('./controllers/list')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')
const { getRequestBody } = require('../../middleware/collection')
const { detectUserAgent } = require('../../middleware/detect-useragent')

const { setDefaultQuery, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('./middleware/collection')

const { postDetails, getInteractionDetails } = require('./middleware/details')

const addInteractionRouter = require('./apps/add-interaction/router')
const addInteractionStubRouter = require('./apps/add-interaction-stub/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('interactionId', getInteractionDetails)

router.use(addInteractionStubRouter)
router.use(addInteractionRouter)

router.get(
  '/',
  detectUserAgent,
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

router
  .route('/:interactionId/edit/:theme/:kind')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/:interactionId', renderDetailsPage)

router
  .route('/:interactionId/complete')
  .post(detectUserAgent, postComplete, renderCompletePage)
  .get(detectUserAgent, renderCompletePage)

module.exports = router
