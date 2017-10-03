const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { getInteractionsCollection, getRequestBody, getDetails } = require('./middleware')
const { postDetails } = require('./middleware/details')
const { renderCreatePage, postAddStep1, renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { renderInteractionList } = require('./controllers/list')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', getDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getInteractionsCollection, renderInteractionList)

router
  .route(/^\/create(\/1)?$/)
  .post(postAddStep1)
  .all(renderCreatePage)

router.route(['/create/2', '/:id/edit'])
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/:interactionId', renderDetailsPage)

module.exports = router
