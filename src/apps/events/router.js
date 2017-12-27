const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { GLOBAL_NAV_ITEMS } = require('../constants')
const { DEFAULT_COLLECTION_QUERY } = require('./constants')

const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { postDetails, getEventDetails } = require('./middleware/details')
const { getRequestBody, getEventsCollection } = require('./middleware/collection')
const { renderEventList } = require('./controllers/list')


router.param('id', getEventDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody,
  getEventsCollection,
  renderEventList,
)

router.route(['/create', '/:id/edit'])
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/:id', renderDetailsPage)

module.exports = router
