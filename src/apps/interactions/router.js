const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderInteractionList } = require('./controllers/list')

const { setDefaultQuery } = require('../middleware')
const { getInteractionCollection } = require('./middleware/collection')
const { postDetails, getInteractionOptions, getInteractionDetails } = require('./middleware/details')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', getInteractionDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getInteractionCollection, renderInteractionList)

router
  .route('/:interactionId/:kind/edit')
  .post(
    getInteractionOptions,
    postDetails,
    renderEditPage,
  )
  .get(
    getInteractionOptions,
    renderEditPage,
  )

router.get('/:interactionId', renderDetailsPage)

module.exports = router
