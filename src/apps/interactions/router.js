const router = require('express').Router()

const { getDetails } = require('./middleware')
const { renderCreatePage, postAddStep1, renderDetailsPage } = require('./controllers/details')
const { renderEditPage, postDetails } = require('./controllers/edit')

router.param('interactionId', getDetails)

router
  .route(/^\/create(\/1)?$/)
  .post(postAddStep1)
  .all(renderCreatePage)

router
  .route([
    '/create/2',
    '/:interactionId/edit',
  ])
  .post(postDetails)
  .all(renderEditPage)

router.get('/:interactionId', renderDetailsPage)

module.exports = router
