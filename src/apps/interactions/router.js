const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { getInteractionsCollection, getRequestBody } = require('./middleware')
const { detailsController, listController, editController } = require('./controllers')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', detailsController.getCommon)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getInteractionsCollection, listController.renderInteractionList)

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
