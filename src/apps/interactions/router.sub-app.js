const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { postCreate, renderCreate } = require('./controllers/create')
const { renderInteractionsForEntity } = require('./controllers/list')
const { postDetails, getInteractionDetails } = require('./middleware/details')
const { getInteractionsRequestBody, getInteractionCollectionForEntity, getInteractionSortForm } = require('./middleware/collection')

router.param('interactionId', getInteractionDetails)

router.get('/interactions',
  getInteractionsRequestBody,
  getInteractionCollectionForEntity,
  getInteractionSortForm,
  renderInteractionsForEntity,
)

router
  .route('/interactions/create')
  .post(
    postCreate,
    renderCreate,
  )
  .get(
    renderCreate,
  )

router.route('/interactions/create/:theme/:kind')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.route('/interactions/:interactionId/:theme/:kind/edit')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/interactions/:interactionId', renderDetailsPage)

module.exports = router
