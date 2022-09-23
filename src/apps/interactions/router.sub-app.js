const router = require('express').Router()

const urls = require('../../lib/urls')
const { renderDetailsPage } = require('./controllers/details')
const { renderCompletePage, postComplete } = require('./controllers/complete')
const { renderInteractionsForEntity } = require('./controllers/list')
const { getInteractionDetails } = require('./middleware/details')
const {
  getInteractionsRequestBody,
  getInteractionCollectionForEntity,
  getInteractionSortForm,
} = require('./middleware/collection')
const userFeatures = require('../../middleware/user-features')

const detailsFormRouter = require('./apps/details-form/router')
const {
  ACTIVITY_STREAM_FEATURE_FLAG,
} = require('../companies/apps/activity-feed/constants')

router.param('interactionId', getInteractionDetails)

router.get(
  '/',
  getInteractionsRequestBody,
  getInteractionCollectionForEntity,
  getInteractionSortForm,
  userFeatures(ACTIVITY_STREAM_FEATURE_FLAG),
  renderInteractionsForEntity
)

router.use(detailsFormRouter)

router.get(urls.interactions.detail.route, renderDetailsPage)

router
  .route(urls.interactions.complete.route)
  .post(postComplete, renderCompletePage)
  .get(renderCompletePage)

module.exports = router
