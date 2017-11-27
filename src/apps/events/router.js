const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { postDetails, getEventDetails, setActiveAdvisers } = require('./middleware/details')
const { setAllAdvisers } = require('../adviser/middleware')
const { getRequestBody, getEventsCollection } = require('./middleware/collection')
const { renderEventList } = require('./controllers/list')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

router.param('id', getEventDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setAllAdvisers,
  getRequestBody,
  getEventsCollection,
  renderEventList,
)

router.route(['/create', '/:id/edit'])
  .all(setActiveAdvisers)
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/:id', renderDetailsPage)

module.exports = router
