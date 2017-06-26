const router = require('express').Router()

const detailsController = require('./controllers/details')
const editController = require('./controllers/edit')

router.param('interactionId', detailsController.getCommon)

router
  .route('/add-step-1/')
  .get(detailsController.getAddStep1)
  .post(detailsController.postAddStep1)

router
  .route([
    '/add/',
    '/:interactionId/edit',
    '/edit/',
  ])
  .get(editController.editDetails)
  .post(editController.postDetails)

router.get('/:interactionId/details', detailsController.getInteractionDetails)

module.exports = router
