const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { getInteractionCollection } = require('./middleware/collection')
const { getInteractionDetails } = require('../interactions/middleware/details')
const { renderDetailsPage } = require('./controllers/details')
const { renderInteractionList } = require('./controllers/list')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', getInteractionDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getInteractionCollection, renderInteractionList)

router.get('/:interactionId', renderDetailsPage)

module.exports = router
