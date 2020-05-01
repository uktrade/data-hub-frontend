const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderCompletePage, postComplete } = require('./controllers/complete')
const { renderInteractionsForEntity } = require('./controllers/list')
const { postDetails, getInteractionDetails } = require('./middleware/details')
const {
  getInteractionsRequestBody,
  getInteractionCollectionForEntity,
  getInteractionSortForm,
} = require('./middleware/collection')
const { detectUserAgent } = require('../../middleware/detect-useragent')
const addInteractionRouter = require('./apps/add-interaction/router')

router.param('interactionId', getInteractionDetails)

router.get(
  '/interactions',
  getInteractionsRequestBody,
  getInteractionCollectionForEntity,
  getInteractionSortForm,
  renderInteractionsForEntity
)

router.use(addInteractionRouter)

router
  .route('/interactions/:interactionId/edit/:theme/:kind')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/interactions/:interactionId', renderDetailsPage)

router
  .route('/interactions/:interactionId/complete')
  .post(detectUserAgent, postComplete, renderCompletePage)
  .get(detectUserAgent, renderCompletePage)

module.exports = router
