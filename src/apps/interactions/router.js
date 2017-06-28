const router = require('express').Router()

const detailsController = require('./controllers/details')
const editController = require('./controllers/edit')

router.param('interactionId', detailsController.getCommon)

router.get('/create', (req, res) => { res.redirect('create/1') })
router
  .route('/create/1')
  .get(detailsController.getAddStep1)
  .post(detailsController.postAddStep1)

router
  .route([
    '/create/2',
    '/:interactionId/edit',
  ])
  .get(editController.editDetails)
  .post(editController.postDetails)

router.get('/:interactionId', detailsController.getInteractionDetails)

module.exports = router
