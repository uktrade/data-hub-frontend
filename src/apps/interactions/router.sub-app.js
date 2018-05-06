const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { postCreate, renderCreate } = require('./controllers/create')

const { postDetails, getInteractionDetails } = require('./middleware/details')

router.param('interactionId', getInteractionDetails)

router
  .route('/interactions/create')
  .post(
    postCreate,
    renderCreate,
  )
  .get(
    renderCreate,
  )

router.route([
  '/interactions/create/:kind',
  '/interactions/:interactionId/:kind/edit',
])
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/interactions/:interactionId', renderDetailsPage)

module.exports = router
