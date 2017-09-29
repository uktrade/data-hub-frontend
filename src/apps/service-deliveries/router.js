const router = require('express').Router()

const { fetchDetails, postDetails } = require('./middleware')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')

router.param('serviceDeliveryId', fetchDetails)

router
  .route(['/:serviceDeliveryId/edit', '/create'])
  .post(postDetails)
  .all(renderEditPage)

router.get('/:serviceDeliveryId', renderDetailsPage)

module.exports = router
